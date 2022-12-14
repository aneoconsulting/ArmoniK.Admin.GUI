import { TestBed } from '@angular/core/testing';
import { first, tap } from 'rxjs';
import { BaseGrpcService } from './base-grpc.service';

describe('BaseGrpcService', () => {
  let service: BaseGrpcService;

  beforeEach(() => {
    service = new BaseGrpcService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a timeout', () => {
    class TestService extends BaseGrpcService {
      constructor() {
        super();
      }

      public test() {
        return this._timeout$;
      }
    }

    const testService = new TestService();

    expect(testService.test()).toBeTruthy();
  });
});
