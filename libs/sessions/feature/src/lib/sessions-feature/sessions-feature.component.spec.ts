import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsFeatureComponent } from './sessions-feature.component';

describe('SessionsFeatureComponent', () => {
  let component: SessionsFeatureComponent;
  let fixture: ComponentFixture<SessionsFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
