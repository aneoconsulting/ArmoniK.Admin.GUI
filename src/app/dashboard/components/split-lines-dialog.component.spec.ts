import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SplitLinesDialogComponent } from './split-lines-dialog.component';

describe('SplitLinesDialogComponent', () => {
  let component: SplitLinesDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SplitLinesDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          columns: 10  
        } }
      ]
    }).inject(SplitLinesDialogComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.columns).toBeTruthy();
  });

  it('should update columns if there is a value', () => {
    const event = {
      target: {
        value: '1'
      }
    } as unknown as Event;
    component.updateColumns(event);
    expect(component.columns).toEqual(1);
  });

  it('should not update columns if there is no value', () => {
    const event = {
      target: {
        value: undefined
      }
    } as unknown as Event;
    component.updateColumns(event);
    expect(component.columns).toEqual(10);
  });

  it('should close on click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});