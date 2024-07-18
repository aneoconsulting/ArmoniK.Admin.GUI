import { Injectable } from '@angular/core';
import { Scope } from '@app/types/config';
import { GrpcResponse } from '@app/types/data';

@Injectable()
export class CacheService {
  private tableCache: Map<Scope, GrpcResponse> = new Map();

  save(scope: Scope, data: GrpcResponse) {
    this.tableCache.set(scope, data);
  }

  get(scope: Scope) {
    return this.tableCache.get(scope);
  }
}