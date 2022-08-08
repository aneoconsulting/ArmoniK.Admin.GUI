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
import { PagerService, SessionsService } from '../../../core';
import { AlertErrorComponent, SinceDateFilterComponent } from '../../../shared';
import { SessionsComponent } from './sessions.component';

describe('SessionsComponent', () => {
  let component: SessionsComponent;
  let fixture: ComponentFixture<SessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SessionsComponent,
        AlertErrorComponent,
        SinceDateFilterComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        HttpClientModule,
        ClarityModule,
        UiModule,
      ],
      providers: [SessionsService, PagerService],
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

    // select the first clr-dg-row
    const row = fixture.nativeElement.querySelector('clr-dg-row');
    // select the cell containing status
    const cell = row.querySelectorAll('clr-dg-cell')[2];
    // must only contains one child
    expect(cell.childElementCount).toBe(1);
    // child must contains the class .text-danger
    expect(cell.children[0].classList.contains('text-danger')).toBeTruthy();
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

    // select the first clr-dg-row
    const row = fixture.nativeElement.querySelector('clr-dg-row');
    // select the cell containing status
    const cell = row.querySelectorAll('clr-dg-cell')[2];
    // must only contains one child
    expect(cell.childElementCount).toBe(1);
    // child must contains the class .text-pending
    expect(cell.children[0].classList.contains('text-pending')).toBeTruthy();
  });

  it('should have a error status for the first session even with pending tasks', () => {
    const sessions: Pagination<FormattedSession> = {
      data: [
        {
          _id: '1',
          status: 1,
          countTasksError: 1,
          countTasksCompleted: 0,
          countTasksPending: 2,
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

    // select the first clr-dg-row
    const row = fixture.nativeElement.querySelector('clr-dg-row');
    // select the cell containing status
    const cell = row.querySelectorAll('clr-dg-cell')[2];
    // must only contains one child
    expect(cell.childElementCount).toBe(1);
    // child must contains the class .text-pending
    expect(cell.children[0].classList.contains('text-danger')).toBeTruthy();
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

    // select the first clr-dg-row
    const row = fixture.nativeElement.querySelector('clr-dg-row');
    // select the cell containing status
    const cell = row.querySelectorAll('clr-dg-cell')[2];
    // must only contains one child
    expect(cell.childElementCount).toBe(1);
    // child must contains the class .text-warn
    expect(cell.children[0].classList.contains('text-warn')).toBeTruthy();
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

    // select the first clr-dg-row
    const row = fixture.nativeElement.querySelector('clr-dg-row');
    // select the cell containing status
    const cell = row.querySelectorAll('clr-dg-cell')[2];
    // must only contains one child
    expect(cell.childElementCount).toBe(1);
    // child must contains the class .text-success
    expect(cell.children[0].classList.contains('text-success')).toBeTruthy();
  });

  it('should have not have any status', () => {
    const sessions: Pagination<FormattedSession> = {
      data: [
        {
          _id: '1',
          status: 1,
          countTasksError: 0,
          countTasksCompleted: 0,
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

    // select the first clr-dg-row
    const row = fixture.nativeElement.querySelector('clr-dg-row');
    // select the cell containing status
    const cell = row.querySelectorAll('clr-dg-cell')[2];
    // must only contains one child
    expect(cell.childElementCount).toBe(0);
  });
});
