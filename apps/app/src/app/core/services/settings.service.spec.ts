import { HttpParams } from '@angular/common/http';
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

  it('should get current applications from local storage', () => {
    const currentApplications: Set<Application['_id']> = new Set([
      {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    ]);

    localStorage.setItem(
      'currentApplications',
      JSON.stringify(currentApplications)
    );

    const service = new SettingsService();

    expect(service.currentApplications).toEqual(currentApplications);
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
    const application1: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    const application2: Application = {
      _id: {
        applicationName: 'test',
        applicationVersion: '1.0.0',
      },
    };
    service.addCurrentApplication(application1);
    service.addCurrentApplication(application2);
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

  it('should generate seq url', () => {
    const path = service.generateSeqUrl({
      applicationName: 'test',
    });
    expect(path).toEqual('/seq/#/events?applicationName=test');
  });

  it('should generate seq url for errors', () => {
    const path = service.generateSeqUrlForTaskError('1');

    expect(path).toEqual(
      '/seq/#/events?' +
        new HttpParams({
          fromObject: {
            filter: `taskId = '1' && @Level = 'Error'`,
          },
        }).toString()
    );
  });
});
