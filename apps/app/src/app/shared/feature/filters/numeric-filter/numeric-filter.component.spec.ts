import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericFilterComponent } from './numeric-filter.component';

describe('NumericFilterComponent', () => {
  let component: NumericFilterComponent;
  let fixture: ComponentFixture<NumericFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(NumericFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a name', () => {
    expect(component.name).toBeDefined();
  });

  it('should have a property equal to its name', () => {
    component.name = 'test';
    expect(component.name).toEqual(component.property);
  });

  it('should have a null selected value', () => {
    expect(component.selectedValue).toBeNull();
  });

  it('should emit on change', () => {
    component.changes.emit = jasmine.createSpy();
    component.onChange();
    expect(component.changes.emit).toHaveBeenCalled();
  });

  it('should be active when a, input is made', () => {
    component.selectedValue = 1;
    expect(component.isActive()).toBeTruthy();
  });

  it('should be inactive when a value equal to 0 is set', () => {
    component.selectedValue = 0;
    expect(component.isActive()).toBeFalsy();
  });

  it('should be inactive when nothing is set', () => {
    expect(component.isActive()).toBeFalsy();
  });

  it('should nullify all values when clear is called', () => {
    component.selectedValue = 1;
    component.clear();
    expect(component.selectedValue).toBeNull();
  });
});
