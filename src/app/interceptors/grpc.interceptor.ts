 
import { inject } from '@angular/core';
import { GrpcMessage, GrpcRequest, GrpcEvent, GrpcClient } from '@ngx-grpc/common';
import { GrpcHandler, GrpcInterceptor } from '@ngx-grpc/core';
import { StorageService } from '@services/storage.service';
import { Observable } from 'rxjs';

export type GrpcClientSettings = GrpcClient<unknown> & {
  settings: {
    host: string;
  }
}
/**
 * Intercept every Grpc Request and update the host if the user configurated it.
 */
export class GrpcHostInterceptor implements GrpcInterceptor {
  host: string | null = null;
  readonly checkRegex = /(http(s)?:\/\/)([\w-]+\.)+[\w-]+[\w-]*/;
  private readonly storageService = inject(StorageService);

  constructor() {
    this.host = this.storageService.getItem('host-config');
  }

  /**
   * Function intercepting the Grpc requests.
   */
  intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>> {
    (request.client as GrpcClientSettings).settings.host = this.host ?? '';
    return next.handle(request);
  }

  /**
   * Override the default host ('') of the GUI.
   * Must be a correct and valid URL.
   * @param entry string
   */
  setHost(entry: string | null) {
    if (entry !== null) {
      this.host = entry;
      this.storageService.setItem('host-config', entry);
    } else {
      this.clearHost();
      this.host = null;
    }
  }
  
  /**
     * Reset the host to default.
     */
  clearHost() {
    this.storageService.removeItem('host-config');
  }
}