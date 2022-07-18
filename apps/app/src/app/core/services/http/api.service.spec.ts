import { HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    service = new ApiService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get', (done) => {
    const expectedData = { name: 'test' };
    http.get.and.returnValue(of(expectedData));

    const path = 'test';
    const params = new HttpParams();

    service.get(path, params).subscribe(
      (data) => {
        expect(data).toEqual(expectedData);
        done();
      },
      (_) => {
        done.fail();
      }
    );

    expect(http.get.calls.count()).toBe(1);
  });

  it('should put with a body', (done) => {
    const expectedData = { name: 'test' };
    http.put.and.returnValue(of(expectedData));

    const path = 'test';
    const body = { name: 'test' };

    service.put(path, body).subscribe(
      (data) => {
        expect(data).toEqual(expectedData);
        done();
      },
      (_) => {
        done.fail();
      }
    );

    expect(http.put.calls.count()).toBe(1);
  });

  it('should put without a body', (done) => {
    const expectedData = { name: 'test' };
    http.put.and.returnValue(of(expectedData));

    const path = 'test';

    service.put(path).subscribe(
      (data) => {
        expect(data).toEqual(expectedData);
        done();
      },
      (_) => {
        done.fail();
      }
    );

    expect(http.put.calls.count()).toBe(1);
  });

  it('should return an error if the request fails with get', (done) => {
    const error = { status: 404 };
    http.get.and.returnValue(throwError(() => error));

    const path = 'test';
    const params = new HttpParams();

    service.get(path, params).subscribe({
      next: (_) => done.fail('expected an error'),
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });
});
