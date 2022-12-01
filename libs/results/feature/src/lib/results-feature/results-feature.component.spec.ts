import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsFeatureComponent } from './results-feature.component';

describe('ResultsFeatureComponent', () => {
  let component: ResultsFeatureComponent;
  let fixture: ComponentFixture<ResultsFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
