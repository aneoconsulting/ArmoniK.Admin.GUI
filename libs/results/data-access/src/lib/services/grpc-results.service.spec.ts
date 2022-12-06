import { TestBed } from '@angular/core/testing';
import { ResultsClient } from '@armonik.admin.gui/shared/util';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcResultsService } from './grpc-results.service';

describe('GrpcResultsService', () => {
  let service: GrpcResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GrpcCoreModule.forRoot(),
        GrpcWebClientModule.forRoot({
          settings: {
            host: '',
          },
        }),
      ],
      providers: [GrpcResultsService, ResultsClient],
    });
    service = TestBed.inject(GrpcResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
