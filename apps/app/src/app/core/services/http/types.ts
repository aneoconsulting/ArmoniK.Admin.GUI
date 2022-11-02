import { ExternalServices } from '../../enums';

export type HealthCheckResponse = {
  ok: boolean;
  service: ExternalServices;
};
