import { TestBed } from '@angular/core/testing';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcAuthService } from './grpc-auth.service';
import { ResultsClient } from '@aneoconsultingfr/armonik.api.angular';

describe('GrpcAuthService', () => {
  let service: GrpcAuthService;

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
      providers: [GrpcAuthService, ResultsClient],
    });
    service = TestBed.inject(GrpcAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
