import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdFilterComponent } from './id-filter.component';

describe('IdFilterComponent', () => {
  let component: IdFilterComponent;
  let fixture: ComponentFixture<IdFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdFilterComponent],
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

  it('should have a observable', () => {
    expect(component.inputChange$).toBeDefined();
  });

  it('should have a value', () => {
    component.inputValue = 'test';
    expect(component.value).toEqual('test');
  });

  it('should send true on changed', () => {
    component.inputChangeSubject.next = jasmine.createSpy();
    component.inputValue = 'test';
    component.onChange();
    expect(component.inputChangeSubject.next).toHaveBeenCalled();
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
