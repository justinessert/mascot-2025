import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';
import { Team } from '../services/bracket.service';

@Component({
  selector: 'app-matchup',
  imports: [CommonModule, ReplaceUnderscorePipe],
  templateUrl: './matchup.component.html',
  styleUrl: './matchup.component.css'
})
export class MatchupComponent {
  @Input() topTeam: Team | null = null;
  @Input() bottomTeam: Team | null = null;

}
