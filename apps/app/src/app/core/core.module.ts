import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { LocaleProvider } from './providers';
import {
  ApiService,
  ApplicationsService,
  BrowserTitleService,
  ErrorService,
  FavoritesService,
  GrafanaService,
  HistoryService,
  LanguageService,
  PagerService,
  SeqService,
  SessionsService,
  SettingsService,
  TasksService,
} from './services';

/**
 * Contain the code that is specific to the application
 * and implements the Cross-Cutting Concerns of the application
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: {
        host: '',
      },
    }),
  ],
  providers: [
    BrowserTitleService,
    LocaleProvider,
    LanguageService,
    SettingsService,
    HistoryService,
    ApiService,
    FavoritesService,
    ErrorService,
    ApplicationsService,
    SessionsService,
    TasksService,
    PagerService,
    SeqService,
    GrafanaService,
    {
      provide: Storage,
      useFactory: () => localStorage,
    },
  ],
})
export class CoreModule {}
