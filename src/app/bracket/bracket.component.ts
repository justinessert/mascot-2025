import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


const bracketData: Record<string, string[]> = {
  east: [
    "uconn", "iowa_state", "illinois", "auburn", "san_diego_state", "byu", "washington_state", "florida_atlantic",
    "northwestern", "drake", "duquesne", "uab", "yale", "morehead_state", "south_dakota_state", "stetson"
  ],
  west: [
    "north_carolina", "arizona", "baylor", "alabama", "saint_marys", "clemson", "dayton", "mississippi_state",
    "michigan_state", "nevada", "new_mexico", "grand_canyon", "charleston", "colgate", "long_beach_state", "howard"
  ],
  midwest: [
    "purdue", "tennessee", "creighton", "kansas", "gonzaga", "south_carolina", "texas", "utah_state",
    "tcu", "colorado_state", "oregon", "mcneese", "samford", "akron", "saint_peters", "grambling_state"
  ],
  south: [
    "houston", "marquette", "kentucky", "duke", "wisconsin", "texas_tech", "florida", "nebraska",
    "texas_a&m", "colorado", "nc_state", "james_madison", "vermont", "oakland", "western_kentucky", "longwood"
  ]
};

const nicknames: Record<string, string> = {
    "akron": "zips",
    "alabama": "crimson tide",
    "appalachian_state": "mountaineers",
    "arizona_state": "sun devils",
    "arizona": "wildcats",
    "arkansas": "razorbacks",
    "auburn": "tigers",
    "baylor": "bears",
    "boise_state": "broncos",
    "bryant": "bulldogs",
    "butler": "bulldogs",
    "byu": "cougars",
    "central_connecticut": "blue devils",
    "charleston": "cougars",
    "chattanooga": "mocs",
    "cincinnati": "bearcats",
    "clemson": "tigers",
    "cleveland_state": "vikings",
    "colgate": "raiders",
    "colorado": "buffaloes",
    "colorado_state": "rams",
    "cornell": "big red",
    "creighton": "bluejays",
    "csu_fullerton": "titans",
    "davidson": "wildcats",
    "dayton": "flyers",
    "delaware": "blue hens",
    "drake": "bulldogs",
    "duke": "blue devils",
    "duquesne": "dukes",
    "eastern_kentucky": "colonels",
    "east_washington": "eagles",
    "fdu": "knights",
    "florida": "gators",
    "florida_atlantic": "owls",
    "furman": "paladins",
    "georgia_state": "panthers",
    "gonzaga": "bulldogs",
    "grambling_state": "tigers",
    "grand_canyon": "antelopes",
    "green_bay": "phoenix",
    "high_point": "purple panthers",
    "houston": "cougars",
    "howard": "bison",
    "illinois": "fighting illini",
    "indiana": "hoosiers",
    "indiana_state": "sycamores",
    "iona": "gaels",
    "iowa_state": "cardinals",
    "iowa": "hawks",
    "jacksonville_state": "gamecocks",
    "james_madison": "dukes",
    "kansas_state": "wildcats",
    "kansas": "jayhawks",
    "kennesaw_state": "owls",
    "kent_state": "golden flashes",
    "kentucky": "wildcats",
    "little_rock": "trojans",
    "long_beach_state": "the beach",
    "longwood": "lancers",
    "louisiana": "ragin cajuns",
    "lousiana_tech": "bulldogs",
    "loyola_chicago": "ramblers",
    "lsu": "tigers",
    "marquette": "golden eagles",
    "maryland": "terrapins",
    "mcneese": "cowboys",
    "memphis": "tigers",
    "merrimack": "warriors",
    "miami": "hurricanes",
    "michigan_state": "spartans",
    "michigan": "wolverines",
    "mississippi_state": "bulldogs",
    "missouri": "mizzou",
    "montana_state": "fighting bobcats",
    "morehead_state": "eagles",
    "murray_state": "racers",
    "nc_central": "eagles",
    "nc_state": "wolfpack",
    "nebraska": "cornhuskers",
    "new_mexico": "lobos",
    "new_mexico_state": "aggies",
    "new_orleans": "privateers",
    "norfolk_state": "spartans",
    "north_carolina": "tar heels",
    "north_dakota": "fighting hawks",
    "north_texas": "mean green",
    "northern_iowa": "panthers",
    "northern_kentucky": "norse",
    "northwestern": "wildcats",
    "notre_dame": "fighting irish",
    "oakland": "golden grizzlies",
    "ohio_state": "buckeyes",
    "oklahoma": "sooners",
    "ole_miss": "rebels",
    "oral_roberts": "golden eagles",
    "oregon": "ducks",
    "penn_state": "nittany lions",
    "pittsburgh": "panthers",
    "providence": "friars",
    "purdue": "boilmakers",
    "quinnipiac": "bobcats",
    "richmond": "spiders",
    "rutgers": "scarlet knights",
    "saint_johns": "red storm",
    "saint_marys": "gaels",
    "saint_peters": "peacocks",
    "sam_houston": "bearkats",
    "samford": "bulldogs",
    "san_diego_state": "aztecs",
    "san_francisco": "dons",
    "seton_hall": "pirates",
    "south_carolina": "gamecocks",
    "south_dakota_state": "jackrabbits",
    "south_florida": "bulls",
    "southeast_missouri_state": "redhawks",
    "stetson": "hatters",
    "tcu": "horned frogs",
    "tennessee": "volunteers",
    "texas_a&m_cc": "islanders",
    "texas_a&m": "aggies",
    "texas_southern": "tigers",
    "texas_state": "bobcats",
    "texas_tech": "red raiders",
    "texas": "longhorns",
    "toledo": "rockets",
    "troy": "trojans",
    "uab": "blazers",
    "ucla": "bruins",
    "uconn": "huskies",
    "ucsb": "bison",
    "uc_irvine": "anteaters",
    "unc_asheville": "bulldogs",
    "unc_wilmington": "seahawks",
    "usc": "trojans",
    "utah": "utes",
    "utah_state": "aggies",
    "vcu": "rams",
    "vermont": "catamounts",
    "villanova": "wildcats",
    "virginia_tech": "hokies",
    "virginia": "cavaliers",
    "wagner": "seahawks",
    "wake_forest": "demon deacons",
    "washington_state": "cougars",
    "west_virginia": "mountaineers",
    "western_kentucky": "hilltoppers",
    "wisconsin": "badgers",
    "wright_state": "raiders",
    "wyoming": "cowboys",
    "xavier": "musketeers",
    "yale": "bulldogs",
    "nevada": "wolf pack",
    "princeton": "tigers"
}

class Team {
  name: string;
  seed: number;
  image: string;
  nickname: string;
  displayName: string;

  constructor(name: string, seed: number) {
    this.name = name;
    this.seed = seed;
    this.image = `assets/teams/${name}.jpg`;
    this.nickname = nicknames[name] || '';
    this.displayName = `${this.capitalize(name)} ${this.capitalize(this.nickname)}`;
  }

  private capitalize(word: string): string {
    return word.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
}

@Component({
  selector: 'app-bracket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css']
})
export class BracketComponent {
  regions = Object.keys(bracketData);
  selectedRegion: string | null = null;
  bracket: (Team | null)[][] = [];
  currentMatchup: Team[] = [];
  roundIndex = 0;
  finalFour: (Team | null)[] = [];
  champion: Team | null = null;

  selectRegion(region: string) {
    this.selectedRegion = region;
    this.initializeBracket(region);
    this.startNewRound();
  }

  initializeBracket(region: string) {
    const teams = bracketData[region].map((name, index) => new Team(name, index + 1));
    this.bracket = [];
    
    // Ensure correct matchups: 1 vs 16, 2 vs 15, etc.
    this.bracket[0] = [];
    for (let i = 0; i < teams.length / 2; i++) {
      this.bracket[0].push(teams[i]);
      this.bracket[0].push(teams[teams.length - 1 - i]);
    }
    
    for (let i = 1; i <= Math.log2(teams.length); i++) {
      this.bracket[i] = new Array(teams.length / Math.pow(2, i)).fill(null); // Empty slots for next rounds
    }
  }

  startNewRound() {
    this.currentMatchup = [this.bracket[this.roundIndex].shift()!, this.bracket[this.roundIndex].shift()!];
  }

  chooseWinner(winner: Team) {
    this.bracket[this.roundIndex + 1][Math.floor(this.bracket[this.roundIndex].length / 2)] = winner;
    if (this.bracket[this.roundIndex].length > 0) {
      this.startNewRound();
    } else {
      this.roundIndex++;
      if (this.roundIndex < this.bracket.length - 1) {
        this.startNewRound();
      } else {
        this.finalFour.push(this.bracket[this.roundIndex][0]);
      }
    }
  }

  randomWinner() {
    this.chooseWinner(this.currentMatchup[Math.floor(Math.random() * 2)]);
  }

  startFinalFour() {
    this.selectedRegion = 'finalFour';
    this.bracket = [[...this.finalFour], [null, null], [null]];
    this.startNewRound();
  }

  declareChampion(winner: Team) {
    this.champion = winner;
  }
}
