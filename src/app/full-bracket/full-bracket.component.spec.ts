import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullBracketComponent } from './full-bracket.component';

describe('FullBracketComponent', () => {
  let component: FullBracketComponent;
  let fixture: ComponentFixture<FullBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullBracketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
