import { Injectable, inject } from '@angular/core';
import { ExternalService } from '@app/types/external-service';
import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {
  #key = 'navigation';
  #externalServicesKey = 'external_services';

  #storageService = inject(StorageService);

  restoreExternalServices(): ExternalService[] {
    return this.#storageService.getItem(this.#storageService.buildKey(this.#key, this.#externalServicesKey), true) as ExternalService[] || [];
  }

  saveExternalServices(externalServices: ExternalService[]) {
    this.#storageService.setItem(this.#storageService.buildKey(this.#key, this.#externalServicesKey), externalServices);
  }
}
