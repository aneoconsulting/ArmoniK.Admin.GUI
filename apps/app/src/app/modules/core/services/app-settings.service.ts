import { Injectable } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  currentApplications: Application[] = [];
  activeApplication: Application | null = null;

  constructor() {
    this.loadCurrentApplications();
  }

  setActiveApplication(application: Application | null): void {
    if (application && !this.ifAlreadySet(application)) {
      this.addCurrentApplication(application);
    }
    this.activeApplication = application;
  }

  addCurrentApplication(application: Application): void {
    if (this.ifAlreadySet(application)) {
      return;
    }
    this.currentApplications.push(application);
    this.saveCurrentApplications();
  }

  removeCurrentApplication(application: Application): void {
    this.currentApplications = this.currentApplications.filter(
      (currentApplication) => currentApplication.id !== application.id
    );
    this.setActiveApplication(null);
    this.saveCurrentApplications();
  }

  private ifAlreadySet(application: Application): boolean {
    return !!this.currentApplications.find(
      (currentApplication) => currentApplication.id === application.id
    );
  }

  private saveCurrentApplications(): void {
    localStorage.setItem(
      'currentApplications',
      JSON.stringify(this.currentApplications)
    );
  }

  private loadCurrentApplications(): void {
    const currentApplications = localStorage.getItem('currentApplications');
    if (currentApplications) {
      this.currentApplications = JSON.parse(currentApplications);
    }
  }
}
