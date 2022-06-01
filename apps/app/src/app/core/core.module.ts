import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ApiService,
  ErrorService,
  ApplicationsService,
  SessionsService,
  TasksService,
} from './services';

/**
 * contain the code that is specific to your application and implements the Cross-Cutting Concerns of the application
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    ApiService,
    ErrorService,
    ApplicationsService,
    SessionsService,
    TasksService,
  ],
})
export class CoreModule {}
