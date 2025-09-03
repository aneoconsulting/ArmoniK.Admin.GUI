import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Sidebar } from '@app/types/navigation';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { NavigationService } from '@services/navigation.service';
import { AddSideBarItemDialogResult } from './types';

@Component({
  selector: 'app-add-sidebar-item-dialog',
  templateUrl: 'add-sidebar-item.dialog.component.html',
  styleUrl: 'add-sidebar-item.dialog.component.css',
  imports: [
    MatDialogModule,
    AutoCompleteComponent,
    MatButtonModule,
  ]
})
export class AddSideBarItemDialogComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);

  availableSidebars: Sidebar[] = [];
  selectedItem: Sidebar;
  
  constructor(private readonly dialogRef: MatDialogRef<AddSideBarItemDialogComponent, AddSideBarItemDialogResult>) {}

  ngOnInit(): void {
    this.availableSidebars = this.navigationService.sidebarItems
      .filter(sidebar => !this.navigationService.currentSidebar.includes(sidebar))
      .map(sidebar => sidebar.id);
    
    if (!this.availableSidebars.includes('divider')) {
      this.availableSidebars.push('divider');
    }
  }

  updateSelectedItem(item: string) {
    this.selectedItem = item as Sidebar;
  }

  submit() {
    this.dialogRef.close({
      item: this.selectedItem,
    });
  }

  close() {
    this.dialogRef.close();
  }
}