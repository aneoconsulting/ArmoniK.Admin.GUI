import { GetPartitionResponse } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsInspectionService } from './services/partitions-inspection.service';
import { ShowComponent } from './show.component';
import { PartitionRaw } from './types';

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

  const returnedPartition = {
    id: 'partitionId-12345',
    options: {
      partitionId: 'partitionId'
    }
  } as unknown as PartitionRaw;

  const mockPartitionsGrpcService = {
    get$: jest.fn((): Observable<unknown> => of({partition: returnedPartition} as GetPartitionResponse)),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PartitionsGrpcService, useValue: mockPartitionsGrpcService },
        PartitionsInspectionService,
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

    it('should set sessionsKey', () => {
      expect(component.sessionsKey).toEqual('0-root-3-0');
    });

    it('should set tasksKey', () => {
      expect(component.tasksKey).toEqual('0-options-4-0');
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
      expect(mockPartitionsGrpcService.get$).toHaveBeenCalledWith(paramId);
    });

    it('should update data on success', () => {
      component.refresh.next();
      expect(component.data()).toEqual(returnedPartition);
    });

    it('should not update data if there is none', () => {
      mockPartitionsGrpcService.get$.mockImplementationOnce(() => of({}));
      component.refresh.next();
      expect(component.data()).toEqual(null);
    });

    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPartitionsGrpcService.get$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
    });

    it('should set sessionsQueryParams', () => {
      component.refresh.next();
      expect(component.sessionsQueryParams).toEqual({'0-root-3-0': returnedPartition.id});
    });

    it('should set tasksQueryParams', () => {
      component.refresh.next();
      expect(component.tasksQueryParams).toEqual({'0-options-4-0': returnedPartition.id});
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

  describe('on destroy', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should unsubscribe from subjects', () => {
      expect(component.subscriptions.closed).toBeTruthy();
    });
  });
});