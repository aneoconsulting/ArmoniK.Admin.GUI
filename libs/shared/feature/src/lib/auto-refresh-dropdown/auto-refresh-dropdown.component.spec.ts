import { ComponentFixture, TestBed } from '@angular/core/testing';
import { first } from 'rxjs';
import {
  AutoRefreshDropdownComponent,
  DisabledIntervalValue,
} from './auto-refresh-dropdown.component';

describe('AutoRefreshDropdownComponent', () => {
  let component: AutoRefreshDropdownComponent;
  let fixture: ComponentFixture<AutoRefreshDropdownComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
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
    expect(component.interval.value).toBeTruthy();
  });

  it('should have a default refresh rate label', () => {
    expect(component.interval.label).toBeTruthy();
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
});
