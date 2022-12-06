import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesService, LanguageService, SettingsService } from '../core';
import { HistoryService } from '../core/services/history.service';
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
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ClarityModule,
      ],
      providers: [
        SettingsService,
        FavoritesService,
        HistoryService,
        { provide: Window, useValue: WindowMock },
        { provide: Storage, useValue: localStorage },
      ],
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

  describe('external services links', () => {
    it('should render if SEQ is up', () => {
      const settingsService = TestBed.inject(SettingsService);

      settingsService.seqSubject$.next(true);
      // Refresh component
      fixture.detectChanges();

      // Get anchor to seq using nativeElement
      const anchor = fixture.nativeElement.querySelector('a[href="/seq/"]');

      expect(anchor).toBeTruthy();
    });

    it('should render if Grafana is up', () => {
      const settingsService = TestBed.inject(SettingsService);

      settingsService.grafanaSubject$.next(true);
      // Refresh component
      fixture.detectChanges();

      // Get anchor to seq using nativeElement
      const anchor = fixture.nativeElement.querySelector('a[href="/grafana/"]');

      expect(anchor).toBeTruthy();
    });

    it('should not render if SEQ is down', () => {
      const settingsService = TestBed.inject(SettingsService);

      settingsService.seqSubject$.next(false);
      // Refresh component
      fixture.detectChanges();

      // Get anchor to seq using nativeElement
      const anchor = fixture.nativeElement.querySelector('a[href="/seq/"]');

      expect(anchor).toBeFalsy();
    });

    it('should not render if Grafana is down', () => {
      const settingsService = TestBed.inject(SettingsService);

      settingsService.grafanaSubject$.next(false);
      // Refresh component
      fixture.detectChanges();

      // Get anchor to seq using nativeElement
      const anchor = fixture.nativeElement.querySelector('a[href="/grafana/"]');

      expect(anchor).toBeFalsy();
    });
  });

  describe('track by', () => {
    it('should return label for navigation link', () => {
      const label = 'Dashboard';
      const link = { path: ['/', 'dashboard'], label, shape: 'Home' };
      expect(component.trackByLabel(0, link)).toBe(label);
    });
  });
});
