import { HttpResponse } from '@angular/common/http';
import { of, Subscription, throwError } from 'rxjs';
import { ExternalServicesEnum } from '../../enums';
import { ApiService } from './api.service';
import { HealthCheckService } from './health-check.service';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let http: jasmine.SpyObj<ApiService>;
  let subscription: Subscription;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['head']);
    service = new HealthCheckService(http);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a ok response when external service is ok', (done) => {
    http.head.and.returnValue(of({ ok: true } as HttpResponse<object>));

    subscription = service
      .healthCheck$('/url', ExternalServicesEnum.SEQ)
      .subscribe({
        next: (res) => {
          expect(res).toEqual({
            isResponseOk: true,
            service: ExternalServicesEnum.SEQ,
          });
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
  });

  it('should return a ko response when request throw an error', (done) => {
    http.head.and.returnValue(throwError(() => 'error'));

    subscription = service
      .healthCheck$('/url', ExternalServicesEnum.SEQ)
      .subscribe({
        next: (res) => {
          expect(res).toEqual({
            isResponseOk: false,
            service: ExternalServicesEnum.SEQ,
          });
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
  });
});
