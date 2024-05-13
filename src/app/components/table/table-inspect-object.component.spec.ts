import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { IconsService } from '@services/icons.service';
import { TableInspectObjectDialogComponent } from './table-inspect-object-dialog.component';
import { TableInspectObjectComponent } from './table-inspect-object.component';

describe('TableInspectObjectComponent', () => {
  let component: TableInspectObjectComponent;

  const mockMatDialog = {
    open: jest.fn()
  };

  const label = 'label';
  const object = {
    key: 'value'
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableInspectObjectComponent,
        IconsService,
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).inject(TableInspectObjectComponent);
    component.label = label;
    component.object = object;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should view object', () => {
    component.onViewObject();
    expect(mockMatDialog.open).toHaveBeenCalledWith(TableInspectObjectDialogComponent, {
      data: {
        label,
        object
      }
    });
  });

  describe('is object defined', () => {
    it('should check if an object is undefined', () => {
      component.object = undefined;
      expect(component.isObjectDefined).toBeFalsy();
    });

    it('should know if an object is not empty', () => {
      component.object = {};
      expect(component.isObjectDefined).toBeFalsy();
    });
  });
});