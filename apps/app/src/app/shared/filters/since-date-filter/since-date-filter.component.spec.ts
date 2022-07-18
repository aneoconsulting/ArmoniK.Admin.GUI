import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SinceDateFilterComponent } from './since-date-filter.component';

describe('SinceDateFilterComponent', () => {
  let component: SinceDateFilterComponent;
  let fixture: ComponentFixture<SinceDateFilterComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SinceDateFilterComponent],
      imports: [TranslateModule.forRoot(), ClarityModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinceDateFilterComponent);
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
    component.onChange({ target: { value: 'test' } });
    expect(component.selectedValue).toBe('test');
  });

  it('should change the value', () => {
    component.onChange({ target: { value: 'test' } });
    expect(component.value).toBe('test');
  });

  it('should have a clr-select-container', () => {
    expect(
      fixture.nativeElement.querySelector('clr-select-container')
    ).toBeTruthy();
  });

  it('should have a label and a select element', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('label')).toBeTruthy();
  });

  it('should display a list of options', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('select')).toBeTruthy();
  });
});
