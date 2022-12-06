import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { first, Subject } from 'rxjs';
import {
  AutoRefreshDropdownComponent,
  DisabledIntervalValue,
} from './auto-refresh-dropdown.component';

describe('AutoRefreshDropdownComponent', () => {
  let component: AutoRefreshDropdownComponent;
  let fixture: ComponentFixture<AutoRefreshDropdownComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AutoRefreshDropdownComponent,
        TranslateModule.forRoot(),
        ClarityModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default refresh rate', () => {
    component.currentInterval$.pipe(first()).subscribe((interval) => {
      expect(interval.value).toBeTruthy();
    });
  });

  it('should have a default refresh rate label', () => {
    component.currentInterval$.pipe(first()).subscribe((interval) => {
      expect(interval.label).toBeTruthy();
    });
  });

  it('should emit an interval value on init', () => {
    component.refreshIntervalChange.subscribe((value) => {
      expect(value).toBeTruthy();
    });

    component.ngOnInit();
    component.ngOnDestroy();
  });

  it('should emit an interval value on interval change', () => {
    const interval = 1000;

    component.refreshIntervalChange.pipe(first()).subscribe((value) => {
      expect(value).toEqual(interval);
    });

    component.onIntervalChange({ value: interval, label: '1s' });
  });

  it('should emit the disabled value on interval stop', () => {
    component.refreshIntervalChange.pipe(first()).subscribe((value) => {
      expect(value).toEqual(DisabledIntervalValue);
    });

    component.onIntervalStop();
  });

  it('should disabled the current interval on manual interval stop', () => {
    const subject = new Subject<void>();
    component.manualStop$ = subject.asObservable();

    component.ngOnInit(); // Subscribe to manualStop$.

    subject.next(); // Emit a value to stop the interval.

    component.currentInterval$.pipe(first()).subscribe((interval) => {
      expect(interval.value).toEqual(DisabledIntervalValue);
    });
  });
});
