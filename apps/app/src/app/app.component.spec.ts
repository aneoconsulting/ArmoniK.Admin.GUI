// import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { HistoryService, SettingsService } from './shared/util';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        SettingsService,
        HistoryService,
        {
          provide: Storage,
          useValue: {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null,
            clear: () => null,
          },
        },
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ClarityModule,
        HttpClientModule,
        TranslateModule.forRoot(),
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
