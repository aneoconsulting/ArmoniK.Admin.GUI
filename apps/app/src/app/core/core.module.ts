import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocaleProvider } from './providers';
import {
  ApiService,
  ApplicationsService,
  ErrorService,
  LanguageService,
  PagerService,
  SeqService,
  SessionsService,
  SettingsService,
  TasksService,
} from './services';
import { GrpcSessionsService, GrpcTasksService } from './services/grpc';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';

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
    ApiService,
    ErrorService,
    ApplicationsService,
    SessionsService,
    TasksService,
    PagerService,
    SeqService,
    GrpcSessionsService,
    GrpcTasksService,
  ],
})
export class CoreModule {}
