import { TestBed } from '@angular/core/testing';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  afterEach(() => {
    localStorage.removeItem('currentApplications');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contains currentApplications', () => {
    expect(service.currentApplications).toBeTruthy();
  });

  it('should contains empty currentApplications', () => {
    expect(service.currentApplications.size).toEqual(0);
  });

  it('should add application to currentApplications', () => {
    const application: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application);
    expect(service.currentApplications.size).toEqual(1);
  });

  it('should not be able to add an application twice', () => {
    const application: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application);
    service.addCurrentApplication(application);
    expect(service.currentApplications.size).toEqual(1);
  });

  it('should be able to add 2 different applications', () => {
    const application1: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    const application2: Application = {
      _id: {
        applicationName: 'test2',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application1);
    service.addCurrentApplication(application2);
    expect(service.currentApplications.size).toEqual(2);
  });

  it('should not throw error when remove non existing application', () => {
    const application: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    service.removeCurrentApplication(application._id);
    expect(service.currentApplications.size).toEqual(0);
  });

  it('should remove application from currentApplications', () => {
    const application: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application);

    service.removeCurrentApplication(application._id);
    expect(service.currentApplications.size).toEqual(0);
  });

  it('should remove the correct application from currentApplications', () => {
    const application1: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    const application2: Application = {
      _id: {
        applicationName: 'test2',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application1);
    service.addCurrentApplication(application2);

    service.removeCurrentApplication(application1._id);
    expect(service.currentApplications.size).toEqual(1);
    expect(service.currentApplications.has(application1._id)).toBeFalsy();
  });

  it('should store currentApplications in localStorage', () => {
    const application: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application);
    expect(localStorage.getItem('currentApplications')).toEqual(
      JSON.stringify([application._id])
    );
  });
});
