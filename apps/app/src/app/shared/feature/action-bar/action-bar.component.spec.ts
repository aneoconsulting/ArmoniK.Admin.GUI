import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;
  let fixture: ComponentFixture<ActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on manualRefresh', () => {
    component.refresh.emit = jasmine.createSpy();
    component.manualRefresh();
    expect(component.refresh).toHaveBeenCalled();
  });

  it('should emit on onUpdateInterval', () => {
    component.updateInterval.emit = jasmine.createSpy();
    component.onUpdateInterval(0);
    expect(component.updateInterval).toHaveBeenCalled();
  });

  it('should emit on clearOrder', () => {
    component.clearSort.emit = jasmine.createSpy();
    component.clearOrder();
    expect(component.clearSort).toHaveBeenCalled();
  });

  it('should emit on clearAllFilters', () => {
    component.clearFilters.emit = jasmine.createSpy();
    component.clearAllFilters();
    expect(component.clearFilters).toHaveBeenCalled();
  });
});
