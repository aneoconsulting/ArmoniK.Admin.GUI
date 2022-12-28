import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';

import { ComboBoxFilterComponent } from './combobox-filter.component';

describe('TaskStatusFilterComponent', () => {
  let component: ComboBoxFilterComponent;
  let fixture: ComponentFixture<ComboBoxFilterComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClarityModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboBoxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined property selectionList', () => {
    expect(component.selectionList).toBeDefined();
  });

  it('should have a property "name"', () => {
    expect(component.name).toBeDefined();
  });

  it('should return the name with "property"', () => {
    component.name = 'test';
    expect(component.property).toEqual(component.name);
  });

  it('should emit an event when the selection change', () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.onSelectionChange();
    expect(testValue).toBeTruthy();
  });

  it('should return the selection with "value"', () => {
    expect(component.value).toEqual([]);
    component.selectedValues?.push(5);
    expect(component.value).toContain(5);
  });

  it('should accept all', () => {
    expect(component.accepts()).toBeTruthy();
  });

  describe('isActive', () => {
    it('should return true if the value is active', () => {
      component.selectedValues?.push(5);
      expect(component.isActive()).toBeTruthy();
    });

    it('should return false if the value is not active', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
