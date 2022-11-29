import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IdFilterComponent } from './id-filter.component';

describe('IdFilterComponent', () => {
  let component: IdFilterComponent;
  let fixture: ComponentFixture<IdFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdFilterComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a name', () => {
    expect(component.name).toBeDefined();
  });

  it('should have a subject', () => {
    expect(component.inputChangeSubject).toBeDefined();
  });

  it('should have a subscription', () => {
    expect(component.inputChange).toBeDefined();
  });

  it('should have a value', () => {
    component.inputValue = 'test';
    expect(component.value).toEqual('test');
  });

  it('should send the input value on change', () => {
    let testValue = '';
    component.inputChange = component.inputChangeSubject.subscribe(
      (value) => (testValue = value)
    );
    component.inputValue = 'test';
    component.onChange();
    expect(testValue).toEqual(component.inputValue);
  });

  it('should emit an event on change', async () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.onChange();
    await setTimeout(() => {
      expect(testValue).toBeTruthy();
    }, 1000); // wait for the debounceTime
  });

  it('should have a empty inputValue when the filter is cleared', () => {
    component.inputValue = 'Not empty value';
    component.clear();
    expect(component.inputValue).toEqual('');
  });

  it('should emit an event when the filter is cleared', () => {
    let testValue = false;
    component.changes.subscribe(() => (testValue = true));
    component.clear();
    expect(testValue).toBeTruthy();
  });

  describe('Is Active', () => {
    it('should be true when a selection is made', () => {
      component.inputValue = 'test';
      expect(component.isActive()).toBeTruthy();
    });

    it('should be unactive when there is no selection', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
