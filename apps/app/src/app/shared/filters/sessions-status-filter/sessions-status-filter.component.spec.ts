import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SessionsStatusFilterComponent } from './sessions-status-filter.component';

describe('SessionsStatusFilterComponent', () => {
  let component: SessionsStatusFilterComponent;
  let fixture: ComponentFixture<SessionsStatusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SessionsStatusFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a name', () => {
    expect(component.name).toBeDefined();
  });

  it('should have an EventEmitter', () => {
    expect(component.changes).toBeDefined();
  });

  it('should have a value equal to 0 when no selection is made', () => {
    expect(component.value).toEqual(0);
  });

  it('should emit an Event when selection change', () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.onSelectionChange();
    expect(testValue).toBeTruthy();
  });

  it('should emit an Event when the filter is cleared', () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.clear();
    expect(testValue).toBeTruthy();
  });

  it('should return its value as a number', () => {
    component.selectedValue = 1;
    expect(component.value).toEqual(1);
  });

  describe('is Active', () => {
    it('should be true when the value is active', () => {
      component.selectedValue = 1;
      expect(component.isActive()).toBeTruthy();
    });

    it('should be false when the value is inactive', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
