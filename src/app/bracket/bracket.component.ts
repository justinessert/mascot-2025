import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WinnerSelectionComponent } from '../winner-selection/winner-selection.component';
import { BracketDisplayComponent } from '../bracket-display/bracket-display.component';


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
  shortDisplayName: string;

  constructor(name: string, seed: number) {
    this.name = name;
    this.seed = seed;
    this.image = `assets/teams/${name}.jpg`;
    this.nickname = nicknames[name] || '';
    this.displayName = `${this.seed}. ${this.name} ${this.nickname}`;
    this.shortDisplayName = `${this.seed}. ${this.name}`;
  }
}

@Component({
  selector: 'app-bracket',
  standalone: true,
  imports: [CommonModule, WinnerSelectionComponent, BracketDisplayComponent],
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css']
})
export class BracketComponent implements OnInit {
  regions = Object.keys(bracketData);
  selectedRegion: string | null = null;
  bracket: (Team | null)[][] = [];
  currentMatchupIndex: number = 0;
  roundIndex = 0;
  finalFour: (Team | null)[] = [];
  champion: Team | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const region = params.get('region');
      if (region && this.regions.includes(region)) {
        this.selectedRegion = region;
        this.initializeBracket(region);
      }
    });
  }

  selectRegion(region: string) {
    this.selectedRegion = region;
    this.initializeBracket(region);
    this.currentMatchupIndex = 0;
    this.startNewRound();
  }

  initializeBracket(region: string) {
    const teams = bracketData[region].map((name, index) => new Team(name, index + 1));
    this.bracket = [];
    
    // Correct first-round matchup ordering
    const matchupOrder = [0, 7, 3, 4, 2, 5, 1, 6];
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

  handleWinnerSelection(winner: Team) {
    const nextRoundIndex = this.roundIndex + 1;
    const position = Math.floor(this.currentMatchupIndex / 2);
    this.bracket[nextRoundIndex][position] = winner;
    
    if (this.currentMatchupIndex + 2 < this.bracket[this.roundIndex].length) {
      this.currentMatchupIndex += 2;
    } else {
      this.advanceRound();
    }
  }

  advanceRound() {
    this.roundIndex++;
    if (this.roundIndex < this.bracket.length - 1) {
      this.startNewRound();
    } else {
      this.champion = this.bracket[this.roundIndex][0];
      this.finalFour.push(this.bracket[this.roundIndex][0]);
    }
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
