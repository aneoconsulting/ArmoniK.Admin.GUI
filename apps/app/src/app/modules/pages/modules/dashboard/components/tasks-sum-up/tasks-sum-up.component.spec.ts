import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSumUpComponent } from './tasks-sum-up.component';

describe('TasksSumUpComponent', () => {
  let component: TasksSumUpComponent;
  let fixture: ComponentFixture<TasksSumUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksSumUpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSumUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
