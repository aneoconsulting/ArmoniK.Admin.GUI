import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDateFilterComponent } from './session-date-filter.component';

describe('SessionDateFilterComponent', () => {
  let component: SessionDateFilterComponent;
  let fixture: ComponentFixture<SessionDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionDateFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Is active', () => {
    it('should be active when a date is picked', () => {
      component.date = new Date();
      expect(component.isActive()).toBeTruthy();
    });

    it('should be unactive when no date is picked', () => {
      expect(component.isActive()).toBeFalsy();
    });
  });
});
