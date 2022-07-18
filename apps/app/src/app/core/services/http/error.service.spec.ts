import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ErrorService],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(ErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should navigate to error page', () => {
    spyOn(router, 'navigate');

    service.handleError(
      {} as ActivatedRouteSnapshot,
      { status: 404 } as HttpErrorResponse
    );

    expect(router.navigate).toHaveBeenCalledWith(['/', 'error']);
  });
});
