import { HealthStatusEnum } from '@aneoconsultingfr/armonik.api.angular';

export type ServiceHealth = {
  name: string;
  message: string;
  healthy: HealthStatusEnum;
};