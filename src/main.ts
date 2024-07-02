/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { Subscription, fromEvent } from 'rxjs';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const mouseMove = fromEvent(document, 'mousemove');
const mouse = document.getElementById('mouse-effect');
const loadingApp = document.getElementById('loading-app');
const subscriptions = new Subscription();
let hasError = false;

const theme = window.localStorage.getItem('navigation-theme');

function setDarkBackGroundColor() {
  if (loadingApp) {
    loadingApp.style.backgroundColor = '#1d1d1d';
    loadingApp.style.color = 'white';
  }
}

if (mouse) {
  switch (theme) {
  case 'deeppurple-amber':
    mouse.style.background = 'radial-gradient(#9c2a2277 10%, transparent 70%)';
    setDarkBackGroundColor();
    break;
  case 'purple-green':
    mouse.style.background = 'radial-gradient(#683ab77c 10%, transparent 70%)';
    setDarkBackGroundColor();
    break;
  case 'pink-bluegrey':
    mouse.style.background = 'radial-gradient(#e91e6377 10%, transparent 70%)';
    break;
  default:
    mouse.style.background = 'radial-gradient(royalblue 10%, transparent 70%)';
  }

  subscriptions.add(mouseMove.subscribe((mouseEvent) => {
    const x = (mouseEvent as MouseEvent).clientX;
    const y = (mouseEvent as MouseEvent).clientY;
    mouse.style.left = `${x}px`;
    mouse.style.top = `${y}px`;

    const dx = Math.abs(x - window.innerWidth / 2);
    const dy = Math.abs(y - window.innerHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const size = Math.max(300 - distance, 125);

    mouse.style.width = `${size}px`;
    mouse.style.height = `${size}px`;
  }));
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    hasError = true;
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
  })
  .finally(() => {
    if (!hasError) {
      subscriptions.unsubscribe();
    }
  });
