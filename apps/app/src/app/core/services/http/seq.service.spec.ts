import { HttpResponse } from '@angular/common/http';
import { of, Subscription, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { SeqService } from './seq.service';

describe('SeqService', () => {
  let service: SeqService;
  let http: jasmine.SpyObj<ApiService>;
  let subscription: Subscription;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['head']);
    service = new SeqService(http);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('health check', () => {
    it('should health check', (done) => {
      http.head.and.returnValue(of({} as HttpResponse<object>));

      subscription = service.healthCheck$().subscribe({
        next: () => {
          expect(http.head).toHaveBeenCalledWith('/seq');
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });
  });
});
