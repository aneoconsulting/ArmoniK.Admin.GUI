import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { Key } from '@app/types/config';
import { Sidebar, SidebarItem } from '@app/types/navigation';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { FiltersCacheService } from '@services/filters-cache.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { StorageService } from '@services/storage.service';
import { ClearAllDialogComponent } from './component/clear-all-dialog.component';

@Component({
  selector: 'app-settings-index',
  templateUrl: './index.component.html',
  styles: [`
app-page-section + app-page-section {
  display: block;
  margin-top: 2rem;
}

main {
  display: flex;
  justify-content: space-between;
}

.sidebar-items {
  list-style-type: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-items li {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.add-sidebar-item {
  margin-top: 1rem;
  width: 66%;
}

.storage ul {
  list-style-type: none;
  padding: 0;
  margin: 0;

  display: grid;
  grid-template-columns: min-content min-content min-content;
  column-gap: 0.5rem;
}

.storage li {
  /* do not wrap word */
  white-space: nowrap;
}

.import .file {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.file {
  align-items: center;
}

.actions {
  display: flex;
  gap: 1rem;
}

.between {
  justify-content: space-between;
}

.storage {
  margin-top: 1rem;
}

.import {
  margin-top: 1rem;
}

.navbar {
  margin-bottom: 1rem;
}

.cdk-drag-preview {
  list-style: none;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.cdk-drop-list-dragging li:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
  `],
  providers: [
    QueryParamsService,
    NotificationService,
  ],
  imports: [
    PageHeaderComponent,
    PageSectionComponent,
    PageSectionHeaderComponent,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
  ]
})
export class IndexComponent implements OnInit {
  sharableURL = null;
  fileName: string | undefined;
  keys: Set<Key> = new Set();
  selectedKeys: Set<Key> = new Set();

  readonly dialog = inject(MatDialog);
  private readonly iconsService = inject(IconsService);
  private readonly notificationService = inject(NotificationService);
  readonly navigationService = inject(NavigationService);
  private readonly storageService = inject(StorageService);
  private readonly httpClient = inject(HttpClient);
  readonly filtersCacheService = inject(FiltersCacheService);

  ngOnInit(): void {
    this.keys = this.sortKeys(this.storageService.restoreKeys());
  }

  getIcon(name: string | null): string {
    return this.iconsService.getIcon(name);
  }

  onRestoreSidebar(): void {
    this.navigationService.resetSidebar();
    this.navigationService.edit.set(false);
  }

  onClearSideBar(): void {
    const dialogRef = this.dialog.open<ClearAllDialogComponent>(ClearAllDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearSideBar();
      }
    });
  }

  private clearSideBar(): void {
    this.navigationService.edit.set(true);
    this.navigationService.resetSidebar(true);
    this.navigationService.edit.set(false);
  }

  startEditSideBar() {
    this.navigationService.edit.set(true);
  }

  onSaveSidebar(): void {
    this.navigationService.saveSidebar();
    this.keys = this.sortKeys(this.storageService.restoreKeys());
    this.navigationService.edit.set(false);
  }

  getSidebarItems(): { name: string, value: Sidebar }[] {
    return this.navigationService.sidebarItems.map(item => ({
      name: item.display,
      value: item.id as Sidebar,
    }));
  }

  findSidebarItem(id: Sidebar): SidebarItem {
    const item = this.navigationService.sidebarItems.find(item => item.id === id);

    if (!item) {
      throw new Error(`Sidebar item with id "${id}" not found`);
    }

    return item;
  }

  updateKeySelection(event: MatCheckboxChange): void {
    if (this.selectedKeys.has(event.source.name as Key)) {
      this.selectedKeys.delete(event.source.name as Key);
    } else {
      this.selectedKeys.add(event.source.name as Key);
    }
  }

  onSubmitStorage(event: SubmitEvent): void {
    event.preventDefault();

    for (const key of this.selectedKeys) {
      this.keys.delete(key);
      this.storageService.removeItem(key);
    }

    this.selectedKeys.clear();

    this.notificationService.success('Data cleared');
  }

  clearAll(): void {
    const dialogRef = this.dialog.open<ClearAllDialogComponent>(ClearAllDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearAllKeys();
        this.getServerConfig();
        this.notificationService.success('All data cleared');
      }
    });
  }

  private clearAllKeys(): void {
    for (const key of this.keys) {
      this.keys.delete(key);
      this.storageService.removeItem(key);
    }
  }

  private getServerConfig() {
    this.httpClient.get<string>('/static/gui_configuration').subscribe(data => {
      if (data && Object.keys(data).length !== 0) {
        this.storageService.importData(data as string, false, false);
      }
    });
  }

  exportData(): void {
    const data = JSON.stringify(this.storageService.exportData());

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const id = new Date().getTime();

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${date}-${id}-settings.json`;
    anchor.click();

    this.notificationService.success('Settings exported');
  }

  onSubmitImport(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form) {
      return;
    }

    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;

    if (!fileInput) {
      return;
    }

    const file = fileInput.files?.[0];

    if (!file) {
      this.notificationService.error('No file selected');
      return;
    }

    if(file.type !== 'application/json') {
      this.notificationService.error(`'${file.name}' is not a JSON file`);
      form.reset();
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result as string;
      try {
        this.storageService.importData(data);
        this.keys = this.sortKeys(this.storageService.restoreKeys());
  
        const hasSidebarKey = this.keys.has('navigation-sidebar');
  
        // Update sidebar
        if (hasSidebarKey) {
          this.navigationService.updateSidebar(this.navigationService.restoreSidebar());
        }
  
        this.notificationService.success('Settings imported');
      } catch (e) {
        console.warn(e);
        this.notificationService.error('Settings could not be imported.');
      }

      form.reset();
    };
    reader.readAsText(file);
  }

  private sortKeys(keys: Set<Key>): Set<Key> {
    return new Set([...keys].sort((a, b) => a.localeCompare(b)));
  }

  addConfigFile(event: Event): void {
    this.fileName = (event.target as HTMLInputElement).files?.item(0)?.name;
  }

  clearFilterCache() {
    this.filtersCacheService.clear();
  }
}
