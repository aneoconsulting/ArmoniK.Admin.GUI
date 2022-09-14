import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormattedSession,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import {
  BrowserTitleService,
  LanguageService,
  PagerService,
  Session,
  SessionsService,
} from '../../../core';
import {
  AlertErrorComponent,
  AutoRefreshService,
  SinceDateFilterComponent,
  StatesService,
} from '../../../shared';
import { SessionsComponent } from './sessions.component';

@Component({
  selector: 'app-timer-interval-selector',
  template: `<button class="timer-change" (click)="timerChange.emit(10)">
    timer change
  </button>`,
})
class MockTimerIntervalSelectorComponent {
  @Input() timer = 0;
  @Output() timerChange = new EventEmitter<number>();
}

@Component({
  selector: 'app-auto-refresh-activator',
  template: `<button
    class="auto-refresh-change"
    (click)="autoRefreshChange.emit()"
  >
    auto refresh change
  </button>`,
})
class MockAutoRefreshActivatorComponent {
  @Input() isEnabled = false;
  @Output() autoRefreshChange = new EventEmitter();
}

describe('SessionsComponent', () => {
  const sessionsPaginated = {
    data: [
      {
        _id: '1',
      },
    ],
    meta: {
      total: 1,
      perPage: 1,
    },
  } as unknown as Pagination<FormattedSession>;
  let http: jasmine.SpyObj<SessionsService>;
  let component: SessionsComponent;
  let fixture: ComponentFixture<SessionsComponent>;

  beforeEach(async () => {
    http = jasmine.createSpyObj('SessionsService', [
      'getAllPaginated',
      'cancel',
    ]);

    http.getAllPaginated.and.returnValue(of(sessionsPaginated));
    http.cancel.and.returnValue(of({} as Session));

    await TestBed.configureTestingModule({
      declarations: [
        SessionsComponent,
        AlertErrorComponent,
        SinceDateFilterComponent,
        MockTimerIntervalSelectorComponent,
        MockAutoRefreshActivatorComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        HttpClientModule,
        ClarityModule,
        UiModule,
      ],
      providers: [
        { provide: SessionsService, useValue: http },
        PagerService,
        BrowserTitleService,
        LanguageService,
        AutoRefreshService,
        StatesService,
      ],
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

  describe('ngOnInit', () => {
    it('should set refresh with correct fn', () => {
      const spy = spyOn(component.autoRefreshService, 'setFn');

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();

      const fn = spy.calls.mostRecent().args[0];
      fn();

      expect(http.getAllPaginated).toHaveBeenCalled();
    });

    it('should set the browser title', () => {
      const browserTitleService = TestBed.inject(BrowserTitleService);
      const spy = spyOn(browserTitleService, 'setTitle');
      component.ngOnInit();

      expect(browserTitleService.setTitle).toHaveBeenCalled();
      spy.calls.reset();
    });
  });

  describe('refresh', () => {
    it('should call refresh', () => {
      component.refresh();

      expect(http.getAllPaginated).toHaveBeenCalled();
    });
  });

  describe('timer', () => {
    it('should set timer', () => {
      const spy = spyOn(
        component.autoRefreshService,
        'setTimer'
      ).and.callThrough();

      component.onTimerChange(10);

      expect(spy).toHaveBeenCalledWith(10);

      spy.calls.reset();
    });

    it('should trigger timer change', () => {
      const child = fixture.debugElement.query(
        By.directive(MockTimerIntervalSelectorComponent)
      );

      const spy = spyOn(component, 'onTimerChange');

      const button = child.query(By.css('.timer-change'));
      button.triggerEventHandler('click', null);

      expect(component.onTimerChange).toHaveBeenCalledWith(10);

      spy.calls.reset();
    });
  });

  describe('onRefreshSessions', () => {
    it('should call getAllPaginated', () => {
      component.onRefreshSessions({});

      expect(http.getAllPaginated).toHaveBeenCalled();
    });

    it('should handle error', () => {
      http.getAllPaginated.and.returnValue(throwError(() => 'error'));

      component.onRefreshSessions({});

      expect(component.errors.length).toBe(1);
    });

    it('should trigger auto refresh change', () => {
      const child = fixture.debugElement.query(
        By.directive(MockAutoRefreshActivatorComponent)
      );

      const spy = spyOn(component.autoRefreshService, 'toggle');

      const button = child.query(By.css('.auto-refresh-change'));
      button.triggerEventHandler('click', null);

      expect(component.autoRefreshService.toggle).toHaveBeenCalled();

      spy.calls.reset();
    });
  });

  describe('cancelSession', () => {
    it('should confirm before to cancel session', () => {
      component.sessions = sessionsPaginated;
      fixture.detectChanges();

      const spy = spyOn(component, 'confirmCancelSession');

      const button = fixture.nativeElement.querySelector('.btn-cancel');
      button.click();

      expect(spy).toHaveBeenCalled();
      spy.calls.reset();
    });

    it('should open confirm modal', () => {
      component.sessions = sessionsPaginated;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.btn-cancel');
      button.click();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('clr-modal');
      expect(modal).toBeTruthy();
    });

    it('should cancel session', () => {
      const session = {
        _id: 'session-id',
      } as unknown as FormattedSession;

      component.cancelSession(session._id);

      expect(http.cancel).toHaveBeenCalledWith(session._id);
    });

    it('should handle error', () => {
      const session = {
        _id: 'session-id',
      } as unknown as FormattedSession;

      http.cancel.and.returnValue(throwError(() => 'error'));

      component.cancelSession(session._id);

      expect(component.errors.length).toBe(1);
    });

    describe('trackSessions', () => {
      it('should return the id of the session', () => {
        const session: FormattedSession = {
          _id: 'session-id',
        } as unknown as FormattedSession;

        expect(component.trackSessions(1, session)).toBe(session._id);
      });
    });
  });

  describe('ui', () => {
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
});
