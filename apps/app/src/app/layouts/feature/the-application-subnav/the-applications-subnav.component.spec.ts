import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '../../../core';
import { ApplicationsSubnavComponent } from './applications-subnav.component';

describe('ApplicationsSubnavComponent', () => {
  let component: ApplicationsSubnavComponent;
  let fixture: ComponentFixture<ApplicationsSubnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsSubnavComponent],
      providers: [SettingsService],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsSubnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
