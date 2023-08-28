import { ListVersionsRequest, ListVersionsResponse, VersionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class VersionsGrpcService {
  #versionService = inject(VersionsClient);

  listVersions$(): Observable<ListVersionsResponse> {
    const request = new ListVersionsRequest();
    return this.#versionService.listVersions(request);
  }
}
