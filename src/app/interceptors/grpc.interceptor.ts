 
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
  readonly checkRegex = /(^$|(http(s)?:\/\/)([\w-]+\.)+[\w-]+((:\d{1,5})?)+([\w-]*))/;

  private readonly storageService = inject(StorageService);

  constructor() {
    this.host = this.storageService.getItem('host-config');
  }

  /**
   * Function intercepting the Grpc requests.
   */
  intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>> {
    if (this.host !== null) {
      (request.client as GrpcClientSettings).settings.host = this.host;
    }
    return next.handle(request);
  }

  /**
   * Override the default host ('') of the GUI.
   * Must be a correct and valid URL.
   * @param entry string
   */
  setHost(entry: string | null) {
    if (entry !== null) {
      if (this.checkRegex.test(entry)) {
        this.host = entry;
        this.storageService.setItem('host-config', entry);
      }
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

  /**
   * Create a test environment to check if an URL is working.
   * @param hostValue 
   */
  test(hostValue: string | null, testFn: () => void) {
    const cachedHost = this.host;
    this.host = hostValue;
    testFn();
    this.host = cachedHost;
  }
}