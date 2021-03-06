import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertErrorComponent,
  TaskStatusFilterComponent,
} from '../../../../../shared';
import { PagerService, TasksService } from '../../../../../core';
import { TasksListComponent } from './components';
import { SessionDetailComponent } from './session-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SessionDetailComponent', () => {
  let component: SessionDetailComponent;
  let fixture: ComponentFixture<SessionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SessionDetailComponent,
        TasksListComponent,
        AlertErrorComponent,
        TaskStatusFilterComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [TasksService, PagerService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
