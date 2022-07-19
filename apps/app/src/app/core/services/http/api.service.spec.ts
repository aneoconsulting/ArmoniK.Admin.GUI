import { HttpClient, HttpParams } from '@angular/common/http';
import { of, Subscription, throwError } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: jasmine.SpyObj<HttpClient>;
  let subscription: Subscription;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    service = new ApiService(http);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get', (done) => {
      const expectedData = { name: 'test' };
      http.get.and.returnValue(of(expectedData));

      const path = 'test';
      const params = new HttpParams();

      subscription = service.get(path, params).subscribe({
        next: (data) => {
          expect(data).toEqual(expectedData);
          done();
        },
        error: () => {
          done.fail();
        },
      });

      expect(http.get.calls.count()).toBe(1);
    });

    it('should return an error if the request fails with get', (done) => {
      const error = { status: 404 };
      http.get.and.returnValue(throwError(() => error));

      const path = 'test';
      const params = new HttpParams();

      subscription = service.get(path, params).subscribe({
        next: () => done.fail('expected an error'),
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });

  describe('put', () => {
    it('should put with a body', (done) => {
      const expectedData = { name: 'test' };
      http.put.and.returnValue(of(expectedData));

      const path = 'test';
      const body = { name: 'test' };

      subscription = service.put(path, body).subscribe({
        next: (data) => {
          expect(data).toEqual(expectedData);
          done();
        },
        error: () => {
          done.fail();
        },
      });

      expect(http.put.calls.count()).toBe(1);
    });

    it('should put without a body', (done) => {
      const expectedData = { name: 'test' };
      http.put.and.returnValue(of(expectedData));

      const path = 'test';

      subscription = service.put(path).subscribe({
        next: (data) => {
          expect(data).toEqual(expectedData);
          done();
        },
        error: () => {
          done.fail();
        },
      });

      expect(http.put.calls.count()).toBe(1);
    });

    it('should return an error if the request fails with PUT', (done) => {
      const error = { status: 404 };
      http.put.and.returnValue(throwError(() => error));

      const path = 'test';

      subscription = service.put(path).subscribe({
        next: () => done.fail('expected an error'),
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });
});
