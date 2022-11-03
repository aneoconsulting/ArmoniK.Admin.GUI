import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesService, SettingsService } from '../core';
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
        UiModule,
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

  describe('track by', () => {
    it('should return label for navigation link', () => {
      const label = 'Dashboard';
      const link = { path: ['/', 'dashboard'], label, queryParams: {} };
      expect(component.trackByLabel(0, link)).toBe(label);
    });
  });
});
