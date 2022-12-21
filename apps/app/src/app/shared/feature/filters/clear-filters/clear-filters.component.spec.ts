import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { ClearFiltersComponent } from './clear-filters.component';

describe('ClearFiltersComponent', () => {
  let component: ClearFiltersComponent;
  let fixture: ComponentFixture<ClearFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when clearFilters is called', () => {
    component.clearFiltersSubject = new Subject();
    component.clearFiltersSubject.next = jasmine.createSpy();
    component.clearFilters();
    expect(component.clearFiltersSubject.next).toHaveBeenCalled();
  });
});
