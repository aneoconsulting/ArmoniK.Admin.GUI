import { HealthChecksServiceClient } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { HealthCheckGrpcService } from './healthcheck-grpc.service';

describe('HealthCheckGrpcService', () => {
  let service: HealthCheckGrpcService;
  
  const mockHealthChecksServiceClient = {
    checkHealth: jest.fn()
  };
  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        HealthCheckGrpcService,
        {provide: HealthChecksServiceClient, useValue: mockHealthChecksServiceClient}
      ]
    }).inject(HealthCheckGrpcService);
  });

  it('should exist',() => {
    expect(service).toBeTruthy();
  });

  it('should check health',() => {
    service.list$();
    expect(mockHealthChecksServiceClient.checkHealth).toHaveBeenCalled();
  });
});