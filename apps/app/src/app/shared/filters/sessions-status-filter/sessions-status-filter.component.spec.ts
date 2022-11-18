import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsStatusFilterComponent } from './sessions-status-filter.component';

describe('SessionsStatusFilterComponent', () => {
  let component: SessionsStatusFilterComponent;
  let fixture: ComponentFixture<SessionsStatusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
