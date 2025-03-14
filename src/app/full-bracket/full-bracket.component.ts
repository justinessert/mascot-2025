import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BracketSegmentComponent } from '../bracket-segment/bracket-segment.component';
import { BracketService } from '../services/bracket.service';
import { MatchupComponent } from '../matchup/matchup.component';

@Component({
  selector: 'app-full-bracket',
  standalone: true,
  imports: [CommonModule, MatchupComponent, BracketSegmentComponent],
  templateUrl: './full-bracket.component.html',
  styleUrls: ['./full-bracket.component.css']
})
export class FullBracketComponent {
  leftRegions = ['east', 'west']; // Normal order
  rightRegions = ['midwest', 'south']; // Reverse order

  constructor(public bracketService: BracketService) {}

  getFinalFourMatchups(): any[][]{
    let bracket = this.bracketService.getRegionBracket("final_four");
    let semiFinalLeft = [bracket[0][0], bracket[0][1]]
    let semiFinalRight = [bracket[0][2], bracket[0][3]]
    let final = [bracket[1][0], bracket[1][1]]
    return [semiFinalLeft, final, semiFinalRight]
  }
}
