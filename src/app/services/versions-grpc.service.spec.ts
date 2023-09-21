import { ListVersionsResponse, VersionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { VersionsGrpcService } from './versions-grpc.service';

describe('VersionsGrpcService', () => {
  let service: VersionsGrpcService;
  const listVersions$= new BehaviorSubject<ListVersionsResponse>({
    core: 'my_core',
    api: 'my_api'
  } as unknown as ListVersionsResponse).asObservable();

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        VersionsGrpcService,
        {provide: VersionsClient, useValue: {
          listVersions: () => {
            return listVersions$;
          }
        }}
      ]
    }).inject(VersionsGrpcService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable', () => {
    expect(service.listVersions$()).toBe(listVersions$);
  });
});