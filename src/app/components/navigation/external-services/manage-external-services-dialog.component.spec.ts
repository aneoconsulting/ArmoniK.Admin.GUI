import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExternalService } from '@app/types/external-service';
import { IconsService } from '@services/icons.service';
import { BehaviorSubject } from 'rxjs';
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

  it('should select an external service to edit', () => {
    component.editExternalService(externalService);
    expect(component.editedService).toBe(externalService);
  });

  it('should edit the external services', () => {
    component.editExternalService(externalService);
    const newService = {
      name: 'service',
      url: 'newUrl',
      icon: 'main'
    };
    const index = component.externalServices.indexOf(externalService);
    component.onEditExternalService(newService);
    expect(component.externalServices[index]).toEqual(newService);
  });

  it('should delete external services', () => {
    component.deleteExternalService(externalService);
    expect(component.externalServices).toEqual([]);
  });

  it('should close on no click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should add a service', () => {
    const service: ExternalService = { name: 'new', url: 'https://new', icon: undefined };
    component.onNewService(service);
    expect(component.externalServices).toContain(service);
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
});