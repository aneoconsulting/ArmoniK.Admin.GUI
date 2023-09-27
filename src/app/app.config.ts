import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { catchError, merge, tap } from 'rxjs';
import { DefaultConfigService } from '@services/default-config.service';
import { Environment, EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserGrpcService } from '@services/user-grpc.service';
import { UserService } from '@services/user.service';
import { VersionsGrpcService } from '@services/versions-grpc.service';
import { VersionsService } from '@services/versions.service';
import { routes } from './app.routes';

function initializeAppFactory(userGrpcService: UserGrpcService, userService: UserService, versionsGrpcService: VersionsGrpcService, versionsService: VersionsService, httpClient: HttpClient, environmentService: EnvironmentService) {
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
    userGrpcService.getUser$().pipe(
      tap((data) => {
        if (!data.user) {
          throw new Error('No user');
        }
        userService.user = data.user;
      }),
      catchError((err) => {
        throw err;
      })
    ),
    httpClient.get<Partial<Environment>>('/static/environment.json').pipe(
      tap((data)=> {
        const environment = {
          color: data.color || 'red',
          name: data.name || 'Unknown',
          description: data.description || 'Unknown',
          version: data.version || 'Unknown',
        } satisfies Environment;

        environmentService.setEnvironment(environment);
      }),
      catchError((err) => {
        throw err;
      }),
    )
  );
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
    EnvironmentService,
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
      deps: [UserGrpcService, UserService, VersionsGrpcService, VersionsService, HttpClient, EnvironmentService],
      multi: true
    },
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(GrpcCoreModule.forRoot()),
    importProvidersFrom(GrpcWebClientModule.forRoot({ settings: { host: '' } }))
  ]
};
