import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFilterComponent } from './select-filter.component';

describe('SelectFilterComponent', () => {
  let component: SelectFilterComponent;
  let fixture: ComponentFixture<SelectFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a name propery', () => {
    expect(component.name).toBeDefined();
  });

  it('should have a value property', () => {
    expect(component.value).toEqual(0);
  });

  it('should have an EventEmitter', () => {
    expect(component.changes).toBeDefined();
  });

  it('should have a defined selectionList', () => {
    expect(component.selectionList).toBeDefined();
  });

  it('should emit an event when the selection change', () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.onSelectionChange();
    expect(testValue).toBeTruthy();
  });

  it('should emit an event when the selection is cleared', () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.clear();
    expect(testValue).toBeTruthy();
  });

  it('should have a value equal to zero when the selection is cleared', () => {
    component.selectedValue = 4;
    component.clear();
    expect(component.selectedValue).toEqual(0);
  });

  describe('is active', () => {
    it('should be false when no selection is made', () => {
      expect(component.isActive()).toBeFalsy();
    });

    it('should be true when a selection is made', () => {
      component.selectedValue = 1;
      expect(component.isActive()).toBeTruthy();
    });
  });
});
