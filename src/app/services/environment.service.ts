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
  readonly hosts: string[];
  currentHost: string | null;
  currentIndex: number | null;

  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);

  constructor() {
    this.hosts = (this.storageService.getItem<string[]>('environments', true) ?? this.defaultConfigService.environment) as string[];
    this.currentHost = this.storageService.getItem<string>('host-config') ?? null;
    this.currentIndex = this.hosts.findIndex((host) => host === this.currentHost);
  }

  selectHost(index: number) {
    this.currentIndex = index;
    if (index !== -1) {
      this.currentHost = this.hosts[index] ?? null;
    } else {
      this.currentHost = null;
    }
  }

  addEnvironment(environment: string): void {
    this.hosts.push(environment);
    this.saveEnvironments();
  }

  removeEnvironment(index: number): void {
    this.hosts.splice(index, 1);
    this.saveEnvironments();
  }

  private saveEnvironments() {
    this.storageService.setItem('environments', this.hosts);
  }
}
