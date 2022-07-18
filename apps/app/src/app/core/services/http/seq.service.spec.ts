import { of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { SeqService } from './seq.service';

describe('SeqService', () => {
  let service: SeqService;
  let http: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get']);
    service = new SeqService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ping', (done) => {
    http.get.and.returnValue(of({}));

    service.ping().subscribe({
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

    service.ping().subscribe({
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
