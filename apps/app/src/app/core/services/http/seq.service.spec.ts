import { of, Subscription, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { SeqService } from './seq.service';

describe('SeqService', () => {
  let service: SeqService;
  let http: jasmine.SpyObj<ApiService>;
  let subscription: Subscription;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get']);
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

  describe('ping', () => {
    it('should ping', (done) => {
      http.get.and.returnValue(of({}));

      subscription = service.ping().subscribe({
        next: () => {
          expect(http.get).toHaveBeenCalledWith('/api/seq/ping');
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should ping error', (done) => {
      const error = { status: 404 };

      http.get.and.returnValue(throwError(() => error));

      subscription = service.ping().subscribe({
        next: () => {
          done.fail('should not be called');
        },
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });
});
