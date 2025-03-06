import { Component, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';
import { BracketService } from '../services/bracket.service';
import { regionOrder } from '../constants';

@Component({
  selector: 'app-winner-selection',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe],
  templateUrl: './winner-selection.component.html',
  styleUrls: ['./winner-selection.component.css']
})
export class WinnerSelectionComponent implements AfterViewInit, OnDestroy {
  currentMatchup: any[];
  champion: any = null;
  regionOrder: string[];

  private touchListener: any;

  constructor(private renderer: Renderer2, private bracketService: BracketService) {
    this.currentMatchup = this.bracketService.getCurrentMatchup()
    this.regionOrder = regionOrder;
    if (!this.regionOrder.includes("final_four")) {
      this.regionOrder.push("final_four");
    }
  }

  updateMatchup() {
    let champion = this.bracketService.getRegionChampion();
    if (champion) {
      for (let region of this.regionOrder) {
        if (!this.bracketService.getRegionChampion(region)) {
          this.bracketService.selectRegion(region);
          this.currentMatchup = this.bracketService.getCurrentMatchup();
          return;
        }
      }
      this.champion = this.bracketService.getRegionChampion("final_four");
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

  getRegionProgress(region_name: string) {
    let progress = this.bracketService.getRegionProgress(region_name);
    return `${progress[0]} / ${progress[1]}`;
  }
}
