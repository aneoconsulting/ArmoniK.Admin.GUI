import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Sidebar } from '@app/types/navigation';
import { NavigationService } from '@services/navigation.service';
import { AddSideBarItemDialogResult } from './types';

@Component({
  selector: 'app-add-sidebar-item-dialog',
  templateUrl: 'add-sidebar-item.dialog.component.html',
  imports: [
    DialogModule,
  ]
})
export class AddSideBarItemDialogComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);

  availableSidebars: Sidebar[] = [];
  
  constructor(private readonly dialogRef: MatDialogRef<AddSideBarItemDialogComponent, AddSideBarItemDialogResult>) {}

  ngOnInit(): void {
    this.availableSidebars = this.navigationService.sidebarItems
      .filter(sidebar => !this.navigationService.currentSidebar.includes(sidebar))
      .map(sidebar => sidebar.id);
  }
}