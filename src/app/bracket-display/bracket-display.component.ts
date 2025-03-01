import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';

@Component({
  selector: 'app-bracket-display',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe],
  templateUrl: './bracket-display.component.html',
  styleUrls: ['./bracket-display.component.css']
})
export class BracketDisplayComponent {
  @Input() bracket: any[][] = [];
  @Input() champion: any | null = null;
  @Input() selectedRegion: string | null = null;

  getMatchupPairs(round: any[]): any[][] {
    const pairs: any[][] = [];
    for (let i = 0; i < round.length; i += 2) {
      pairs.push([round[i], round[i + 1]]);
    }
    return pairs;
  }
}

