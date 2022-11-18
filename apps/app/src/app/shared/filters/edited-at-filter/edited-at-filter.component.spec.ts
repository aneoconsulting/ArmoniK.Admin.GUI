import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedAtFilterComponent } from './edited-at-filter.component';

describe('CreatedAtFilterComponent', () => {
  let component: EditedAtFilterComponent;
  let fixture: ComponentFixture<EditedAtFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditedAtFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditedAtFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
