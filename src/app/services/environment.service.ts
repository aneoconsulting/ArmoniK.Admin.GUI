import { Injectable, inject } from '@angular/core';
import { GrpcHostInterceptor } from '@app/interceptors/grpc.interceptor';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
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

  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly grpcInterceptor = inject(GRPC_INTERCEPTORS) as GrpcHostInterceptor;

  constructor() {
    this.hosts = (this.storageService.getItem<string[]>('environments', true) ?? this.defaultConfigService.environment) as string[];
    this.currentHost = this.storageService.getItem<string>('host-config') ?? null;
  }

  selectHost(host: string | null) {
    this.currentHost = host;
    this.grpcInterceptor.setHost(this.currentHost);
  }

  addEnvironment(environment: string): void {
    this.hosts.push(environment);
    this.saveEnvironments();
  }

  removeEnvironment(host: string): void {
    const index = this.hosts.findIndex((h) => h === host);
    if (index != -1) {
      this.hosts.splice(index, 1);
      this.saveEnvironments();
    }
  }

  private saveEnvironments() {
    this.storageService.setItem('environments', this.hosts);
  }
}
