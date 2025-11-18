import { GetResultResponse, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StatusService } from '@app/types/status';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { BehaviorSubject, Observable, of, throwError, Subject } from 'rxjs';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsInspectionService } from './services/results-inspection.service';
import { ShowComponent } from './show.component';
import { ResultRaw } from './types';

describe('ShowComponent', () => {
  let component: ShowComponent;

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
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
      partitionId: 'partitionId',
    },
    status: ResultStatus.RESULT_STATUS_CREATED,
  } as unknown as ResultRaw;

  const mockResultsGrpcService: Partial<ResultsGrpcService> = {
    get$: jest.fn((): Observable<GetResultResponse> =>
      of({ result: returnedResult } as GetResultResponse)
    ),
  };

  const mockStatusService = {
    statuses: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Cancelled',
        color: 'red',
      },
      [ResultStatus.RESULT_STATUS_CREATED]: {
        label: 'Created',
        color: 'green',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        { provide: StatusService, useValue: mockStatusService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        ResultsInspectionService,
      ],
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
      expect(component.fields).toEqual(new ResultsInspectionService().fields);
    });
  });
  describe('get status', () => {
    it('should return the status label if there is data', () => {
      component.refresh.next();
      expect(component.status).toEqual(
        mockStatusService.statuses[ResultStatus.RESULT_STATUS_CREATED]
      );
    });
    it('should return undefined if there is no data', () => {
      (mockResultsGrpcService.get$ as jest.Mock).mockReturnValueOnce(
        of(null as unknown as GetResultResponse)
      );
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
      (mockResultsGrpcService.get$ as jest.Mock).mockImplementationOnce(() =>
        of({} as GetResultResponse)
      );
      component.refresh.next();
      expect(component.data()).toEqual(null);
    });
    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => { });
      (mockResultsGrpcService.get$ as jest.Mock).mockReturnValueOnce(
        throwError(() => new Error())
      );
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
    });
  });
  describe('Handle errors', () => {
    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      const errorMessage = 'ErrorMessage';
      component.handleError({ statusMessage: errorMessage } as GrpcStatusEvent);
      expect(errorSpy).toHaveBeenCalled();
    });
    it('should notify the error', () => {
      const errorMessage = 'ErrorMessage';
      component.handleError({ statusMessage: errorMessage } as GrpcStatusEvent);
      expect(mockNotificationService.error).toHaveBeenCalledWith(
        'Could not retrieve data.'
      );
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
    expect(component.statuses).toEqual(mockStatusService.statuses);
  });
  describe('downloadResult', () => {
    let subject: Subject<{ _dataChunk?: Uint8Array; dataChunk?: Uint8Array; foo?: string }>;
    beforeEach(() => {
      subject = new Subject<{ _dataChunk?: Uint8Array; dataChunk?: Uint8Array; foo?: string }>();
      (mockResultsGrpcService as Partial<ResultsGrpcService>).downloadResultData$ = jest
        .fn()
        .mockReturnValue(subject.asObservable());
    });
    it('should call downloadAs with merged Uint8Array and correct filename/mime', async () => {
      const spy = jest.spyOn(component, 'downloadAs').mockImplementation(() => { });
      const resultId = 'res-123';
      const ret = await component.downloadResult(resultId);
      expect(ret).toBe(true);
      const c1 = new Uint8Array([1, 2, 3]);
      const c2 = new Uint8Array([4, 5]);
      subject.next({ _dataChunk: c1 });
      subject.next({ _dataChunk: c2 });
      subject.complete();
      expect(spy).toHaveBeenCalledTimes(1);
      const [mergedArg, filenameArg, mimeArg] = spy.mock.calls[0] as [
        Uint8Array,
        string,
        string
      ];
      expect(filenameArg).toBe('res-123.bin');
      expect(mimeArg).toBe('application/octet-stream');
      expect(mergedArg).toBeInstanceOf(Uint8Array);
      expect(Array.from(mergedArg)).toEqual([1, 2, 3, 4, 5]);
    });
    it('should return false and not call downloadAs when resultId is undefined', async () => {
      const spy = jest.spyOn(component, 'downloadAs').mockImplementation(() => { });
      const ret = await component.downloadResult(undefined);
      expect(ret).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });
    it('should not call downloadAs when stream completes with no chunks', async () => {
      const spy = jest.spyOn(component, 'downloadAs').mockImplementation(() => { });
      const ret = await component.downloadResult('id-without-chunks');
      expect(ret).toBe(true);
      subject.complete();
      expect(spy).not.toHaveBeenCalled();
    });
    it('should ignore non-Uint8Array chunks', async () => {
      const spy = jest.spyOn(component, 'downloadAs').mockImplementation(() => { });
      await component.downloadResult('weird-chunks');
      subject.next({ foo: 'bar' });
      subject.complete();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should log error and warn when stream errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      const warningSpy = mockNotificationService.warning;
      await component.downloadResult('res-error');
      subject.error(new Error('boom'));
      expect(consoleSpy).toHaveBeenCalledWith(
        '[downloadResult] download error:',
        expect.any(Error)
      );
      expect(warningSpy).toHaveBeenCalledWith('Result Not Found');
    });
  });
});