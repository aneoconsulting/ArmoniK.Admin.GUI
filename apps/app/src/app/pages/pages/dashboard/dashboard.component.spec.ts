import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule, ClrDatagridStateInterface } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import {
  ApplicationsService,
  BrowserTitleService,
  LanguageService,
  PagerService,
  SettingsService,
} from '../../../core';
import {
  AlertErrorComponent,
  SinceDateFilterComponent,
  StatesService,
} from '../../../shared';
import { DashboardComponent } from './dashboard.component';

@Component({
  selector: 'app-pages-dashboard-application-card',
  template: `<button
    class="application-change"
    (click)="applicationChange.emit({})"
  >
    application change
  </button> `,
})
class MockApplicationCardComponent {
  @Output() applicationChange = new EventEmitter<Application>();
}

@Component({
  selector: 'app-pages-dashboard-applications-errors-list',
  template: `<button class="seq-link" (click)="clickSeqLink.emit('mock')">
      seq link
    </button>
    <button class="refresh" (click)="refresh.emit({})">seq link</button>`,
})
class MockApplicationsErrorsListComponent {
  @Output() clickSeqLink = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<ClrDatagridStateInterface>();
}

describe('DashboardComponent', () => {
  const applications: Application[] = [
    {
      _id: {
        applicationName: 'applicationName',
        applicationVersion: 'applicationVersion',
      },
      countTasksPending: 1,
      countTasksError: 2,
      countTasksCompleted: 3,
      countTasksProcessing: 4,
      sessions: [],
    },
  ];
  const applicationsErrorsPaginated = {
    data: [
      {
        taskId: '1',
        applicationName: 'app1',
        applicationVersion: '1.0.0',
        sessionId: '1',
        errorAt: '2020-01-01T00:00:00.000Z',
        error: {
          type: 'error',
          message: 'error message',
        },
      },
    ],
    meta: {
      total: 1,
      perPage: 1,
    },
  } as Pagination<ApplicationError>;
  let http: jasmine.SpyObj<ApplicationsService>;
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    http = jasmine.createSpyObj('applicationsService', [
      'getAllWithErrorsPaginated',
    ]);
    http.getAllWithErrorsPaginated.and.returnValue(
      of(applicationsErrorsPaginated)
    );

    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockApplicationCardComponent,
        MockApplicationsErrorsListComponent,
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
      providers: [
        {
          provide: ApplicationsService,
          useValue: http,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: new Observable<{ applications: Application[] }>(
              (observer) => {
                observer.next({ applications });
              }
            ),
          },
        },
        PagerService,
        StatesService,
        SettingsService,
        BrowserTitleService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the browser title', () => {
      const browserTitleService = TestBed.inject(BrowserTitleService);
      const languageService = TestBed.inject(LanguageService);

      const title = languageService.instant('pages.dashboard.title');

      spyOn(browserTitleService, 'setTitle');
      component.ngOnInit();

      expect(browserTitleService.setTitle).toHaveBeenCalledWith(title);
    });

    it('should get applications', () => {
      component.ngOnInit();
      expect(component.applications).toEqual(applications);
    });

    it('should return an empty array if no applications', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.data = new Observable<{ applications: Application[] }>(
        (observer) => {
          observer.next({ applications: [] });
        }
      );
      component.ngOnInit();
      expect(component.applications).toEqual([]);
    });
  });

  describe('onRefreshApplicationsErrors', () => {
    it('should get all applications with errors', () => {
      component.onRefreshApplicationsErrors({});

      expect(component.applicationsErrors).toEqual(applicationsErrorsPaginated);
    });

    it('should have an error when getting applications with errors failed', () => {
      const error = { status: 404, operation: 'getAllWithErrorsPaginated' };

      http.getAllWithErrorsPaginated.and.returnValue(
        throwError(() => {
          return error;
        })
      );

      component.onRefreshApplicationsErrors({});

      expect(component.errors[0]).toEqual(error);
    });

    it('should trigger a refresh', () => {
      const child = fixture.debugElement.query(
        By.directive(MockApplicationsErrorsListComponent)
      );

      spyOn(component, 'onRefreshApplicationsErrors');

      // Select '.seq-link' button and click
      const button = child.query(By.css('.refresh'));
      button.triggerEventHandler('click', null);

      expect(component.onRefreshApplicationsErrors).toHaveBeenCalledWith({});
    });
  });

  describe('onApplicationClick', () => {
    it('should add to currentApplication and navigate', () => {
      const application = applications[0];

      const settingsService = TestBed.inject(SettingsService);
      const router = TestBed.inject(Router);

      const spySettings = spyOn(
        settingsService,
        'addCurrentApplication'
      ).and.returnValues();
      const spyRouter = spyOn(router, 'navigate').and.returnValues(
        new Promise((resolve) => resolve(true))
      );

      component.onApplicationClick(application);

      expect(spySettings).toHaveBeenCalledWith(application);
      expect(spyRouter).toHaveBeenCalledWith([
        '/',
        'applications',
        application._id.applicationName,
        application._id.applicationVersion,
        'sessions',
      ]);
    });

    it('should be triggered', () => {
      // Create an application
      const application = applications[0];
      // Add application to dashboard
      component.applications = [application];
      fixture.detectChanges();

      const child = fixture.debugElement.query(
        By.directive(MockApplicationCardComponent)
      );

      spyOn(component, 'onApplicationClick');

      // Select '.application-change' button and click
      const button = child.query(By.css('.application-change'));
      button.triggerEventHandler('click', null);

      expect(component.onApplicationClick).toHaveBeenCalledWith(
        {} as Application
      );
    });
  });

  describe('redirectToSeq', () => {
    it('should open a _blank tab with seq url', () => {
      const taskId = '1';
      const url = 'test-url';
      const spy = spyOn(window, 'open');
      const settingsService = TestBed.inject(SettingsService);
      spyOn(settingsService, 'generateSeqUrlForTaskError').and.returnValue(url);

      component.redirectToSeq(taskId);

      expect(spy).toHaveBeenCalledWith(url, '_blank');
    });

    it('should redirect to seq on click', () => {
      const child = fixture.debugElement.query(
        By.directive(MockApplicationsErrorsListComponent)
      );

      spyOn(component, 'redirectToSeq');

      // Select '.seq-link' button and click
      const button = child.query(By.css('.seq-link'));
      button.triggerEventHandler('click', null);

      expect(component.redirectToSeq).toHaveBeenCalledWith('mock');
    });
  });
});
