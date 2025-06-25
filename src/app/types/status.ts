import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { StatusScope } from './config';

export type Status = TaskStatus | SessionStatus | ResultStatus;

export type StatusLabelColor = {
  label: string;
  color: string;
  icon?: string;
}

export abstract class StatusService<S extends Status> {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);

  private readonly keys: S[];
  readonly statuses: Record<S, StatusLabelColor>;
  readonly scope: StatusScope;

  constructor(scope: StatusScope) {
    this.scope = scope;
    let statuses = this.storageService.getItem<Record<S, StatusLabelColor>>(`${scope}-statuses`, true) as Record<S, StatusLabelColor>;
    if (!statuses) {
      statuses = structuredClone(this.defaultConfigService.exportedDefaultConfig[`${scope}-statuses`] as Record<S, StatusLabelColor>);
    }
    this.statuses = statuses;
    this.keys = Object.keys(statuses).map((status) => Number(status) as S);
  }

  /**
   * @param status Status to get the label of
   * @returns label of the provided status
   */
  statusToLabel(status: S): StatusLabelColor {
    return this.statuses[status];
  }

  /**
   * Replace the stored configuration of the statuses
   * @param statuses Record of a status and its color/label/icon
   */
  updateStatuses(statuses: Record<S, StatusLabelColor>) {
    this.keys.forEach((status) => {
      this.statuses[status] = statuses[status];
    });
    this.storageService.setItem(`${this.scope}-statuses`, this.statuses);
  }

  /**
   * @returns the default configuration of the statuses
   */
  getDefault() {
    return this.defaultConfigService.exportedDefaultConfig[`${this.scope}-statuses`] as Record<S, StatusLabelColor>;
  }
}