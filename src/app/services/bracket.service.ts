import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth, user, User } from '@angular/fire/auth';
import { bracketData, currentYear, nicknames, regionOrder } from '../constants';


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

  static from_dict(data: Record<string, any> | null): Team | null {
    if (!data) return null;
    return new Team(data["name"], data["seed"]);
  }

  to_dict(): Record<string, any> {
    return {
      name: this.name,
      seed: this.seed,
    };
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

  static from_dict(data: Record<string, any>): Region {
    const region = new Region(data["name"]);

    Object.keys(data["bracket"]).forEach(round => {
      region.bracket[+round] = data["bracket"][round].map((team: any) => team ? Team.from_dict(team) : null);
    });

    region.currentMatchupIndex = data["currentMatchupIndex"];
    region.roundIndex = data["roundIndex"];
    region.champion = data["champion"] ? Team.from_dict(data["champion"]) : null;
    region.nPicks = data["nPicks"];
    region.totalPicks = data["totalPicks"];
    return region;
  }

  to_dict(): Record<string, any> {
    return {
      name: this.name,
      bracket: Object.keys(this.bracket).reduce((acc, round: any) => {
        acc[round] = this.bracket[round].map((team: any) => team ? team.to_dict() : null);
        return acc;
      }, {} as Record<string, any>),
      currentMatchupIndex: this.currentMatchupIndex,
      roundIndex: this.roundIndex,
      champion: this.champion ? this.champion.to_dict() : null,
      nPicks: this.nPicks,
      totalPicks: this.totalPicks,
    };
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
  user: User | null = null;
  region!: Region;
  saved: boolean = false;
  name: string = '';
  private bracketLoadedSubject = new BehaviorSubject<boolean>(false);
  bracketLoaded$ = this.bracketLoadedSubject.asObservable();

  regions$ = new BehaviorSubject<Record<string, Region | null>>(this.regions);
  finalFourActive$ = new BehaviorSubject<boolean>(this.finalFourActive);
  year$ = new BehaviorSubject<number>(this.year);
  

  constructor(private firestore: Firestore, private authObj: Auth) {
    this.initialize(this.year);

    user(authObj).subscribe(authUser => {
      this.user = authUser;
    });
  }

  initialize(year?: number) {
    this.bracketLoadedSubject.next(false);
    year = year || currentYear;
    this.year = year;

    for (let region_name of regionOrder[year]) {
      this.regions[region_name] = new Region(region_name)
      this.regions[region_name].initializeBracket(bracketData[year][region_name].map((name, index) => new Team(name, index + 1)));
    }

    this.regions["final_four"] = new Region("final_four");
    this.region = this.regions["east"]!;
    this.bracketLoadedSubject.next(true);
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
    if (!this.user) {
      console.error('User not authenticated');
      return;
    }

    const userBracketRef = doc(this.firestore, `brackets/${this.year}/${this.user.uid}/data`);

    let regionsDict = Object.fromEntries(Object.entries(this.regions).map(([key, region]) => [key, region ? region.to_dict() : null]));
    let finalFourTeamsDict = Object.fromEntries(Object.entries(this.finalFourTeams).map(([key, team]) => [key, team ? team.to_dict() : null]));
    
    await setDoc(userBracketRef, {
      // set bracket as regions.map(region => region.to_dict())
      bracket: regionsDict,
      // Map the values of finalFourTeams to their to_dict() values but keep it in a record format
      finalFourTeams: finalFourTeamsDict,
      finalFourActive: this.finalFourActive,
      timestamp: new Date(),
      name: this.name,
        })
        .then(() => {
      this.saved = true;
    })
    .catch((error) => console.error('Error saving bracket:', error));
  }

  async loadBracket(year?: number, user: User | null = null): Promise<boolean> {
    user = user || this.user
    this.bracketLoadedSubject.next(false);
    if (!user) {
      console.error('User not authenticated');
      this.bracketLoadedSubject.next(true);
      return new Promise((resolve) => {
        resolve(false);
      });
    }

    if (year && year !== this.year) {
      this.year = year;
    }
    const selectedYear = year || this.year; // Default to the currently selected year
    const userBracketRef = doc(this.firestore, `brackets/${selectedYear}/${user.uid}/data`);
    
    const snapshot = await getDoc(userBracketRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      this.regions = Object.fromEntries(Object.entries(data['bracket']).map(([key, region]) => [key, Region.from_dict(region as Map<string, any>)]));
      this.finalFourTeams = Object.fromEntries(Object.entries(data['finalFourTeams']).map(([key, team]) => [key, Team.from_dict(team as Map<string, any>)]));
      this.finalFourActive = data['finalFourActive'];
      this.name = data['name'];

      this.regions$.next(this.regions);
      this.saved = true;
    } else {
      console.log(`No saved bracket found for year ${selectedYear}`);
    }
    this.bracketLoadedSubject.next(true);
    return new Promise((resolve) => {
      resolve(snapshot.exists());
    });
  }

}
