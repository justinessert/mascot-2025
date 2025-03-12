import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketSegmentComponent } from './bracket-segment.component';

describe('BracketSegmentComponent', () => {
  let component: BracketSegmentComponent;
  let fixture: ComponentFixture<BracketSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BracketSegmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BracketSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
