import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableInspectObjectDialogComponent, TableInspectObjectDialogData } from './table-inspect-object-dialog.component';

describe('TableInspectObjectDialogComponent', () => {
  let component: TableInspectObjectDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  const mockData: TableInspectObjectDialogData = {
    label: 'options',
    object: {
      applicationName: 'application',
      applicationVersion: 'version'
    }
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableInspectObjectDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).inject(TableInspectObjectDialogComponent);
    component.ngOnInit();
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should set label', () => {
      expect(component.label).toEqual(mockData.label);
    });

    it('should set object', () => {
      expect(component.object).toEqual(mockData.object);
    });
  });

  it('should close dialog', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});