import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';

@Injectable()
export class HealthCheckIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #storageService = inject(StorageService);

  saveIntervalValue(intervalValue: number) {
    this.#storageService.setItem('healthcheck-interval', intervalValue);
  }

  restoreIntervalValue(): number {
    const value = Number(this.#storageService.getItem<number>('healthcheck-interval'));

    if(Number.isNaN(value)) {
      return this.#defaultConfigService.healthCheck.interval;
    }

    return value;
  }
}