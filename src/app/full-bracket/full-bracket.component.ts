import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BracketSegmentComponent } from '../bracket-segment/bracket-segment.component';
import { BracketService, Region, Team } from '../services/bracket.service';
import { MatchupComponent } from '../matchup/matchup.component';
import { regionOrder } from '../constants';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';

@Component({
  selector: 'app-full-bracket',
  standalone: true,
  imports: [CommonModule, MatchupComponent, BracketSegmentComponent, ReplaceUnderscorePipe],
  templateUrl: './full-bracket.component.html',
  styleUrls: ['./full-bracket.component.css']
})
export class FullBracketComponent {
  @Input() regions: Record<string, Region | null> = {};
  @Input() year: number = new Date().getFullYear();
  @Input() champion: Team | null = null;

  constructor() {}

  getFinalFourMatchups(): any[][]{
    let bracket = this.regions["final_four"]!.bracket;
    let semiFinalLeft = [bracket[0][0], bracket[0][1]]
    let semiFinalRight = [bracket[0][2], bracket[0][3]]
    let final = [bracket[1][0], bracket[1][1]]
    return [semiFinalLeft, final, semiFinalRight]
  }

  getRegionBracket(region_name: string): (Team | null)[][] {
    return this.regions[region_name]!.bracket
  }

  get leftRegions(): string[] {
    const year = this.year
    return [regionOrder[year][0], regionOrder[year][3]]
  }

  get rightRegions(): string[] {
    const year = this.year
    return [regionOrder[year][1], regionOrder[year][2]]
  }
}
