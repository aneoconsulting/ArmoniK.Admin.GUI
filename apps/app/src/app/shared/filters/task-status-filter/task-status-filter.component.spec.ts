import { HttpClientModule } from '@angular/common/http';
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
    expect(component.property).toBe(component.name);
  });

  it('should emit an event when the value changes', () => {
    const changes = { emit: jasmine.createSpy('changes') };
    component.changes = changes as unknown as EventEmitter<boolean>;
    component.onChange({ target: { value: 'test' } });
    expect(changes.emit).toHaveBeenCalled();
  });

  it('should change the selected value', () => {
    component.onChange({ target: { value: TaskStatus.CANCELLED } });
    expect(component.selectedValue).toBe(TaskStatus.CANCELLED);
  });

  it('should change the value', () => {
    component.onChange({ target: { value: TaskStatus.CANCELLED } });
    expect(component.value).toBe(TaskStatus.CANCELLED);
  });

  it('should have a clr-select-container', () => {
    expect(
      fixture.nativeElement.querySelector('clr-select-container')
    ).toBeTruthy();
  });

  it('should have a label and a select element', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('label')).toBeTruthy();
    expect(compiled.querySelector('select')).toBeTruthy();
  });

  it('should display a list of options', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('option').length).toBe(
      Object.keys(TaskStatus).filter((x) => parseInt(x) >= 0).length + 1 // +1 for "All"
    );
  });
});
