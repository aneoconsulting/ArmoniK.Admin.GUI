import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TasksComponent } from './tasks.component';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksComponent],
      imports: [
        CommonModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
        HttpClientModule,
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
