import { Component } from '@angular/core';
import { FullBracketComponent } from '../full-bracket/full-bracket.component';
import { BracketService } from '../services/bracket.service';

@Component({
  selector: 'app-full-bracket-wrapper',
  imports: [FullBracketComponent],
  templateUrl: './full-bracket-wrapper.component.html',
  styleUrl: './full-bracket-wrapper.component.css'
})
export class FullBracketWrapperComponent {
  constructor(public bracketService: BracketService) {}
}
