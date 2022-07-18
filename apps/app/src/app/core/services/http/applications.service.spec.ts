import { HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let http: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get']);
    service = new ApplicationsService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all applications', (done) => {
    http.get.and.returnValue(of({}));

    service.getAll().subscribe({
      next: () => {
        expect(http.get).toHaveBeenCalledWith('/api/applications');
        done();
      },
      error: () => {
        done.fail('should not be called');
      },
    });
  });

  it('should get all applications error', (done) => {
    const error = { status: 404 };

    http.get.and.returnValue(throwError(() => error));

    service.getAll().subscribe({
      next: () => {
        done.fail('should not be called');
      },
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should get all applications with errors', (done) => {
    http.get.and.returnValue(of({}));

    const params = new HttpParams().set('page', '1').set('limit', '10');
    service.getAllWithErrorsPaginated(params).subscribe({
      next: () => {
        expect(http.get).toHaveBeenCalledWith(
          '/api/applications/errors',
          params
        );
        done();
      },
      error: () => {
        done.fail('should not be called');
      },
    });
  });

  it('should get all applications with errors error', (done) => {
    const error = { status: 404 };

    http.get.and.returnValue(throwError(() => error));

    service.getAllWithErrorsPaginated(new HttpParams()).subscribe({
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
