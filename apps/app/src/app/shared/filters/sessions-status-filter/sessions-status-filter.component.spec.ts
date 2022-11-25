import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

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

  it('should have a name', () => {
    expect(component.name).toBeDefined();
  });

  it('should emit a value when selection change', () => {
    component.changes.emit = jasmine.createSpy();
    component.onSelectionChange();
    expect(component.changes.emit).toHaveBeenCalled();
  });

  it('should return its value as a number', () => {
    component.selectedValue = 1;
    expect(component.value).toEqual(1);
  });

  describe('is Active', () => {
    it('should be true when the value is active', () => {
      component.selectedValue = 1;
      expect(component.isActive()).toBeTruthy();
    });

    it('should be false when the value is inactive', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
