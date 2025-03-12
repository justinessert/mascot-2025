import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BracketSegmentComponent } from '../bracket-segment/bracket-segment.component';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';

@Component({
  selector: 'app-full-bracket',
  standalone: true,
  imports: [CommonModule, BracketSegmentComponent, ReplaceUnderscorePipe],
  templateUrl: './full-bracket.component.html',
  styleUrls: ['./full-bracket.component.css']
})
export class FullBracketComponent {
  leftRegions = ['east', 'west']; // Normal order
  rightRegions = ['midwest', 'south']; // Reverse order
}
