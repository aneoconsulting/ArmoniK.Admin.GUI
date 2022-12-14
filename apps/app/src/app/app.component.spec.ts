// import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GrpcAuthService } from '@armonik.admin.gui/auth/data-access';
import { ClarityModule } from '@clr/angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthService } from './shared/data-access/auth.service';
import {
  GrafanaService,
  HistoryService,
  SeqService,
  SettingsService,
} from './shared/util';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        SeqService,
        GrafanaService,
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
