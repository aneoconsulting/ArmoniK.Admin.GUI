import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '../core';
import { PagesComponent } from './pages.component';

const WindowMock = {
  location: { reload: jasmine.createSpy('reload') },
} as unknown as Window & typeof globalThis;

describe('PagesComponent', () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PagesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
      ],
      providers: [{ provide: Window, useValue: WindowMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should update date every minute', fakeAsync(() => {
      const initialNow = component.now;
      component.ngOnInit();
      tick(2000 * 60);
      discardPeriodicTasks();
      expect(component.now).toBeGreaterThan(initialNow);
    }));
  });

  describe('track by', () => {
    it('should return label for navigation link', () => {
      const label = 'Dashboard';
      const link = { path: ['/', 'dashboard'], label };
      expect(component.trackByLabel(0, link)).toBe(label);
    });

    it('should return application name and version for application', () => {
      const applicationId = {
        applicationName: 'Test',
        applicationVersion: '1.0.0',
      } as Application['_id'];
      expect(component.trackByApplicationId(0, applicationId)).toBe(
        `${applicationId.applicationName}${applicationId.applicationVersion}`
      );
    });
  });

  describe('removeApplication', () => {
    it('should remove application', () => {
      const application = {
        applicationName: 'Test',
        applicationVersion: '1.0.0',
      } as Application['_id'];

      const settingsService = TestBed.inject(SettingsService);
      spyOn(settingsService, 'removeCurrentApplication');

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      component.removeApplication(application);

      expect(settingsService.removeCurrentApplication).toHaveBeenCalledWith(
        application
      );
      expect(router.navigate).toHaveBeenCalledWith(['/', 'dashboard']);
    });
  });
});
