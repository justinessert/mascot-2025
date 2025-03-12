import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaceUnderscorePipe } from '../replace-underscore.pipe';
import { BracketService } from '../services/bracket.service';
import { BracketSegmentComponent } from '../bracket-segment/bracket-segment.component';

@Component({
  selector: 'app-bracket-display',
  standalone: true,
  imports: [CommonModule, ReplaceUnderscorePipe, BracketSegmentComponent],
  templateUrl: './bracket-display.component.html',
  styleUrls: ['./bracket-display.component.css']
})
export class BracketDisplayComponent implements OnInit {
  currentRegion: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, public bracketService: BracketService) {}

  ngOnInit() {
    // Wait for the bracket to be fully loaded before initializing
    this.bracketService.bracketLoaded$.subscribe(loaded => {
      if (loaded) {
        this.initialize();
      }
    });
  }

  initialize() {
    this.route.paramMap.subscribe(params => {
      this.currentRegion = params.get('region');
    });
    
  }
}

