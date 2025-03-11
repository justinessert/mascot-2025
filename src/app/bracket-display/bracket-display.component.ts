import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';
import { BracketService } from '../services/bracket.service';

@Component({
  selector: 'app-bracket-display',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe],
  templateUrl: './bracket-display.component.html',
  styleUrls: ['./bracket-display.component.css']
})
export class BracketDisplayComponent implements OnInit {
  currentRegion: string | null = null;
  bracket: any[][] = [];
  champion: any | null = null;

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
    this.route.paramMap.subscribe(params => {
      this.currentRegion = params.get('region');
      this.bracket = this.bracketService.getRegionBracket(this.currentRegion || "east");
      this.champion = this.bracketService.getRegionChampion(this.currentRegion);
    });
    
  }

  getMatchupPairs(round: any[]): any[][] {
    const pairs: any[][] = [];
    for (let i = 0; i < round.length; i += 2) {
      pairs.push([round[i], round[i + 1]]);
    }
    return pairs;
  }
}

