import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { catchError, tap } from 'rxjs';
import { UserGrpcService } from '@services/user-grpc.service';
import { UserService } from '@services/user.service';
import { routes } from './app.routes';

function initializeAppFactory(userGrpcService: UserGrpcService, userService: UserService) {
  return () => userGrpcService.me$().pipe(
    tap((data) => {
      if (!data.user) {
        throw new Error('No user');
      }
      userService.user = data.user;
      console.log('initializeAppFactory', userService.user);
    }),
    catchError((err) => {
      throw err;
    })
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    UserService,
    UserGrpcService,
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
      deps: [UserGrpcService, UserService],
      multi: true
    },
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(GrpcCoreModule.forRoot()),
    importProvidersFrom(GrpcWebClientModule.forRoot({ settings: { host: '' } }))
  ]
};
