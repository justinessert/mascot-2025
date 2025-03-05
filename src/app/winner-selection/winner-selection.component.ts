import { Component, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';
import { BracketService } from '../services/bracket.service';

@Component({
  selector: 'app-winner-selection',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe],
  templateUrl: './winner-selection.component.html',
  styleUrls: ['./winner-selection.component.css']
})
export class WinnerSelectionComponent implements AfterViewInit, OnDestroy {
  currentMatchup: any[];
  champion: string | null = null;

  private touchListener: any;

  constructor(private renderer: Renderer2, private bracketService: BracketService) {
    this.currentMatchup = this.bracketService.getCurrentMatchup()
  }

  updateMatchup() {
    let champion = this.bracketService.getRegionChampion();
    if (champion) {
      this.champion = champion.name;
    } else {
      this.currentMatchup = this.bracketService.getCurrentMatchup();
    }
  }

  ngAfterViewInit() {
    // ✅ Listen for first touch event to disable hover
    this.touchListener = () => this.disableHoverOnTouch();
    window.addEventListener('touchstart', this.touchListener, { passive: true });
  }

  ngOnDestroy() {
    // Remove listener when component is destroyed
    window.removeEventListener('touchstart', this.touchListener);
  }

  disableHoverOnTouch() {
    this.renderer.addClass(document.body, 'disable-hover');

    // Re-enable hover after a delay (when new images load)
    setTimeout(() => {
      this.renderer.removeClass(document.body, 'disable-hover');
    }, 500);
  }

  selectWinner(winner: any) {
    // Prevent hover effects after selection
    this.disableHoverOnTouch();
    this.bracketService.handleWinnerSelection(winner);
    this.updateMatchup();
  }
}
