import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ExternalService } from '@app/types/external-service';
import { IconsService } from '@services/icons.service';
import { ManageExternalServicesDialogComponent } from './manage-external-services-dialog.component';

describe('ManageExternalServicesDialogComponent', () => {
  let component: ManageExternalServicesDialogComponent;

  let dialogRefSubject: BehaviorSubject<ExternalService | null>;
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRefSubject;
        }
      };
    })
  };
  const externalService = {
    name: 'service',
    url: 'url',
    icon: 'main'
  };
  const mockMatDialogData = {
    externalServices: [externalService]
  };
  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ManageExternalServicesDialogComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        IconsService
      ]
    }).inject(ManageExternalServicesDialogComponent);
    component.externalServices = [externalService];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(component.externalServices).toEqual([
      externalService
    ]);
  });

  it('should get icon', () => {
    expect(component.getIcon('edit')).toEqual('edit');
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should add an external service', () => {
    dialogRefSubject = new BehaviorSubject<ExternalService | null>({
      name: 'service2',
      url: 'someUrl',
      icon: 'secondary'
    });
    component.addExternalService();
    expect(component.externalServices[1]).toEqual({
      name: 'service2',
      url: 'someUrl',
      icon: 'secondary'
    });
  });

  it('should edit the external services', () => {
    dialogRefSubject = new BehaviorSubject<ExternalService | null>({
      name: 'service',
      url: 'newUrl',
      icon: 'main'
    });

    component.editExternalService(externalService);
    expect(externalService).toEqual({
      name: 'service',
      url: 'newUrl',
      icon: 'main'
    });
  });

  it('should delete external services', () => {
    component.deleteExternalService(externalService);
    expect(component.externalServices).toEqual([]);
  });

  it('should close on no click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should edit item list on drop', () => {
    component.externalServices = [
      {
        name: 'service1',
        url: 'url',
        icon: 'main'
      },
      {
        name: 'service2',
        url: 'url',
        icon: 'secondary'
      },
      {
        name: 'service3',
        url: 'url',
        icon: 'Third'
      }
    ];
    const event = {
      previousIndex: 0,
      currentIndex: 2
    } as unknown as CdkDragDrop<string[]>;
    
    component.onDrop(event);

    expect(component.externalServices).toEqual([
      {
        name: 'service2',
        url: 'url',
        icon: 'secondary'
      },
      {
        name: 'service3',
        url: 'url',
        icon: 'Third'
      },
      {
        name: 'service1',
        url: 'url',
        icon: 'main'
      }
    ]);
  });

  it('should track by service', () => {
    expect(component.trackByService(0, externalService)).toEqual('servicenewUrl');
  });
});