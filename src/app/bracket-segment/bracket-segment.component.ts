import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BracketService } from '../services/bracket.service';
import { MatchupComponent } from '../matchup/matchup.component';

@Component({
  selector: 'app-bracket-segment',
  standalone: true,
  imports: [CommonModule, MatchupComponent],
  templateUrl: './bracket-segment.component.html',
  styleUrl: './bracket-segment.component.css'
})
export class BracketSegmentComponent implements OnInit, OnChanges {
  @Input() currentRegion: string | null = null;
  @Input() reverseOrder: boolean = false;
  @Input() roundHeaders: boolean = true;
  bracket: any[][] = [];
  roundNames: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private bracketService: BracketService) {}

  ngOnInit() {
    // Wait for the bracket to be fully loaded before initializing
    this.bracketService.bracketLoaded$.subscribe(loaded => {
      if (loaded) {
        this.initialize();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentRegion'] && !changes['currentRegion'].firstChange) {
      console.log("🔄 Region changed:", this.currentRegion);
      this.initialize();
    }
  }

  initialize() {
    let region_name = this.currentRegion || "east"
    this.bracket = this.bracketService.getRegionBracket(region_name);
    let n_rounds = this.bracket.length
    if (region_name == "final_four") {
      this.roundNames = ["Final Four", "Championship"];
    } else {
      this.roundNames = Array.from({ length: n_rounds }, (_, i) => `Round ${i + 1}`);
    }
  }

  getMatchupPairs(round: any[]): any[][] {
    const pairs: any[][] = [];
    for (let i = 0; i < round.length; i += 2) {
      pairs.push([round[i], round[i + 1]]);
    }
    return pairs;
  }

  getBracketRounds(): any[][] {
    let bracketSlice = this.bracket.slice(0, this.bracket.length-1)
    return this.reverseOrder ? bracketSlice.reverse() : bracketSlice;
  }
}