import { Component, Input, OnInit } from '@angular/core';
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
export class BracketSegmentComponent implements OnInit {
  @Input() currentRegion: string | null = null;
  @Input() reverseOrder: boolean = false;
  @Input() roundHeaders: boolean = true;
  bracket: any[][] = [];

  constructor(private route: ActivatedRoute, private router: Router, private bracketService: BracketService) {}

  ngOnInit() {
    // Wait for the bracket to be fully loaded before initializing
    this.bracketService.bracketLoaded$.subscribe(loaded => {
      if (loaded) {
        this.initialize();
      }
    });
  }

  initialize() {
    this.bracket = this.bracketService.getRegionBracket(this.currentRegion || "east");
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