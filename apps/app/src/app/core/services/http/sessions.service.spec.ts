import { HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let http: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get', 'put']);
    service = new SessionsService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all sessions', (done) => {
    http.get.and.returnValue(of({}));

    service.getAllPaginated().subscribe({
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

    service.getAllPaginated().subscribe({
      next: () => {
        done.fail('should not be called');
      },
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should get one session', (done) => {
    http.get.and.returnValue(of({}));

    const sessionId = '1#4';
    service.getOne(sessionId).subscribe({
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

    service.getOne('1').subscribe({
      next: () => {
        done.fail('should not be called');
      },
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should cancel a session', (done) => {
    http.put.and.returnValue(of({}));

    const sessionId = '1#4';
    service.cancel(sessionId).subscribe({
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

    service.cancel('1').subscribe({
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
