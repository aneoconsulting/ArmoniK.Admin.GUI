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
  hosts: string[];
  currentHost: string | null;

  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly grpcInterceptor = inject(GRPC_INTERCEPTORS) as GrpcHostInterceptor;

  constructor() {
    this.hosts = this.getHostLists();
    this.currentHost = this.getHost();
  }

  private getHostLists() {
    return (this.storageService.getItem<string[]>('environments', true) ?? this.defaultConfigService.environments) as string[];
  }

  private getHost() {
    return this.storageService.getItem<string>('host-config') ?? this.defaultConfigService.hostConfig;
  }

  selectHost(host: string | null) {
    this.currentHost = host;
    this.grpcInterceptor.setHost(this.currentHost);
    if (host === null) {
      this.storageService.removeItem('host-config');
    }
  }

  addEnvironment(environment: string): void {
    this.hosts.push(environment);
    this.saveEnvironments();
  }

  removeEnvironment(host: string): void {
    const index = this.hosts.findIndex((h) => h === host);
    console.log(index);
    if (index != -1) {
      this.hosts = this.hosts.splice(index, 1);
      this.saveEnvironments();
    }
  }

  private saveEnvironments() {
    this.storageService.setItem('environments', this.hosts);
  }
}
