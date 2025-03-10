import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth, getAuth } from '@angular/fire/auth';
import { bracketData, nicknames, regionOrder } from '../constants';


class Team {
  name: string;
  seed: number;
  image: string;
  nickname: string;
  displayName: string;
  shortDisplayName: string;

  constructor(name: string, seed: number) {
    this.name = name;
    this.seed = seed;
    this.image = `assets/teams/${name}.jpg`;
    this.nickname = nicknames[name] || '';
    this.displayName = `${this.name} ${this.nickname}`;
    this.shortDisplayName = `${this.name}`;
  }
}

class Region {
  name: string;
  bracket: (Team | null)[][] = [];
  currentMatchupIndex: number = 0;
  roundIndex = 0;
  champion: Team | null = null;
  nPicks: number = 0;
  totalPicks: number;

  constructor(name: string) {
    this.name = name;
    this.bracket = [];
    if (name === "final_four") {
      this.totalPicks = 3;
    } else {
      this.totalPicks = 15;
    }
  }

  initializeBracket(teams: Team[]) {
    // Correct first-round matchup ordering
    let matchupOrder = [];
    if (teams.length === 16) {
      // Standard Regions
      matchupOrder = [0, 7, 3, 4, 2, 5, 1, 6];
    } else {
      // Final Four
      matchupOrder = [0, 1];
    }
    
    this.bracket[0] = [];
    for (let i of matchupOrder) {
      this.bracket[0].push(teams[i]);
      this.bracket[0].push(teams[teams.length - 1 - i]);
    }
    
    for (let i = 1; i <= Math.log2(teams.length); i++) {
      this.bracket[i] = new Array(teams.length / Math.pow(2, i)).fill(null); // Empty slots for next rounds
    }
  }

  startNewRound() {
    this.currentMatchupIndex = 0;
  }

  advanceRound() {
    this.roundIndex++;
    if (this.roundIndex < this.bracket.length - 1) {
      this.startNewRound();
    } else {
      this.champion = this.bracket[this.roundIndex][0];
    }
  }


  handleWinnerSelection(winner: Team) {
    this.nPicks++;
    const nextRoundIndex = this.roundIndex + 1;
    const position = Math.floor(this.currentMatchupIndex / 2);
    this.bracket[nextRoundIndex][position] = winner;
    
    if (this.currentMatchupIndex + 2 < this.bracket[this.roundIndex].length) {
      this.currentMatchupIndex += 2;
    } else {
      this.advanceRound();
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class BracketService {
  private year = 2024;
  private finalFourTeams: Record<string, Team | null> = {"east": null, "west": null, "midwest": null, "south": null};
  private finalFourActive = false;
  private regions: Record<string, Region | null> = {};
  region!: Region;

  regions$ = new BehaviorSubject<Record<string, Region | null>>(this.regions);
  finalFourActive$ = new BehaviorSubject<boolean>(this.finalFourActive);
  year$ = new BehaviorSubject<number>(this.year);
  

  constructor(private firestore: Firestore, private auth: Auth) {
    this.setYear(this.year);
  }

  setYear(year: number) {

    for (let region_name of regionOrder[year]) {
      this.regions[region_name] = new Region(region_name)
      this.regions[region_name].initializeBracket(bracketData[year][region_name].map((name, index) => new Team(name, index + 1)));
    }

    this.regions["final_four"] = new Region("final_four");
    this.region = this.regions["east"]!;
  }

  getYear() {
    return this.year;
  }

  getRegionOrder() {
    return regionOrder[this.year];
  }

  selectRegion(region_name: string) {
    this.region = this.regions[region_name]!;
  }

  handleWinnerSelection(winner: Team) {
    this.region.handleWinnerSelection(winner);
    if (this.region.champion) {
      this.finalFourTeams[this.region.name] = this.region.champion;
      // Check if all finalFourTeams are non-null
      if ((this.regions["final_four"]!.bracket.length === 0) && Object.values(this.finalFourTeams).every(team => team !== null)) {
        this.initializeFinalFour();
      }
    }
  }

  initializeFinalFour() {
    let finalFourTeams = Object.values(this.finalFourTeams).filter(team => team !== null) as Team[]
    this.regions["final_four"]!.initializeBracket(finalFourTeams);
    this.finalFourActive = true;
  }

  getRegionBracket(region_name: string) {
    return this.regions[region_name]!.bracket;
  }

  getCurrentMatchup() {
    return [
      this.region.bracket[this.region.roundIndex][this.region.currentMatchupIndex],
      this.region.bracket[this.region.roundIndex][this.region.currentMatchupIndex + 1],
    ];
  }

  getRegionChampion(region_name: string | null = null) {
    if (region_name) {
      return this.regions[region_name]!.champion;
    } else {
      return this.region.champion;
    }
  }

  get isComplete(): boolean {
    return this.getRegionChampion("final_four") !== null;
  }

  getRegionProgress(region_name: string) {
    return [this.regions[region_name]!.nPicks, this.regions[region_name]!.totalPicks!];
  }

  getRegionNPicks(region_name: string) {
    return this.regions[region_name]!.nPicks;
  }

  getRegionTotalPicks(region_name: string) {
    return this.regions[region_name]!.totalPicks;
  }

  async saveBracket() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const userBracketRef = doc(this.firestore, `brackets/${user.uid}/${this.year}/data`);
    
    await setDoc(userBracketRef, { 
      bracket: this.regions, 
      finalFourTeams: this.finalFourTeams,
      finalFourActive: this.finalFourActive,
      timestamp: new Date() 
    })
    .then(() => console.log(`Bracket saved successfully`))
    .catch((error) => console.error('Error saving bracket:', error));
  }

  async loadBracket(year?: number): Promise<boolean> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    if (year && year !== this.year) {
      this.year = year;
    }
    const selectedYear = year || this.year; // Default to the currently selected year
    const userBracketRef = doc(this.firestore, `brackets/${user.uid}/${selectedYear}/data`);
    
    const snapshot = await getDoc(userBracketRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      this.regions = data['bracket']; 
      this.finalFourTeams = data['finalFourTeams'];
      this.finalFourActive = data['finalFourActive'];

      console.log(`Bracket loaded for year ${selectedYear}:`, this.regions);
      this.regions$.next(this.regions);
    } else {
      console.log(`No saved bracket found for year ${selectedYear}`);
    }
    return new Promise((resolve) => {
      resolve(snapshot.exists());
    });
  }

}
