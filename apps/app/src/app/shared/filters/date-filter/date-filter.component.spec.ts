import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DateFilterComponent } from './date-filter.component';

describe('CreatedAtFilterComponent', () => {
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

  it('should have null dates', () => {
    expect(component.beforeDate).toBeNull();
    expect(component.afterDate).toBeNull();
  });

  it('should send a stringified object', () => {
    component.afterDate = dateTest;
    expect(component.value).toEqual(
      JSON.stringify({ before: null, after: dateTest.getTime() })
    );
  });

  it('should send a date when a selection is made', () => {
    component.changes.emit = jasmine.createSpy();
    component.onDateChange();
    expect(component.changes.emit).toHaveBeenCalled();
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

    it('should not be active if no date is picked', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
