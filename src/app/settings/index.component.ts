import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-settings-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon aria-hidden="true" [fontIcon]="getIcon('settings')"></mat-icon>
  <span i18n="Page title"> Settings </span>
</app-page-header>

<p i18n="Page description">
  Settings are stored in your browser. They are not synced across devices. But you can export and import them manually. This is useful if you want to use the same settings on multiple devices or browsers. You can also create presets and switch between them.
</p>

<app-page-section class="sidebar">
  <!-- TODO: use in a dialog -->
  <app-page-section-header icon="format_list_bulleted">
    <span i18n="Section title"> Sidebar </span>
  </app-page-section-header>

  <p i18n="Section description">
    Add, remove and reorder, using drap and drop, the items from the sidebar.
  </p>

  <ul class="sidebar-items" cdkDropList (cdkDropListDropped)="drop($event)">
    <li cdkDrag *ngFor="let item of sidebar; let index = index; trackBy:trackBySidebarItem">
      <div class="sidebar-item-drag">
        <mat-icon cdkDragHandle aria-hidden="true" [fontIcon]="findSidebarItem(item).icon ?? 'horizontal_rule'"></mat-icon>
      </div>

      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label i18n="Sidebar item label"> Sidebar item </mat-label>
        <mat-select [value]="item" (valueChange)="onSidebarItemChange(index, $event)">
          <mat-option *ngFor="let sidebarItem of getSidebarItems(); trackBy:trackByItem" [value]="sidebarItem.value">
            {{ sidebarItem.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-icon-button aria-label="More options" mat-tooltip="More options" [matMenuTriggerFor]="menu">
        <mat-icon aria-hidden="true" [fontIcon]="getIcon('more')"></mat-icon>
      </button>

      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="onRemoveSidebarItem(index)">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
          <span i18n>Remove</span>
        </button>
      </mat-menu>
    </li>
  </ul>

  <button class="add-sidebar-item" mat-button (click)="onAddSidebarItem()">
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('add')"></mat-icon>
    <span i18n> Add a status </span>
  </button>

  <div class="actions">
    <button mat-stroked-button (click)="onResetToDefaultSidebar()" type="button" i18n="Form">Reset to default</button>
    <button mat-stroked-button (click)="onResetSidebar()" type="button" i18n="Form">Reset</button>
    <button mat-flat-button (click)="onSaveSidebar()" color="primary" type="button" i18n="Form">Save</button>
  </div>
</app-page-section>

<app-page-section class="storage">
  <app-page-section-header [icon]="getIcon('storage')">
    <span i18n="Section title"> Storage </span>
  </app-page-section-header>

  <p i18n="Section description">
    Delete data stored in your browser by this application. This will reset behavior and settings to their default values.
  </p>

  <form (submit)="onSubmitStorage($event)">

    <ul *ngIf="keys.size; else noKey">
      <li *ngFor="let key of keys; trackBy:trackByKey">
        <mat-checkbox [name]="key">
          {{ key }}
        </mat-checkbox>
      </li>
    </ul>

    <div class="actions">
      <button mat-stroked-button type="reset" i18n="Form" [disabled]="keys.size === 0">Reset</button>
      <button mat-stroked-button type="button" (click)="clearAll()" [disabled]="keys.size === 0">Clear All</button>
      <button mat-flat-button color="warn" type="submit" i18n="Form" [disabled]="keys.size === 0">Clear</button>
    </div>
  </form>
</app-page-section>

<app-page-section class="export">
  <app-page-section-header [icon]="getIcon('download')">
    <span i18n="Section title"> Export your data </span>
  </app-page-section-header>

  <p i18n="Section description">
    Export your settings as a JSON file. This file can be imported later to restore your settings.
  </p>

  <div class="actions">
    <button mat-flat-button color="primary" (click)="exportData()" i18n>Export</button>
  </div>
</app-page-section>

<app-page-section class="import">
  <app-page-section-header [icon]="getIcon('upload')">
    <span i18n="Section title"> Import your data </span>
  </app-page-section-header>

  <p i18n="Section description">
    Import your settings from a JSON file. This will overwrite your current settings.
  </p>

  <form (submit)="onSubmitImport($event)">
    <div class="file">
      <label for="file" i18n="Label input">File</label>
      <input id="file" type="file" accept="application/json" required>
    </div>

    <div class="actions">
      <button mat-stroked-button type="reset" i18n="Form">Reset</button>
      <button mat-flat-button color="primary" type="submit" i18n="Form">Import</button>
    </div>
  </form>
</app-page-section>

<ng-template #noKey>
  <p>
    <em i18n="No key">
      No data stored in your browser.
    </em>
  </p>
</ng-template>
  `,
  styles: [`
app-page-section + app-page-section {
  display: block;
  margin-top: 2rem;
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

.actions {
  margin-top: 1rem;

  display: flex;
  flex-direction: row;
  gap: 1rem;
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
  standalone: true,
  providers: [
    ShareUrlService,
    QueryParamsService,
    NotificationService,
  ],
  imports: [
    NgFor,
    NgIf,
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
    DragDropModule,
  ]
})
export class IndexComponent implements OnInit {
  sharableURL = '';
  keys: Set<Key> = new Set();

  sidebar: Sidebar[] = [];

  #iconsService = inject(IconsService);
  #shareURLService = inject(ShareUrlService);
  #notificationService = inject(NotificationService);
  #navigationService = inject(NavigationService);
  #storageService = inject(StorageService);

  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);

    this.keys = this.#sortKeys(this.#storageService.restoreKeys());
    this.sidebar = this.#navigationService.restoreSidebar();
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  onResetSidebar(): void {
    this.sidebar = this.#navigationService.restoreSidebar();
  }

  onResetToDefaultSidebar(): void {
    this.sidebar = Array.from(this.#navigationService.defaultSidebar);
  }

  onSaveSidebar(): void {
    this.#navigationService.saveSidebar(this.sidebar);
    this.keys = this.#sortKeys(this.#storageService.restoreKeys());
  }

  onRemoveSidebarItem(index: number): void {
    this.sidebar.splice(index, 1);
  }

  onAddSidebarItem(): void {
    this.sidebar.push('dashboard');
  }

  getSidebarItems(): { name: string, value: Sidebar }[] {
    return this.#navigationService.sidebarItems.map(item => ({
      name: item.display,
      value: item.id as Sidebar,
    }));
  }

  findSidebarItem(id: Sidebar): SidebarItem {
    const item = this.#navigationService.sidebarItems.find(item => item.id === id);

    if (!item) {
      throw new Error(`Sidebar item with id "${id}" not found`);
    }

    return item;
  }

  onSidebarItemChange(index: number, value: Sidebar): void {
    this.sidebar[index] = value;
  }


  onSubmitStorage(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form) {
      return;
    }

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    const checkboxesArray = Array.from(checkboxes) as HTMLInputElement[];
    const keys: Key[] = [];

    for (const checkbox of checkboxesArray) {
      if (checkbox.checked) {
        keys.push(checkbox.name as Key);
      }
    }

    for (const key of keys) {
      this.keys.delete(key);
      this.#storageService.removeItem(key);
    }

    this.#notificationService.success('Data cleared');
  }

  clearAll(): void {
    for (const key of this.keys) {
      this.keys.delete(key);
      this.#storageService.removeItem(key);
    }

    this.#notificationService.success('All data cleared');
  }

  exportData(): void {
    const data = JSON.stringify(this.#storageService.exportData());

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const id = new Date().getTime();

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${date}-${id}-settings.json`;
    anchor.click();

    this.#notificationService.success('Settings exported');
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
      this.#notificationService.error('No file selected');
      return;
    }

    if( file.type !== 'application/json' ) {
      this.#notificationService.error(`'${file.name}' is not a JSON file`);
      form.reset();
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result as string;
      this.#storageService.importData(data);
      this.keys = this.#sortKeys(this.#storageService.restoreKeys());

      const hasSidebarKey = this.keys.has('navigation-sidebar');

      // Update sidebar
      if (hasSidebarKey) {
        this.sidebar = this.#navigationService.restoreSidebar();
        this.#navigationService.updateSidebar(this.sidebar);
      }


      this.#notificationService.success('Settings imported');

      form.reset();
    };

    reader.readAsText(file);
  }

  trackByKey(_: number, key: string): string {
    return key;
  }

  trackBySidebarItem(index: number, item: Sidebar): string {
    if (item === 'divider') return 'divider' + index;

    return item;
  }

  trackByItem(index: number, item: { name: string, value: Sidebar }): string {
    if (item.value === 'divider') return 'divider' + index;

    return item.value;
  }

  drop(event: CdkDragDrop<SidebarItem[]>) {
    moveItemInArray(this.sidebar, event.previousIndex, event.currentIndex);
  }

  #sortKeys(keys: Set<Key>): Set<Key> {
    return new Set([...keys].sort());
  }
}
