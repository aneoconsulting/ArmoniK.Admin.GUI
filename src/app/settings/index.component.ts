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
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { FiltersCacheService } from '@services/filters-cache.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { StorageService } from '@services/storage.service';
import { ClearAllDialogComponent } from './component/clear-all-dialog.component';
import { ThemeSelectorComponent } from './component/theme-selector.component';

@Component({
  selector: 'app-settings-index',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  providers: [
    QueryParamsService,
    NotificationService,
  ],
  imports: [
    PageHeaderComponent,
    PageSectionHeaderComponent,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    ThemeSelectorComponent,
  ],
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

  startEditSideBar() {
    this.navigationService.edit.set(true);
  }

  resetSidebar(): void {
    this.navigationService.resetSidebarToStored();
    this.navigationService.edit.set(false);
  }

  resetToDefaultSideBar(): void {
    const dialogRef = this.dialog.open<ClearAllDialogComponent, void, boolean>(ClearAllDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearSideBar();
      }
    });
  }

  private clearSideBar(): void {
    this.navigationService.edit.set(true);
    this.navigationService.resetSidebarToDefault();
    this.navigationService.edit.set(false);
  }

  onSaveSidebar(): void {
    this.navigationService.saveSidebar();
    this.keys = this.sortKeys(this.storageService.restoreKeys());
    this.navigationService.edit.set(false);
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
    const id = Date.now();

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${date}-${id}-settings.json`;
    anchor.click();

    this.notificationService.success('Settings exported');
  }

  async onSubmitImport(event: SubmitEvent): Promise<void> {
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

    try {
      const fileContent = await file.text();
      this.storageService.importData(fileContent, true, true);
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
