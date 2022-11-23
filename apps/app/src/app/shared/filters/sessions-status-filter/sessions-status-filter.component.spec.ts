import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { SessionsStatusFilterComponent } from './sessions-status-filter.component';

describe('SessionsStatusFilterComponent', () => {
  let component: SessionsStatusFilterComponent;
  let fixture: ComponentFixture<SessionsStatusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SessionsStatusFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the selection', () => {
    component.onSelectionChange(['testValue']);
    expect(component.selection).toEqual(['testValue']);
  });

  it('should have a subjectSelection property', () => {
    expect(component.changes).toBeDefined();
  });

  it('should send a value to the subject when selection change', () => {
    const subjectSelectionSpy = { next: jasmine.createSpy('changed') };
    component.changes = subjectSelectionSpy as unknown as Subject<string[]>;
    component.onSelectionChange(['testValue']);
    expect(subjectSelectionSpy.next).toHaveBeenCalled();
  });

  it('should send the selection when the selection change', () => {
    let returnedValue: string[] = [];
    component.changes.subscribe((value) => {
      returnedValue = value;
    });
    component.onSelectionChange(['testValue']);
    expect(returnedValue).toEqual(['testValue']);
  });

  describe('is Active', () => {
    it('should be true when the value is active', () => {
      component.selection = ['testValue'];
      expect(component.isActive()).toBeTruthy();
    });

    it('should be false when the valye is inactive', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
