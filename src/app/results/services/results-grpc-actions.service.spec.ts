import { DownloadResultDataResponse } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { GrpcAction } from '@app/types/actions.type';
import { StatusService } from '@app/types/status';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { NotificationService } from '@services/notification.service';
import { of, Subject, throwError } from 'rxjs';
import { ResultsGrpcActionsService } from './results-grpc-actions.service';
import { ResultsGrpcService } from './results-grpc.service';
import { ResultRaw } from '../types';

function getAction(actions: GrpcAction<ResultRaw>[], key: string) {
  return actions.find(action => action.key === key) as GrpcAction<ResultRaw>;
}

describe('ResultsGrpcActionsService', () => {
  let service: ResultsGrpcActionsService;

  const mockResult1 = {
    resultId: 'result-1',
  } as ResultRaw;

  const mockResult2 = {
    resultId: 'result-2',
  } as ResultRaw;

  const mockStatusService = {};

  const mockSerializedData = 'test';
  const mockDownloadResult = {
    serializeBinary: jest.fn().mockReturnValue(mockSerializedData),
    dataChunk: {
      length: 1,
    },
  } as unknown as DownloadResultDataResponse;

  const mockResultsGrpcService = {
    downloadResultData$: jest.fn().mockReturnValue(of(mockDownloadResult)),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const refresh = {
    next: jest.fn(),
  } as unknown as Subject<void>;

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ResultsGrpcActionsService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: StatusService, useValue: mockStatusService },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
      ]
    }).inject(ResultsGrpcActionsService);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    service.refresh = refresh;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('Download result data', () => {
    let downloadSpy: jest.SpyInstance;

    describe('With single result', () => {
      const input = [mockResult1];
      
      describe('Without errors', () => {
        beforeEach(() => {
          downloadSpy = jest.spyOn(service, 'downloadAs').mockImplementation(() => { });
          const action = getAction(service.actions, 'download');
          action.click(input);
        });

        it('should call downloadResultData$ from the resultsGrpc service', () => {
          expect(mockResultsGrpcService.downloadResultData$).toHaveBeenCalledTimes(input.length);
        });

        it('should download result data', () => {
          expect(downloadSpy).toHaveBeenCalledTimes(input.length);
        });

        it('should display a success message', () => {
          expect(mockNotificationService.success).toHaveBeenCalledWith(`${mockResult1.resultId} downloaded`);
        });
      });

      describe('With errors', () => {
        beforeEach(() => {
          downloadSpy = jest.spyOn(service, 'downloadAs').mockImplementation(() => { });
          const action = getAction(service.actions, 'download');
          mockResultsGrpcService.downloadResultData$.mockReturnValueOnce(throwError(() => new Error())); // Only one time
          action.click(input);
        });

        it('should catch an error', () => {
          expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });

        it('should display a personnalized error message for the result', () => {
          expect(mockNotificationService.error).toHaveBeenCalledWith(`An error occurred while downloading result ${mockResult1.resultId}`);
        });
      });
    });

    describe('With multiple results', () => {
      const input = [mockResult1, mockResult2];

      describe('Without errors', () => {
        beforeEach(() => {
          downloadSpy = jest.spyOn(service, 'downloadAsZip').mockImplementation();
          const action = getAction(service.actions, 'download');
          action.click(input);
        });

        it('should call downloadResultData$ from the resultsGrpc service', () => {
          expect(mockResultsGrpcService.downloadResultData$).toHaveBeenCalledTimes(input.length);
        });

        it('should download result data', () => {
          expect(downloadSpy).toHaveBeenCalledTimes(1);
        });

        it('should display a success message', () => {
          expect(mockNotificationService.success).toHaveBeenCalledWith('Results downloaded');
        });
      });

      describe('With errors', () => {
        beforeEach(() => {
          downloadSpy = jest.spyOn(service, 'downloadAs').mockImplementation(() => { });
          const action = getAction(service.actions, 'download');
          mockResultsGrpcService.downloadResultData$.mockReturnValue(throwError(() => new Error())); // Only one time
          action.click(input);
        });

        it('should call downloadResultData$ from the resultsGrpc service', () => {
          expect(mockResultsGrpcService.downloadResultData$).toHaveBeenCalledTimes(input.length);
        });
        
        it('should not download', () => {
          expect(downloadSpy).not.toHaveBeenCalled();
        });

        it('should not catch any error', () => {
          expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should display an error message', () => {
          expect(mockNotificationService.error).toHaveBeenCalledWith('Could not find data to download');
        });
      });
    });

    describe('With an empty array', () => {
      beforeEach(() => {
        downloadSpy = jest.spyOn(service, 'downloadAs').mockImplementation(() => { });
        const action = getAction(service.actions, 'download');
        action.click([]);
      });

      it('should not call downloadResultData$ from the resultsGrpc service', () => {
        expect(mockResultsGrpcService.downloadResultData$).not.toHaveBeenCalled();
      });

      it('should not download', () => {
        expect(downloadSpy).not.toHaveBeenCalled();
      });

      it('should not catch any error', () => {
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('should display an error message', () => {
        expect(mockNotificationService.error).toHaveBeenCalledWith('Could not find data to download');
      });
    });
  });

  describe('downloadAs', () => {
    const mockCreateElementResult = {
      href: '',
      download: '',
      rel: '',
      style: {
        display: '',
      },
      click: jest.fn(),
      remove: jest.fn(),
    } as unknown as HTMLAnchorElement;

    const mockUrl = 'some-url';

    const mockBlob = 'blob' as unknown as Uint8Array;
    const fileName = 'result';
    const mime = 'application/json';

    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    const createObjectUrlSpy = jest.fn(() => mockUrl);
    const revokeObjectURLSpy = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      global.URL.createObjectURL = createObjectUrlSpy;
      global.URL.revokeObjectURL = revokeObjectURLSpy;
      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockCreateElementResult);
      appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementationOnce(() => ({} as Node));
      service.downloadAs(mockBlob, fileName, mime);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create an element', () => {
      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    it('should create an URL', () => {
      expect(createObjectUrlSpy).toHaveBeenCalled();
    });

    it('should set the href as the created URL', () => {
      expect(mockCreateElementResult.href).toEqual(mockUrl);
    });

    it('should append a child to the body', () => {
      expect(appendChildSpy).toHaveBeenCalledWith(mockCreateElementResult);
    });

    it('should set the correct filename to the document', () => {
      expect(mockCreateElementResult.download).toBe(fileName);
    });

    it('should click on the element', () => {
      expect(mockCreateElementResult.click).toHaveBeenCalled();
    });

    it('should revoke the URL', () => {
      jest.runAllTimers();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('downloadAsZip', () => {
    let downloadSpy: jest.SpyInstance;

    beforeEach(async () => {
      downloadSpy = jest.spyOn(service, 'downloadAs').mockImplementation(() => {});
      await service.downloadAsZip([
        ['result-1', mockDownloadResult],
        ['result-2', mockDownloadResult]
      ]);
    });

    it('should download', () => {
      expect(downloadSpy).toHaveBeenCalledWith(
        expect.any(Uint8Array),
        expect.any(String),
        'application/zip'
      );
    });
  });

  describe('handleError', () => {
    const error = 'error' as unknown as GrpcStatusEvent;

    it('should log the error', () => {
      service['handleError'](error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should display a notification to the user', () => {
      service['handleError'](error);
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred.');
    });

    it('should display a notification to the user with a custom message', () => {
      const message = 'Task not cancelled';
      service['handleError'](error, message);
      expect(mockNotificationService.error).toHaveBeenCalledWith(message);
    });
  });

  it('should unsubscribe', () => {
    service.ngOnDestroy();
    expect(service['subscriptions'].closed).toBeTruthy();
  });
});