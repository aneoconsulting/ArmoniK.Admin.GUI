import { TestBed } from '@angular/core/testing';
import { ApplicationsClient } from '@armonik.admin.gui/shared/data-access';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcApplicationsService } from './grpc-applications.service';

describe('GrpcApplicationsService', () => {
  let service: GrpcApplicationsService;

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
      providers: [GrpcApplicationsService, ApplicationsClient],
    });
    service = TestBed.inject(GrpcApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
