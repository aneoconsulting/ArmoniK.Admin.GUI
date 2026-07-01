import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { SidebarItem } from '@app/types/navigation';
import { NavigationService } from '@services/navigation.service';
import { AddSideBarItemDialogComponent } from './add-sidebar-item.dialog.component';

describe('AddSideBarItemDialogComponent', () => {
  let component: AddSideBarItemDialogComponent;

  const navigationCurrentSidebar: SidebarItem[] = [
    {
      id: 'applications',
      type: 'link',
      display: 'Applications',
      route: '/applications'
    },
    {
      type: 'divider',
      id: 'divider',
      display: $localize`Divider`,
      route: null,
    },
    {
      id: 'partitions',
      type: 'link',
      display: 'Partitions',
      route: '/partitions'
    }
  ];
  const navigationStoredSidebar: SidebarItem[] = [
    ...navigationCurrentSidebar,
    {
      id: 'sessions',
      type: 'link',
      display: 'Sessions',
      route: '/sessions'
    }
  ];
  const mockNavigationService = {
    sidebarItems: navigationStoredSidebar,
    currentSidebar: navigationCurrentSidebar,
  };

  const dialogRef = {
    close: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AddSideBarItemDialogComponent,
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: MatDialogRef, useValue: dialogRef },
      ]
    }).inject(AddSideBarItemDialogComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => { 
    it('should set the available sidebar items (items not currently in the sidebar and a divider)', () => {
      expect(component.availableSidebars).toEqual(['sessions', 'divider']);
    });

    describe('With all elements currently in the sidebar', () => {
      beforeEach(() => {
        mockNavigationService.currentSidebar = navigationStoredSidebar;
        component.ngOnInit();
      });

      it('should contains a divider inside the available sidebar', () => {
        expect(component.availableSidebars).toEqual(['divider']);
      });

      it('should set the selectedItem as the divider', () => {
        expect(component.selectedItem).toEqual('divider');
      });
    });
  });

  it('should update the selected item', () => {
    component.selectedItem = 'applications';
    component.updateSelectedItem('sessions');
    expect(component.selectedItem).toEqual('sessions');
  });

  it('should close the dialog with its data', () => {
    component.submit();
    expect(dialogRef.close).toHaveBeenCalledWith({
      item: component.selectedItem,
    });
  });

  it('should close the dialog without any data', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});