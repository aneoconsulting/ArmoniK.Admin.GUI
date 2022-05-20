import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TasksSumUpComponent } from './tasks-sum-up.component';

describe('TasksSumUpComponent', () => {
  let component: TasksSumUpComponent;
  let fixture: ComponentFixture<TasksSumUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksSumUpComponent],
      imports: [
        RouterModule,
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
      ],
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
