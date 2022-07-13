import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationsService,
  PagerService,
  SettingsService,
} from '../../../core';
import {
  ApplicationCardComponent,
  ApplicationsErrorsListComponent,
} from './components';
import { AlertErrorComponent, SinceDateFilterComponent } from '../../../shared';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        ApplicationCardComponent,
        ApplicationsErrorsListComponent,
        AlertErrorComponent,
        SinceDateFilterComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        HttpClientModule,
        ClarityModule,
        UiModule,
      ],
      providers: [ApplicationsService, PagerService, SettingsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contains a h1', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1')).toBeTruthy();
  });

  it('should contains a section after h1', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1 + section')).toBeTruthy();
  });

  it('should contains 2 h2', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('h2').length).toBe(2);
  });

  it('should contains a div with class "clr-row" after the first h2', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2 + div.clr-row')).toBeTruthy();
  });

  it('should contains "app-pages-dashboard-application-card" in a tag with class "clr-row" after first h2', () => {
    component.applications = [
      {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
      },
    ];
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.clr-row').textContent).toContain(
      'application_1'
    );
  });

  it('should contains a app-alert-error after the second h2', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2 + app-alert-error')).toBeTruthy();
  });

  it('should contains a app-pages-dashboard-applications-errors-list after the app-alert-error', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector(
        'app-alert-error + app-pages-dashboard-applications-errors-list'
      )
    ).toBeTruthy();
  });
});
