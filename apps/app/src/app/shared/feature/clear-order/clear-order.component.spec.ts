import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ClearOrderComponent } from './clear-order.component';

describe('ClearOrderComponent', () => {
  let component: ClearOrderComponent;
  let fixture: ComponentFixture<ClearOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when clearOrder is called', () => {
    component.clearOrderEvent.emit = jasmine.createSpy();
    component.clearOrder();
    expect(component.clearOrderEvent.emit).toHaveBeenCalled();
  });
});
