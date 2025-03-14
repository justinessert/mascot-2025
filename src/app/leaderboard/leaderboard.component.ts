import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BracketService } from '../services/bracket.service';

interface PublishedBracket {
  bracketId: string;
  bracketName: string;
  userName: string;
  userId: string;
  score: number | null;
  year: number;
  rank: number | null;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  publishedBrackets$: Observable<PublishedBracket[]> | null = null;
  userBracket: PublishedBracket | null = null;
  userRank: number | null = null;

  constructor(private firestore: Firestore, private bracketService: BracketService) {}

  ngOnInit() {
    const leaderboardRef = collection(this.firestore, `leaderboard/${this.bracketService.getYear()}/data`);

    this.publishedBrackets$ = collectionData(leaderboardRef, { idField: 'id' }).pipe(
      map((brackets: any[]) => {
        // Convert Firestore DocumentData into PublishedBracket type
        const typedBrackets: PublishedBracket[] = brackets.map((bracket) => ({
          bracketId: bracket.bracketId || bracket.id,
          bracketName: bracket.bracketName || 'Unnamed Bracket',
          userName: bracket.userName || 'Anonymous',
          userId: bracket.userId,
          score: bracket.score ?? null,
          year: bracket.year || new Date().getFullYear(),
          rank: null,
        }));

        // Sort by score (highest first)
        const sortedBrackets = typedBrackets.sort((a, b) => (b.score || 0) - (a.score || 0));

        // Assign ranks dynamically
        sortedBrackets.forEach((bracket, index) => {
          bracket.rank = index + 1;
        });

        // Find the logged-in user's published bracket
        if (this.bracketService.user) {
          const userBracket = sortedBrackets.find(
            (bracket) => bracket.bracketId === this.bracketService.user?.uid
          );
          this.userBracket = userBracket || null;
          this.userRank = userBracket ? userBracket.rank : null;
        }

        return sortedBrackets;
      })
    );
  }
}
