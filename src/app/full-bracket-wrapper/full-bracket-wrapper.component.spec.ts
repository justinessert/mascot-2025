import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullBracketWrapperComponent } from './full-bracket-wrapper.component';

describe('FullBracketWrapperComponent', () => {
  let component: FullBracketWrapperComponent;
  let fixture: ComponentFixture<FullBracketWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullBracketWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullBracketWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
