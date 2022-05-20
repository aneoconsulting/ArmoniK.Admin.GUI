import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSumUpComponent } from './app-sum-up.component';

describe('AppSumUpComponent', () => {
  let component: AppSumUpComponent;
  let fixture: ComponentFixture<AppSumUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppSumUpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSumUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
