import { TestBed } from '@angular/core/testing';
import { SessionsClient, TasksClient } from '@armonik.admin.gui/shared/util';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcSessionsService } from './grpc-sessions.service';

describe('GrpcSessionsService', () => {
  let service: GrpcSessionsService;

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
      providers: [GrpcSessionsService, SessionsClient],
    });
    service = TestBed.inject(GrpcSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
