import { HttpClient, provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { catchError, merge, of, tap } from 'rxjs';
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
import { ExportedDefaultConfig } from './types/config';

function initializeAppFactory(userGrpcService: UserGrpcService, userService: UserService, versionsGrpcService: VersionsGrpcService, versionsService: VersionsService, httpClient: HttpClient, environmentService: EnvironmentService, storageService: StorageService) {
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
    ),
    httpClient.get<Partial<ExportedDefaultConfig>>('/static/gui_configuration').pipe(
      tap((data) => {
        if (data && Object.keys(data).length !== 0) {
          storageService.importData(data, false, false);
        }
      }),
      catchError((e) => {
        console.warn('Server Config not found or invalid. Using default configuration.');
        console.error(e);
        return of();
      })
    ),
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
      deps: [UserGrpcService, UserService, VersionsGrpcService, VersionsService, HttpClient, EnvironmentService, StorageService],
      multi: true
    },
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
    importProvidersFrom(GrpcCoreModule.forRoot()),
    importProvidersFrom(GrpcWebClientModule.forRoot({ settings: { host: '' } })),
    provideExperimentalZonelessChangeDetection(),
  ]
};
