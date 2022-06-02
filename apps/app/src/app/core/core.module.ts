import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ApiService,
  ApplicationsService,
  ErrorService,
  SessionsService,
  TasksService,
} from './services';

/**
 * contain the code that is specific to your application and implements the Cross-Cutting Concerns of the application
 */
@NgModule({
  imports: [BrowserModule, CommonModule, HttpClientModule],
  providers: [
    ApiService,
    ErrorService,
    ApplicationsService,
    SessionsService,
    TasksService,
  ],
})
export class CoreModule {}
