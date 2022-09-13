import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatus } from '@armonik.admin.gui/armonik-typing';
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
    component.changes = changes as unknown as EventEmitter<boolean>;
    component.onSelectionChange(['test']);
    expect(changes.emit).toHaveBeenCalled();
  });

  it('should change the selection', () => {
    component.onSelectionChange(['test']);
    expect(component.selection).toEqual(['test']);
  });

  it('should return the selection with "value"', () => {
    expect(component.value).toEqual([]);
    component.selection = ['test'];
    expect(component.value).toEqual(['test']);
  });

  it('should accept all', () => {
    expect(component.accepts()).toBeTruthy();
  });

  describe('isActive', () => {
    it('should return true if the value is active', () => {
      component.selection = ['test'];
      expect(component.isActive()).toBeTruthy();
    });

    it('should return false if the value is not active', () => {
      component.selection = [];
      expect(component.isActive()).toBeFalsy();
    });
  });
});
