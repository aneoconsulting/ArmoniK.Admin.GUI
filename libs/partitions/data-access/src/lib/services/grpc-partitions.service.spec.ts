import { TestBed } from '@angular/core/testing';
import { PartitionsClient } from '@armonik.admin.gui/shared/data-access';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcPartitionsService } from './grpc-partitions.service';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';

describe('GrpcTasksService', () => {
  let service: GrpcPartitionsService;

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
      providers: [GrpcPartitionsService, PartitionsClient],
    });
    service = TestBed.inject(GrpcPartitionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
