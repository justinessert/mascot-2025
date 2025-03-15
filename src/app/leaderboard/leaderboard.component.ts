import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BracketService } from '../services/bracket.service';

interface PublishedBracket {
  bracketId: string;
  bracketName: string;
  userName: string;
  userId: string;
  score: number | null;
  rank?: number; // Rank property
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboardBrackets$: Observable<PublishedBracket[]> | null = null;
  userBracket: PublishedBracket | null = null;
  showUserBanner: boolean = false;
  showPublishBanner: boolean = false;

  constructor(private firestore: Firestore, public bracketService: BracketService) {

    // Wait for the bracket to be fully loaded before initializing
    this.bracketService.bracketLoaded$.subscribe(loaded => {
      if (loaded) {
        this.showUserBanner = this.bracketService.user == null;
        this.showPublishBanner = !this.bracketService.published;
      }
    });
  }

  ngOnInit() {
    const leaderboardCollection = collection(this.firestore, `leaderboard/${this.bracketService.getYear()}/data`);

    this.leaderboardBrackets$ = collectionData(leaderboardCollection, { idField: 'entryId' }).pipe(
      map((brackets: DocumentData[]) => {
        // Explicitly cast Firestore data to PublishedBracket
        const typedBrackets: PublishedBracket[] = brackets.map(doc => ({
          bracketId: doc["bracketId"] ?? '',
          bracketName: doc["bracketName"] ?? 'Unknown',
          userName: doc["userName"] ?? 'Anonymous',
          userId: doc["userId"] ?? '',
          score: doc["score"] ?? null
        }));

        // Sort brackets by score (Descending)
        typedBrackets.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        // Assign ranks with correct handling of ties
        let rank = 1;
        for (let i = 0; i < typedBrackets.length; i++) {
          if (i > 0 && typedBrackets[i].score === typedBrackets[i - 1].score) {
            typedBrackets[i].rank = typedBrackets[i - 1].rank; // Same rank for tie
          } else {
            typedBrackets[i].rank = rank;
          }
          rank++; // Increment rank for next bracket
        }

        // Find the logged-in user's published bracket
        if (this.bracketService.user) {
          const userBracket = typedBrackets.find(
            (bracket) => bracket.bracketId === this.bracketService.user?.uid
          );
          this.userBracket = userBracket || null;
        }

        return typedBrackets;
      })
    );
  }

  closeUserBanner() {
    this.showUserBanner = false;
  }

  closePublishBanner() {
    this.showPublishBanner = false;
  }
}
