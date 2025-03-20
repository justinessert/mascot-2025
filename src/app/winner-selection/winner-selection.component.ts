import { Component, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';
import { BracketService } from '../services/bracket.service';
import { Router } from '@angular/router';
import { cutOffTimes } from '../constants';

@Component({
  selector: 'app-winner-selection',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe, FormsModule],
  templateUrl: './winner-selection.component.html',
  styleUrls: ['./winner-selection.component.css']
})
export class WinnerSelectionComponent implements AfterViewInit, OnDestroy {
  currentMatchup!: any[];
  champion: any = null;
  regionOrder!: string[];
  bracketName: string | null = null;
  showPublishBanner: boolean = false;

  private touchListener: any;

  constructor(private renderer: Renderer2, private router: Router, public bracketService: BracketService) {
    // Wait for the bracket to be fully loaded before initializing
    this.bracketService.bracketLoaded$.subscribe(loaded => {
      if (loaded) {
        this.initialize();
      }
    });
  }

  get disablePublish(): boolean {
    const nowUTC = new Date();
    return nowUTC > cutOffTimes[this.bracketService.getYear()]
  }

  initialize() {
    this.currentMatchup = this.bracketService.getCurrentMatchup() || [];
    this.regionOrder = this.bracketService.getRegionOrder();
    if (!this.regionOrder.includes("final_four")) {
      this.regionOrder.push("final_four");
    }

    if (this.bracketService.isComplete) {
      this.champion = this.bracketService.getRegionChampion("final_four");
    }
  }

  updateMatchup() {
    let champion = this.bracketService.getRegionChampion();
    if (champion) {
      for (let region of this.regionOrder) {
        if (!this.bracketService.getRegionChampion(region)) {
          this.bracketService.selectRegion(region);
          this.currentMatchup = this.bracketService.getCurrentMatchup() || [];
          return;
        }
      }
      this.champion = this.bracketService.getRegionChampion("final_four");
    } else {
      this.currentMatchup = this.bracketService.getCurrentMatchup() || [];
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

  viewBracket() {
    this.router.navigate(['/bracket/view/final_four']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  closePublishBanner() {
    this.showPublishBanner = false;
  }

  async saveBracket() {
    if (this.bracketService.name.trim() === '') {
      alert('Please enter a bracket name before saving.');
      return;
    }
  
    await this.bracketService.saveBracket();
  }

  async publishBracket() {
    if (this.disablePublish) {
      alert("Brackets are no longer able to be published since the games have began.")
      return
    }

    if (!this.bracketService.saved) {
      await this.saveBracket();
    }
  
    if (this.bracketService.published) {
      alert('This bracket is already published.');
      return;
    }
  
    try {
      await this.bracketService.publishBracket();
    } catch (error) {
      console.error('Error publishing bracket:', error);
      alert('Failed to publish bracket. Please try again.');
    }
  }
}
