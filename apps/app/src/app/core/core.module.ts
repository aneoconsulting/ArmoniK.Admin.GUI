import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocaleProvider } from './providers';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcCoreModule } from '@ngx-grpc/core';
import {
  ApiService,
  ApplicationsService,
  ErrorService,
  GrpcPagerService,
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
import { GrpcApplicationsService } from './services/grpc/grpc-applications.service';

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
    GrpcPagerService,
    GrpcApplicationsService,
    {
      useFactory: () => localStorage,
    },
  ],
})
