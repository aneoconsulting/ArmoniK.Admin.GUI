import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;
  let dateTest: Date;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DateFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dateTest = new Date();
    dateTest.setDate(16000000);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined name property', () => {
    expect(component.name).toBeDefined();
  });

  it('should have null dates on initialisation', () => {
    expect(component.beforeDate).toBeNull();
    expect(component.afterDate).toBeNull();
  });

  it('should send an object null values when no dates are picked', () => {
    expect(component.value).toEqual({ before: null, after: null });
  });

  it('should send an object with afterDate null when only beforeDate is picked', () => {
    component.beforeDate = dateTest;
    expect(component.value).toEqual({
      before: dateTest.getTime(),
      after: null,
    });
  });

  it('should send an object with beforeDate null when only afterDate is picked', () => {
    component.afterDate = dateTest;
    expect(component.value).toEqual({
      before: null,
      after: dateTest.getTime(),
    });
  });

  it('should emit when a selection is made', () => {
    let testValue = false;
    component.changes.subscribe(() => {
      testValue = true;
    });
    component.onDateChange();
    expect(testValue).toBeTruthy();
  });

  it('should emit when the filter is cleared', () => {
    let testValue = false;
    component.changes.subscribe(() => {
      testValue = true;
    });
    component.clear();
    expect(testValue).toBeTruthy();
  });

  it('should return an null object with value when the filter is cleared', () => {
    component.afterDate = dateTest;
    component.clear();
    expect(component.value).toEqual({ before: null, after: null });
  });

  describe('Is Active', () => {
    it('should be active when a "before date" is picked', () => {
      component.beforeDate = dateTest;
      expect(component.isActive()).toBeTruthy();
    });

    it('should be active when a "after date" is picked', () => {
      component.afterDate = dateTest;
      expect(component.isActive()).toBeTruthy();
    });

    it('should be active when "before" and "after" dates are picked', () => {
      component.beforeDate = dateTest;
      component.afterDate = dateTest;
      expect(component.isActive()).toBeTruthy();
    });

    it('should not be active if no date is picked', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
