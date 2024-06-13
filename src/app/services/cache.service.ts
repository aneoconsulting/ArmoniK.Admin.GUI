import { Injectable } from '@angular/core';
import { StatusCount } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { GrpcResponse } from '@app/types/data';

@Injectable()
export class CacheService {
  private tableCache: Map<Scope, GrpcResponse> = new Map();
  private tasksStatusesCache: Map<string, StatusCount[]> = new Map();

  save(scope: Scope, data: GrpcResponse) {
    this.tableCache.set(scope, data);
  }

  get(scope: Scope) {
    return this.tableCache.get(scope);
  }

  saveStatuses(id: string, statusCount: StatusCount[] | undefined) {
    if (statusCount) {
      this.tasksStatusesCache.set(id, statusCount);
    }
  }

  getStatuses(id: string) {
    return this.tasksStatusesCache.get(id);
  }
}