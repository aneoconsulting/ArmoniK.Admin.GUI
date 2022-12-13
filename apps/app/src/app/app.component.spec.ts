// import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { AppComponent } from './app.component';
import { GrafanaService, SeqService, SettingsService } from './shared/util';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [SeqService, GrafanaService, SettingsService],
      imports: [
        RouterTestingModule.withRoutes([]),
        ClarityModule,
        HttpClientModule,
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
