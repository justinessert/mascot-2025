import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { loadRegions, Region, Team } from '../services/bracket.service';
import { FullBracketComponent } from '../full-bracket/full-bracket.component';

@Component({
  selector: 'app-bracket-view',
  standalone: true,
  imports: [CommonModule, FullBracketComponent],
  templateUrl: './bracket-view.component.html',
  styleUrls: ['./bracket-view.component.css']
})
export class BracketViewComponent implements OnInit {
  year!: number;
  bracketId!: string;
  bracketName: string | null = null;
  regions: Record<string, Region | null> = {};

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      this.bracketId = params['uuid'];
      this.year = Number(params['year']);
      await this.loadBracket();
    });
  }

  get champion(): Team | null {
    return this.regions["final_four"]?.champion ?? null;
  }
  

  async loadBracket() {
    const bracketRef = doc(this.firestore, `brackets/${this.year}/${this.bracketId}/data`);
    const snapshot = await getDoc(bracketRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      this.regions = loadRegions(data['bracket'], this.year);
      this.bracketName = data['name']
    } else {
      console.error("❌ Bracket not found");
    }
  }
}
