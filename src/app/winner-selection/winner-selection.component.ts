import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';

@Component({
  selector: 'app-winner-selection',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe],
  templateUrl: './winner-selection.component.html',
  styleUrls: ['./winner-selection.component.css']
})
export class WinnerSelectionComponent {
  @Input() currentMatchup: any[] = [];
  @Output() winnerSelected = new EventEmitter<any>();

  selectWinner(winner: any) {
    this.winnerSelected.emit(winner);
  }
}