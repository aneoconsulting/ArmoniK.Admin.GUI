import { CheckHealthRequest, CheckHealthResponse, HealthChecksServiceClient,  } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HealthCheckGrpcService {
  private readonly healthcheckClient = inject(HealthChecksServiceClient);

  list$(): Observable<CheckHealthResponse> {
    const requestData: CheckHealthRequest = new CheckHealthRequest();
    return this.healthcheckClient.checkHealth(requestData);
  }
}