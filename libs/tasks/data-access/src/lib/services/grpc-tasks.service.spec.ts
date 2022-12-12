import { TestBed } from '@angular/core/testing';
import { TasksClient } from '@armonik.admin.gui/shared/data-access';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcTasksService } from './grpc-tasks.service';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';

describe('GrpcTasksService', () => {
  let service: GrpcTasksService;

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
      providers: [GrpcTasksService, TasksClient],
    });
    service = TestBed.inject(GrpcTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
