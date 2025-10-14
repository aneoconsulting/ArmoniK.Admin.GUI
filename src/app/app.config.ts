import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GRPC_INTERCEPTORS, GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { CacheService } from '@services/cache.service';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { ThemeService } from '@services/theme.service';
import { UserGrpcService } from '@services/user-grpc.service';
import { UserService } from '@services/user.service';
import { VersionsGrpcService } from '@services/versions-grpc.service';
import { VersionsService } from '@services/versions.service';
import { catchError, merge, of, tap } from 'rxjs';
import { routes } from './app.routes';
import { provideArmonikDateAdapter } from './initialisation/date-adapter';
import { GrpcHostInterceptor } from './interceptors/grpc.interceptor';
import { ExportedDefaultConfig } from './types/config';

function initializeAppFactory(userGrpcService: UserGrpcService, userService: UserService, versionsGrpcService: VersionsGrpcService, versionsService: VersionsService, httpClient: HttpClient, storageService: StorageService) {
  return () => merge(
    versionsGrpcService.listVersions$().pipe(
      tap((data) => {
        versionsService.setCoreVersion(data.core);
        versionsService.setAPIVersion(data.api);
      }),
      catchError((err) => {
        console.error(err);
        versionsService.setCoreVersion(null);
        versionsService.setAPIVersion(null);
        return of();
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
        console.error(err);
        return of();
      })
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
    ThemeService,
    NavigationService,
    CacheService,
    FiltersCacheService,
    {
      provide: Window,
      useValue: window
    },
    {
      provide: Storage,
      useValue: localStorage
    },
    {
      provide: GRPC_INTERCEPTORS,
      useClass: GrpcHostInterceptor,
    },
    provideAppInitializer(() => {
      const initializerFn = (initializeAppFactory)(inject(UserGrpcService), inject(UserService), inject(VersionsGrpcService), inject(VersionsService), inject(HttpClient), inject(StorageService));
      return initializerFn();
    }),
    provideArmonikDateAdapter(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
    importProvidersFrom(GrpcCoreModule.forRoot()),
    importProvidersFrom(GrpcWebClientModule.forRoot({ settings: { host: '' } }))
  ]
};
