import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormattedSession,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SessionsService } from '../../../core';
import { AlertErrorComponent } from '../../../shared';
import { SessionsComponent } from './sessions.component';

describe('SessionsComponent', () => {
  let component: SessionsComponent;
  let fixture: ComponentFixture<SessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsComponent, AlertErrorComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        HttpClientModule,
        ClarityModule,
        UiModule,
      ],
      providers: [SessionsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a error status for the first session', () => {
    const sessions: Pagination<FormattedSession> = {
      data: [
        {
          _id: '1',
          status: 1,
          countTasksError: 1,
          countTasksCompleted: 1,
          countTasksPending: 1,
          countTasksProcessing: 1,
          cancelledAt: '',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        perPage: 10,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        firstPage: 1,
        lastPage: 1,
      },
    };

    component.sessions = sessions;
    fixture.detectChanges();

    // select the first row of the datagrid and class must be text-danger
    const row = fixture.nativeElement.querySelector('.text-danger');
    expect(row).toBeTruthy();
  });

  it('should have a pending status for the first session', () => {
    const sessions: Pagination<FormattedSession> = {
      data: [
        {
          _id: '1',
          status: 1,
          countTasksError: 0,
          countTasksCompleted: 0,
          countTasksPending: 1,
          countTasksProcessing: 0,
          cancelledAt: '',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        perPage: 10,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        firstPage: 1,
        lastPage: 1,
      },
    };

    component.sessions = sessions;
    fixture.detectChanges();

    // select the first row of the datagrid and class must be text-danger
    const row = fixture.nativeElement.querySelector('.text-pending');
    expect(row).toBeTruthy();
  });

  it('should have a processing status for the first session', () => {
    const sessions: Pagination<FormattedSession> = {
      data: [
        {
          _id: '1',
          status: 1,
          countTasksError: 0,
          countTasksCompleted: 0,
          countTasksPending: 0,
          countTasksProcessing: 1,
          cancelledAt: '',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        perPage: 10,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        firstPage: 1,
        lastPage: 1,
      },
    };

    component.sessions = sessions;
    fixture.detectChanges();

    // select the first row of the datagrid and class must be text-danger
    const row = fixture.nativeElement.querySelector('.text-warn');
    expect(row).toBeTruthy();
  });

  it('should have a completed status for the first session', () => {
    const sessions: Pagination<FormattedSession> = {
      data: [
        {
          _id: '1',
          status: 1,
          countTasksError: 0,
          countTasksCompleted: 1,
          countTasksPending: 0,
          countTasksProcessing: 0,
          cancelledAt: '',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        perPage: 10,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        firstPage: 1,
        lastPage: 1,
      },
    };

    component.sessions = sessions;
    fixture.detectChanges();

    // select the first row of the datagrid and class must be text-danger
    const row = fixture.nativeElement.querySelector('.text-success');
    expect(row).toBeTruthy();
  });
});
