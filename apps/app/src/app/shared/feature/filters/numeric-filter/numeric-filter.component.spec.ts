import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersEnum } from '@armonik.admin.gui/shared/data-access';

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

  it('should have a null min value', () => {
    expect(component.minValue).toBeNull();
  });

  it('should have a null max value', () => {
    expect(component.maxValue).toBeNull();
  });

  it('should have a NUMERIC filter type', () => {
    expect(component.type).toEqual(FiltersEnum.NUMERIC);
  });

  it('should have a composed property', () => {
    component.name = 'test';
    expect(component.property).toEqual({
      min: 'testMin',
      max: 'testMax',
    });
  });

  it('should emit on change', () => {
    component.changes.emit = jasmine.createSpy();
    component.onChange();
    expect(component.changes.emit).toHaveBeenCalled();
  });

  it('should be active when a max value input is made', () => {
    component.maxValue = 1;
    expect(component.isActive()).toBeTruthy();
  });

  it('should be active when a min value different than 0 input is made', () => {
    component.minValue = 1;
    expect(component.isActive()).toBeTruthy();
  });

  it('should be inactive when a min value equal to 0 is set', () => {
    component.minValue = 0;
    expect(component.isActive()).toBeFalsy();
  });

  it('should be inactive when nothing is set', () => {
    expect(component.isActive()).toBeFalsy();
  });

  it('should nullify all values when clear is called', () => {
    component.minValue = 1;
    component.maxValue = 2;
    component.clear();
    expect(component.minValue).toBeNull();
    expect(component.maxValue).toBeNull();
  });
});
