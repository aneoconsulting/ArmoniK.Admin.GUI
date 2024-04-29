import { GetResultResponse } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ShowComponent } from './show.component';
import { ResultRaw } from './types';

describe('ShowComponent', () => {
  let component: ShowComponent;

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockShareUrlService = {
    generateSharableURL: jest.fn(),
  };

  const paramId = 'paramId-12345';
  const mockActivatedRoute = {
    params: new BehaviorSubject({
      id: paramId,
    }),
  };

  const returnedResult = {
    id: 'resultId-12345',
    options: {
      partitionId: 'partitionId'
    }
  } as unknown as ResultRaw;
  const mockResultsGrpcService = {
    get$: jest.fn((): Observable<unknown> => of({result: returnedResult} as GetResultResponse)),
  };

  const mockResultsStatusesService = {
    statuses: []
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        { provide: ResultsStatusesService, useValue: mockResultsStatusesService},
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService }
      ]
    }).inject(ShowComponent);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialisation', () => {
    it('should set id', () => {
      expect(component.id).toEqual(paramId);
    });

    it('should set sharableURL', () => {
      expect(mockShareUrlService.generateSharableURL).toHaveBeenCalled();
    });
  });

  it('should get page icon', () => {
    expect(component.getPageIcon('results')).toEqual('workspace_premium');
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should refresh', () => {
    const spy = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(spy).toHaveBeenCalled();
  });

  it('should set link for action', () => {
    component.setLink('session', 'sessions', 'sessionId-12345');
    expect(component.actionButtons[0].link).toEqual('/sessions/sessionId-12345');
  });

  describe('Getting data', () => {
    it('should fetch data on refresh', () => {
      component.refresh.next();
      expect(mockResultsGrpcService.get$).toHaveBeenCalledWith(paramId);
    });

    it('should update data on success', () => {
      const spy = jest.spyOn(component.data$, 'next');
      component.refresh.next();
      expect(component.data).toEqual(returnedResult);
      expect(spy).toHaveBeenCalledWith(returnedResult);
    });

    it(('should set link if sessionId is not the same as ownerTaskId'), () => {
      const spy = jest.spyOn(component, 'setLink');
      mockResultsGrpcService.get$.mockImplementationOnce(() => of({result: {...returnedResult, sessionId: 'sessionId', ownerTaskId: 'ownerTaskId'}}));
      component.refresh.next();
      expect(spy).toHaveBeenCalledWith('task', 'tasks', 'ownerTaskId');
    });

    it('should remove an action if sessionId is the same as ownerTaskId', () => {
      mockResultsGrpcService.get$.mockImplementationOnce(() => of({result: {...returnedResult, sessionId: 'sessionId', ownerTaskId: 'sessionId'}}));
      component.refresh.next();
      expect(component.actionButtons.find(action => action.id === 'task')).toBeUndefined();
    });

    it('should not update data if there is none', () => {
      mockResultsGrpcService.get$.mockImplementationOnce(() => of({}));
      const spy = jest.spyOn(component.data$, 'next');
      component.refresh.next();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockResultsGrpcService.get$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Handle errors', () => {
    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.handleError(new Error());
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should notify the error', () => {
      component.handleError(new Error());
      expect(mockNotificationService.error).toHaveBeenCalledWith('Could not retrieve data.');
    });
  });

  describe('notifications', () => {
    it('should notify on success', () => {
      const notification = 'message';
      component.success(notification);
      expect(mockNotificationService.success).toHaveBeenCalledWith(notification);
    });

    it('should notify on error', () => {
      const error = 'error message';
      component.error(error);
      expect(mockNotificationService.error).toHaveBeenCalledWith(error);
    });
  });

  it('should get statuses', () => {
    expect(component.statuses).toEqual(mockResultsStatusesService.statuses);
  });
});