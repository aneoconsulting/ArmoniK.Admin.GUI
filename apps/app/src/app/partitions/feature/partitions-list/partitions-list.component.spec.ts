import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartitionsListComponent } from './partitions-list.component';

describe('PartitionsListComponent', () => {
  let component: PartitionsListComponent;
  let fixture: ComponentFixture<PartitionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartitionsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartitionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
