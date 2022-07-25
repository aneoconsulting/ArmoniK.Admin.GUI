import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  BrowserTitleService,
  LanguageService,
} from '../../../../../../../core';
import { Observable } from 'rxjs';

import { TaskDetailComponent } from './task-detail.component';
import { RawTask } from '@armonik.admin.gui/armonik-typing';

describe('TaskDetailComponent', () => {
  const applicationName = 'test-application';
  const applicationVersion = '1.0.0';
  const sessionId = 'test-session-id';
  const taskId = 'test-task-id';
  const rawTask = {
    _id: taskId,
  } as RawTask;
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      providers: [
        BrowserTitleService,
        LanguageService,
        {
          provide: ActivatedRoute,
          useValue: {
            data: new Observable<{ task: RawTask }>((observer) => {
              observer.next({ task: rawTask });
            }),
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  switch (key) {
                    case 'applicationName':
                      return applicationName;
                    case 'applicationVersion':
                      return applicationVersion;
                    case 'session':
                      return sessionId;
                    case 'task':
                      return taskId;
                    default:
                      return '';
                  }
                },
              },
            },
          },
        },
      ],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the browser title', () => {
      const browserTitleService = TestBed.inject(BrowserTitleService);
      const languageService = TestBed.inject(LanguageService);

      const title = languageService.instant(
        'pages.sessions.session-detail.task-detail.title'
      );

      spyOn(browserTitleService, 'setTitle');
      component.ngOnInit();

      expect(browserTitleService.setTitle).toHaveBeenCalledWith(title);
    });

    it('should get task data from the router', () => {
      component.ngOnInit();
      expect(component.task).toEqual(rawTask);
    });
  });

  describe('getter', () => {
    it('should return task id from the route', () => {
      expect(component.taskId).toEqual(taskId);
    });

    it('should return an empty string if task id is not set', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = () => null;

      expect(component.taskId).toEqual('');
    });

    it('should return session id from the route', () => {
      expect(component.sessionId).toEqual(sessionId);
    });

    it('should return an empty string if session id is not set', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = () => null;

      expect(component.sessionId).toEqual('');
    });

    it('should return application name from the route', () => {
      expect(component.applicationName).toEqual(applicationName);
    });

    it('should return an empty string if application name is not set', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = () => null;

      expect(component.applicationName).toEqual('');
    });

    it('should return application version from the route', () => {
      expect(component.applicationVersion).toEqual(applicationVersion);
    });

    it('should return an empty string if application version is not set', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = () => null;

      expect(component.applicationVersion).toEqual('');
    });
  });
});
