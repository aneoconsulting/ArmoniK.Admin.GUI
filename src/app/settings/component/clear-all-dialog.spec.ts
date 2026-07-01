import { TestBed } from '@angular/core/testing';
import { ClearAllDialogComponent } from './clear-all-dialog.component';

describe('ClearAllDialogComponent', () => {
  let component: ClearAllDialogComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ClearAllDialogComponent
      ]
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});