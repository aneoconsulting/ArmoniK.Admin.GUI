import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';

export type Status = TaskStatus | SessionStatus | ResultStatus;

export type StatusLabelColor = {
  label: string;
  color: string;
  icon?: string;
}

export abstract class StatusService<S extends Status> {
  abstract readonly statuses: Record<S, StatusLabelColor>;

  /**
   * @param status Status to get the label of
   * @returns label of the provided status
   */
  statusToLabel(status: S): StatusLabelColor {
    return this.statuses[status];
  }
}