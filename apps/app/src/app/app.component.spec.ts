import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HealthCheckService } from '@armonik.admin.gui/shared/data-access';
import { HistoryService, SettingsService } from './shared/util';
import { AuthService } from './shared/data-access/auth.service';
import { GrpcAuthService } from '@armonik.admin.gui/auth/data-access';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        HealthCheckService,
        SettingsService,
        HistoryService,
        AuthService,
        GrpcAuthService,
        {
          provide: Storage,
          useValue: {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null,
            clear: () => null,
          },
        },
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ClarityModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        GrpcCoreModule.forRoot(),
        GrpcWebClientModule.forRoot({
          settings: {
            host: '',
          },
        }),
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
