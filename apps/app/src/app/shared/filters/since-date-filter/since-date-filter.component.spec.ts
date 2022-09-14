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

  describe('input', () => {
    it('should have a label', () => {
      const label = component.label;
      expect(label).toBeDefined();
    });

    it('should have a default text', () => {
      const defaultText = component.defaultText;
      expect(defaultText).toBeDefined();
    });

    it('should have a text', () => {
      const text = component.text;
      expect(text).toBeDefined();
    });

    it('should have a name', () => {
      const name = component.name;
      expect(name).toBeDefined();
    });
  });

  it('should return the name with "property"', () => {
    component.name = 'test';
    expect(component.property).toBe(component.name);
  });

  it('should always return true for accepts', () => {
    expect(component.accepts()).toBeTruthy();
  });

  describe('isActive', () => {
    it('should return false when is not active', () => {
      component.selectedValue = null;
      expect(component.isActive()).toBeFalsy();
    });

    it('should return true when is active', () => {
      component.selectedValue = 'test';
      expect(component.isActive()).toBeTruthy();
    });
  });

  it('should get date', () => {
    const date = component.getDate(new Date());
    expect(date).toBeDefined();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should change the selected value', () => {
    component.onChange({ target: { value: 'test' } });
    expect(component.selectedValue).toBe('test');
  });

  it('should return the selectedValue with "value"', () => {
    component.selectedValue = null;
    expect(component.value).toBe(null);
    component.selectedValue = 'test';
    expect(component.value).toBe('test');
  });

  it('should emit an event when the value changes', () => {
    const changes = { emit: jasmine.createSpy('changes') };
    component.changes = changes as unknown as EventEmitter<boolean>;
    component.onChange({ target: { value: 'test' } });
    expect(changes.emit).toHaveBeenCalled();
  });

  describe('date since', () => {
    it('should create a new date if params is not defined', () => {
      const date = component.createDateSince();
      expect(date).toBeDefined();
    });

    it('should create a new date removing the number of days from now', () => {
      const daysFromNow = 7;
      const date = component.createDateSince(daysFromNow);
      expect(date.getUTCDate()).toBe(
        new Date(Date.now() - daysFromNow * 24 * 60 * 60 * 1000).getUTCDate()
      );
    });
  });

  describe('ui', () => {
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
        component.sinceDays.length + 1 // +1 for the default option
      );
    });
  });
});
