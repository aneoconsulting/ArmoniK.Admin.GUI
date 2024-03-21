/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    const loading = document.getElementById('loading') as HTMLDivElement;
    const error = document.getElementById('error') as HTMLDivElement;
    const errorMessage = document.getElementById('error-message') as HTMLDivElement;

    loading.style.display = 'none';
    error.style.display = 'block';

    if (err?.statusMessage) {
      errorMessage.textContent = err.statusMessage;
      return;
    }

    errorMessage.textContent = err.message || err;
  });
