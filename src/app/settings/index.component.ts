import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-settings-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon aria-hidden="true" fontIcon="settings"></mat-icon>
  <span i18n="Page title"> Settings </span>
</app-page-header>

<p i18n="Page description">
  Settings are stored in your browser. They are not synced across devices. But you can export and import them manually. This is useful if you want to use the same settings on multiple devices or browsers. You can also create presets and switch between them.
</p>

<app-page-section class="storage">
  <app-page-section-header icon="storage">
    <span i18n="Section title"> Storage </span>
  </app-page-section-header>

  <p i18n="Section description">
    Delete data stored in your browser by this application. This will reset behavior and settings to their default values.
  </p>

  <form (submit)="onSubmitStorage($event)">
    <ul *ngIf="keys.size">
      <li *ngFor="let key of keys; trackBy:trackByKey">
        <mat-checkbox [name]="key">
          {{ key }}
        </mat-checkbox>
      </li>
    </ul>

    <div class="actions">
      <button mat-stroked-button type="reset" i18n="Form">Reset</button>
      <button mat-flat-button color="warn" type="submit" i18n="Form">Clear</button>
    </div>
  </form>
</app-page-section>

<app-page-section class="export">
  <app-page-section-header icon="file_download">
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
  <app-page-section-header icon="file_upload">
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
  `,
  styles: [`
app-page-section + app-page-section {
  display: block;
  margin-top: 2rem;
}

.storage ul {
  list-style-type: none;
  padding: 0;
  margin: 0;

  display: grid;
  grid-template-columns: min-content min-content min-content;
  column-gap: 0.5rem;
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
  `],
  standalone: true,
  providers: [
    StorageService,
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
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class IndexComponent implements OnInit {
  sharableURL = '';
  keys: Set<string>;

  #shareURLService = inject(ShareUrlService);
  #notificationService = inject(NotificationService);

  constructor(
    private _storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
    this.keys = this.#sortKeys(this._storageService.keys);
  }

  onSubmitStorage(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form) {
      return;
    }

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    const checkboxesArray = Array.from(checkboxes) as HTMLInputElement[];
    const keys = [];

    for (const checkbox of checkboxesArray) {
      if (checkbox.checked) {
        keys.push(checkbox.name);
      }
    }

    for (const key of keys) {
      this.keys.delete(key);
      this._storageService.removeItem(key);
    }
  }

  exportData(): void {
    const data = this._storageService.exportData();

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
      this._storageService.importData(data);
      this.keys = this.#sortKeys(this._storageService.keys);

      this.#notificationService.success('Settings imported');

      form.reset();
    };

    reader.readAsText(file);
  }

  trackByKey(index: number, key: string): string {
    return key;
  }

  #sortKeys(keys: Set<string>): Set<string> {
    const keysArray = Array.from(keys);
    const sortedKeys = keysArray.sort();

    return new Set(sortedKeys);
  }
}
