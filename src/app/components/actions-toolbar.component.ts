import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-actions-toolbar',
  templateUrl: 'actions-toolbar.component.html',
  styleUrl: 'actions-toolbar.component.css',
  standalone: true,
  providers: [],
  imports: []
})
export class ActionsToolbarComponent implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly subscriptions = new Subscription();
  private readonly _isHandset = signal(false);

  get isHandset() {
    return this._isHandset();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.setIsHandSet());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setIsHandSet() {
    return this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
      ).subscribe((data) => {
        this._isHandset.set(data);
      });
  }
}
