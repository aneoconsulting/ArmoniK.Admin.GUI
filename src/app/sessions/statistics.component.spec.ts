import { ResultsClient, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HistogramField, ResultDateProperty, TaskDateProperty, TaskDurationProperty } from '@app/types/statistics';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { of } from 'rxjs';
import { SessionsStatisticsService } from './services/sessions-statistics.service';
import { SessionStatisticsComponent } from './statistics.component';

describe('SessionStatisticsComponent', () => {
  let component: SessionStatisticsComponent;

  const mockStatisticsService = {
    taskDateFields: [],
    taskDurationFields: [],
    resultDateFields: [],
    taskDateHistogram$: jest.fn(),
    taskDurationHistogram$: jest.fn(),
    resultDateHistogram$: jest.fn(),
    resultSizeHistogram$: jest.fn(),
  };

  const mockClipboard = { copy: jest.fn() };
  const mockNotificationService = { success: jest.fn() };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionStatisticsComponent,
        IconsService,
        { provide: SessionsStatisticsService, useValue: mockStatisticsService },
        { provide: ActivatedRoute, useValue: { params: of({ id: 'sessionId' }) } },
        { provide: Clipboard, useValue: mockClipboard },
        { provide: NotificationService, useValue: mockNotificationService },
      ]
    }).inject(SessionStatisticsComponent);

    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the session id from the route', () => {
    expect(component.id).toEqual('sessionId');
  });

  it('should load the tasks over time histogram', () => {
    const field = { label: 'Ended at', field: 5, property: 'endedAt' } as HistogramField<TaskDateProperty>;
    component.tasksOverTime(field, 20);
    expect(mockStatisticsService.taskDateHistogram$).toHaveBeenCalledWith('sessionId', field, 20);
  });

  it('should load the tasks by duration histogram', () => {
    const field = { label: 'Creation to end', field: 6, property: 'creationToEndDuration' } as HistogramField<TaskDurationProperty>;
    component.tasksByDuration(field, 10);
    expect(mockStatisticsService.taskDurationHistogram$).toHaveBeenCalledWith('sessionId', field, 10);
  });

  it('should load the results over time histogram', () => {
    const field = { label: 'Completed at', field: 6, property: 'completedAt' } as HistogramField<ResultDateProperty>;
    component.resultsOverTime(field, 50);
    expect(mockStatisticsService.resultDateHistogram$).toHaveBeenCalledWith('sessionId', field, 50);
  });

  it('should load the results by size histogram without any field', () => {
    component.resultsBySize(null, 20);
    expect(mockStatisticsService.resultSizeHistogram$).toHaveBeenCalledWith('sessionId', 20);
  });

  it('should copy the session id', () => {
    component.copySessionId();
    expect(mockClipboard.copy).toHaveBeenCalledWith('sessionId');
    expect(mockNotificationService.success).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    expect(component).toBeTruthy();
  });
});

describe('SessionStatisticsComponent dependencies', () => {
  /**
   * Built through its own providers, unlike the tests above: this is what catches a dependency the
   * component injects without declaring, such as NotificationService which is not provided in root.
   */
  it('should declare every dependency it injects', async () => {
    await TestBed.configureTestingModule({
      imports: [SessionStatisticsComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        IconsService,
        { provide: ActivatedRoute, useValue: { params: of({ id: 'sessionId' }) } },
      ]
    })
      // The gRPC clients are provided in 'any', so they have to be overridden on the component
      // itself rather than on the testing module.
      .overrideComponent(SessionStatisticsComponent, {
        add: {
          providers: [
            { provide: TasksClient, useValue: { listTasks: jest.fn() } },
            { provide: ResultsClient, useValue: { listResults: jest.fn() } },
          ]
        }
      })
      .compileComponents();

    const fixture = TestBed.createComponent(SessionStatisticsComponent);
    await fixture.whenStable();

    expect(fixture.componentInstance.id).toEqual('sessionId');

    fixture.destroy();
  });
});
