import { HttpParams } from '@angular/common/http';
import { of, Subscription, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  // Use a # to verify that url is encoded
  const sessionId = '1#4';

  let service: SessionsService;
  let http: jasmine.SpyObj<ApiService>;
  let subscription: Subscription;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get', 'put']);
    service = new SessionsService(http);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPaginated', () => {
    it('should get all sessions', (done) => {
      http.get.and.returnValue(of({}));

      subscription = service.getAllPaginated().subscribe({
        next: () => {
          expect(http.get).toHaveBeenCalledWith(
            '/api/sessions',
            new HttpParams()
          );
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should get all sessions error', (done) => {
      const error = { status: 404 };

      http.get.and.returnValue(throwError(() => error));

      subscription = service.getAllPaginated().subscribe({
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

  describe('getOne', () => {
    it('should get one session', (done) => {
      http.get.and.returnValue(of({}));

      subscription = service.getOne(sessionId).subscribe({
        next: () => {
          expect(http.get).toHaveBeenCalledWith(
            '/api/sessions/' + encodeURIComponent(sessionId)
          );
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should get one session error', (done) => {
      const error = { status: 404 };

      http.get.and.returnValue(throwError(() => error));

      subscription = service.getOne(sessionId).subscribe({
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

  describe('cancel', () => {
    it('should cancel a session', (done) => {
      http.put.and.returnValue(of({}));

      subscription = service.cancel(sessionId).subscribe({
        next: () => {
          expect(http.put).toHaveBeenCalledWith(
            '/api/sessions/' + encodeURIComponent(sessionId) + '/cancel'
          );
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should cancel session error', (done) => {
      const error = { status: 404 };

      http.put.and.returnValue(throwError(() => error));

      subscription = service.cancel(sessionId).subscribe({
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
