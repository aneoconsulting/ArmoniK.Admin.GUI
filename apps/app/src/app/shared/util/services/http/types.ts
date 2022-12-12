import { ExternalServicesEnum } from '../../enums';

export type HealthCheckResponse = {
  isResponseOk: boolean;
  service: ExternalServicesEnum;
};
