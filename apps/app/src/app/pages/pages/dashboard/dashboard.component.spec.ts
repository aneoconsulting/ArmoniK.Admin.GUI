import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule, ClrDatagridStateInterface } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationsService,
  BrowserTitleService,
  LanguageService,
  PagerService,
  SettingsService,
} from '../../../core';
import {
  ApplicationCardComponent,
  ApplicationsErrorsListComponent,
} from './components';
import { AlertErrorComponent, SinceDateFilterComponent } from '../../../shared';

import { DashboardComponent } from './dashboard.component';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
        ApplicationCardComponent,
        ApplicationsErrorsListComponent,
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
        SettingsService,
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

  describe('applications', () => {
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

    it('should add clicked application to currentApplication and navigate', () => {
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
  });

  describe('Seq', () => {
    it('should open a _blank tab with seq url', () => {
      const taskId = '1';
      const url = 'test-url';
      const spy = spyOn(window, 'open');
      const settingsService = TestBed.inject(SettingsService);
      spyOn(settingsService, 'generateSeqUrlForTaskError').and.returnValue(url);

      component.redirectToSeq(taskId);

      expect(spy).toHaveBeenCalledWith(url, '_blank');
    });
  });

  describe('ui', () => {
    it('should contains a h1', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h1')).toBeTruthy();
    });
    it('should contains a section after h1', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h1 + section')).toBeTruthy();
    });
    it('should contains 2 h2', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelectorAll('h2').length).toBe(2);
    });
    it('should contains a div with class "clr-row" after the first h2', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h2 + div.clr-row')).toBeTruthy();
    });
    it('should contains "app-pages-dashboard-application-card" in a tag with class "clr-row" after first h2', () => {
      const compiled = fixture.nativeElement;
      fixture.detectChanges();

      expect(compiled.querySelector('div.clr-row').textContent).toContain(
        applications[0]._id.applicationName
      );
    });

    it('should contains a app-alert-error after the second h2', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h2 + app-alert-error')).toBeTruthy();
    });

    it('should contains a app-pages-dashboard-applications-errors-list after the app-alert-error', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(
        compiled.querySelector(
          'app-alert-error + app-pages-dashboard-applications-errors-list'
        )
      ).toBeTruthy();
    });
  });
});
