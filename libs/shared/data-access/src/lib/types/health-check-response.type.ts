import { ExternalServicesEnum } from '../enums/external-service.enum';

export type HealthCheckResponse = {
  isResponseOk: boolean;
  service: ExternalServicesEnum;
};
