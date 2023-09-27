import { AuthenticationClient, GetCurrentUserResponse } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { UserGrpcService } from './user-grpc.service';
TestBed;

describe('VersionsGrpcService', () => {
  let service: UserGrpcService;
  const user = new BehaviorSubject<GetCurrentUserResponse>({
    user: {
      username: 'user', 
      roles: ['admin'], 
      permissions: ['all']

    }
  } as unknown as GetCurrentUserResponse).asObservable();

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        UserGrpcService,
        {provide: AuthenticationClient, useValue: {
          getCurrentUser: () => {
            return user;
          }
        }}
      ]
    }).inject(UserGrpcService);
  });

  
  it('should create userGrpcService ', () => {
    expect(service).toBeTruthy();
  });

  it('should return an user', () => {
    expect(service.getUser$()).toBe(user);
  });

});