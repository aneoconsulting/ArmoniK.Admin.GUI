import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

export interface Environment {
  color: string,
  name: string,
  description: string,
  version: string,
}

@Injectable()
export class EnvironmentService {
  private environment: Environment;
  readonly environments: Environment[];

  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);

  constructor() {
    this.environments = (this.storageService.getItem<Environment[]>('environments') ?? this.defaultConfigService.environment) as Environment[];
  }

  getEnvironment(): Environment {
    return this.environment;
  }

  setEnvironment(environment: Environment): void {
    this.environment = environment;
  }

  addEnvironment(environment: Environment): void {
    this.environments.push(environment);
  }

  removeEnvironment(index: number): void {
    this.environments.splice(index, 1);
  }
}
