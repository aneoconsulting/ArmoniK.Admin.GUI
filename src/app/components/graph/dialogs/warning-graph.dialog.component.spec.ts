import { TestBed } from '@angular/core/testing';
import { WarningGraphDialogComponent } from './warning-graph.dialog.component';

describe('WarningGraphDialogComponent', () => {
  let component: WarningGraphDialogComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        WarningGraphDialogComponent
      ]
    }).inject(WarningGraphDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});