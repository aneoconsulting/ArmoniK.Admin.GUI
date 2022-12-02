import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TaskStatusFilterComponent } from './task-status-filter.component';

describe('TaskStatusFilterComponent', () => {
  let component: TaskStatusFilterComponent;
  let fixture: ComponentFixture<TaskStatusFilterComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TaskStatusFilterComponent],
      imports: [TranslateModule.forRoot(), ClarityModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a property "name"', () => {
    expect(component.name).toBeDefined();
  });

  it('should return the name with "property"', () => {
    component.name = 'test';
    expect(component.property).toEqual(component.name);
  });

  it('should emit an event when the selection change', () => {
    const changes = { emit: jasmine.createSpy('changes') };
    component.changes = changes as unknown as EventEmitter<never>;
    component.onSelectionChange();
    expect(changes.emit).toHaveBeenCalled();
  });

  it('should return the selection with "value"', () => {
    expect(component.value).toEqual(0);
    component.selectedValue = 5;
    expect(component.value).toEqual(5);
  });

  it('should accept all', () => {
    expect(component.accepts()).toBeTruthy();
  });

  describe('isActive', () => {
    it('should return true if the value is active', () => {
      component.selectedValue = 5;
      expect(component.isActive()).toBeTruthy();
    });

    it('should return false if the value is not active', () => {
      component.selectedValue = 0;
      expect(component.isActive()).toBeFalsy();
    });
  });
});
