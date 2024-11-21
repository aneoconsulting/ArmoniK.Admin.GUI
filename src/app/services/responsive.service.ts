import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { combineLatestWith, map, Subscription } from 'rxjs';

@Injectable()
export class ResponsiveService implements OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly subscription = new Subscription();

  private readonly _isHandset = signal(false);
  private readonly _isTablet = signal(false);
  private readonly _isNotDesktop = signal(false);

  get isHandset() {
    return this._isHandset();
  }

  get isTablet() {
    return this._isTablet();
  }

  get isNotDesktop() {
    return this._isNotDesktop();
  }

  constructor() {
    this.initResponsiveCheck();
  }

  private initResponsiveCheck() {
    this.subscription.add(this.initHandsetCheck());
    this.subscription.add(this.initTabletCheck());
    this.subscription.add(this.initNotDesktopCheck());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initHandsetCheck() {
    return this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(handset => handset.matches),
      ).subscribe((data) => {
        this._isHandset.set(data);
      });
  }

  private initTabletCheck() {
    return this.breakpointObserver.observe(Breakpoints.Tablet)
      .pipe(
        map(tablet => tablet.matches),
      ).subscribe((data) => {
        this._isTablet.set(data);
      });
  }

  private initNotDesktopCheck() {
    return this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        combineLatestWith(this.breakpointObserver.observe(Breakpoints.Tablet)),
        map(([handset, tablet]) => handset.matches || tablet.matches),
      ).subscribe((data) => {
        this._isNotDesktop.set(data);
      });
  }
}