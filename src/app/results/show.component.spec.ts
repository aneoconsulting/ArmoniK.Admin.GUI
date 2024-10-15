import { GetResultResponse, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsInspectionService } from './services/results-inspection.service';
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
    },
    status: ResultStatus.RESULT_STATUS_CREATED
  } as unknown as ResultRaw;
  const mockResultsGrpcService = {
    get$: jest.fn((): Observable<unknown> => of({result: returnedResult} as GetResultResponse)),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        ResultsStatusesService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        ResultsInspectionService,
      ]
    }).inject(ShowComponent);
    component.ngOnInit();
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

    it('should set fields', () => {
      expect(component.fields).toEqual((new ResultsInspectionService).fields);
    });
  });

  describe('get status', () => {
    it('should return the status label if there is data', () => {
      component.refresh.next();
      expect(component.status).toEqual('Created');
    });

    it('should return undefined if there is no data', () => {
      mockResultsGrpcService.get$.mockReturnValueOnce(of(null));
      component.refresh.next();
      expect(component.status).toEqual(undefined);
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should refresh', () => {
    const spy = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(spy).toHaveBeenCalled();
  });

  describe('Getting data', () => {
    it('should fetch data on refresh', () => {
      component.refresh.next();
      expect(mockResultsGrpcService.get$).toHaveBeenCalledWith(paramId);
    });

    it('should update data on success', () => {
      component.refresh.next();
      expect(component.data()).toEqual(returnedResult);
    });

    it('should not update data if there is none', () => {
      mockResultsGrpcService.get$.mockImplementationOnce(() => of({}));
      component.refresh.next();
      expect(component.data()).toEqual(null);
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
      const errorMessage = 'ErrorMessage';
      component.handleError({statusMessage: errorMessage} as GrpcStatusEvent);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should notify the error', () => {
      const errorMessage = 'ErrorMessage';
      component.handleError({statusMessage: errorMessage} as GrpcStatusEvent);
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
    expect(component.statuses).toEqual((new ResultsStatusesService).statuses);
  });
});