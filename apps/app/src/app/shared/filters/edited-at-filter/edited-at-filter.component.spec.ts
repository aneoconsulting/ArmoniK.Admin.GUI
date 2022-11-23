import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { EditedAtFilterComponent } from './edited-at-filter.component';

describe('CreatedAtFilterComponent', () => {
  let component: EditedAtFilterComponent;
  let fixture: ComponentFixture<EditedAtFilterComponent>;
  let dateTest: Date;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditedAtFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditedAtFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dateTest = new Date();
    dateTest.setDate(16000000);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send a date when a `before` selection is made', () => {
    const subjectBeforeSpy = { next: jasmine.createSpy('changed') };
    component.changes = subjectBeforeSpy as unknown as Subject<{
      property: string;
      value: string;
    }>;
    component.sendBeforeDate();
    component.beforeDate = dateTest;
    component.sendBeforeDate();
    expect(subjectBeforeSpy.next).toHaveBeenCalledTimes(2);
  });

  it('should send a date when a `before` selection is made', () => {
    const subjectAfterSpy = { next: jasmine.createSpy('changed') };
    component.changes = subjectAfterSpy as unknown as Subject<{
      property: string;
      value: string;
    }>;
    component.sendAfterDate();
    component.afterDate = dateTest;
    component.sendAfterDate();
    expect(subjectAfterSpy.next).toHaveBeenCalledTimes(2);
  });

  describe('Is Active', () => {
    it('should be active when a "before date" is picked', () => {
      component.beforeDate = dateTest;
      expect(component.isActive()).toBeTruthy();
    });

    it('should be active when a "after date" is picked', () => {
      component.afterDate = dateTest;
      expect(component.isActive()).toBeTruthy();
    });

    it('should not be active if no date is picked', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
