import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { catchError, merge, tap } from 'rxjs';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserGrpcService } from '@services/user-grpc.service';
import { UserService } from '@services/user.service';
import { VersionsGrpcService } from '@services/versions-grpc.service';
import { VersionsService } from '@services/versions.service';
import { routes } from './app.routes';

function initializeAppFactory(userGrpcService: UserGrpcService, userService: UserService, versionsGrpcService: VersionsGrpcService, versionsService: VersionsService) {
  return () => merge(
    versionsGrpcService.listVersions$().pipe(
      tap((data) => {
        versionsService.setCoreVersion(data.core);
        versionsService.setAPIVersion(data.api);
      }),
      catchError((err) => {
        throw err;
      })
    ),
    userGrpcService.me$().pipe(
      tap((data) => {
        if (!data.user) {
          throw new Error('No user');
        }
        userService.user = data.user;
      }),
      catchError((err) => {
        throw err;
      })
    ));
}

export const appConfig: ApplicationConfig = {
  providers: [
    DefaultConfigService,
    IconsService,
    UserGrpcService,
    UserService,
    VersionsGrpcService,
    VersionsService,
    StorageService,
    NavigationService,
    {
      provide: Window,
      useValue: window
    },
    {
      provide: Storage,
      useValue: localStorage
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [UserGrpcService, UserService, VersionsGrpcService, VersionsService],
      multi: true
    },
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(GrpcCoreModule.forRoot()),
    importProvidersFrom(GrpcWebClientModule.forRoot({ settings: { host: '' } }))
  ]
};
