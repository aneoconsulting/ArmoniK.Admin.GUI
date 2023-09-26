import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';

type Data = {
  [key: string]: string | string[] | Data;
};

@Component({
  selector: 'app-show-card-content',
  template: `
<ng-container *ngIf="!isArray(data) && keys.length > 0">
  <div *ngFor="let key of keys; trackBy:trackByKey">

    <p>
      <!-- Key -->
      <span class="key">{{ pretty(key) }}</span>

      <span>: </span>

      <!-- String -->
      <span *ngIf="isString(findValue(key))">{{ findValue(key) }}</span>

      <!-- Number -->
      <span *ngIf="isNumber(findValue(key)) && !isStatus(key)">{{ findValue(key) }}</span>

      <!-- Status -->
      <span *ngIf="isStatus(key)">{{ statusToLabel(key) }}</span>

      <!-- Timestamp -->
      <span *ngIf="isTimestamp(findValue(key))">{{ toTimestamp(key) }}</span>

      <!-- Duration -->
      <span *ngIf="isDuration(findValue(key))">{{ toTime(key) }}</span>

      <!-- Is null or undefined -->
      <span *ngIf="findValue(key) === null || findValue(key) === undefined">-</span>
    </p>

    <!-- Array -->
    <ul *ngIf="isArray(findValue(key))">
      <li *ngFor="let item of findArray(key); trackBy:trackByItem">{{ item }}</li>
    </ul>

    <!-- Object -->
    <app-show-card-content *ngIf="isObject(findValue(key))" [data]="findObject(key)" [statuses]="statuses"></app-show-card-content>

  </div>
</ng-container>
<ng-container *ngIf="data && isArray(data) && hasLength(data)">
  <ul class="array-list">
    <li *ngFor="let item of toArray(data); trackBy:trackByItem">{{ item }}</li>
  </ul>
</ng-container>

<ng-container *ngIf="(!isArray(data) && keys.length === 0) || (isArray(data) && !hasLength(data))">
  <p>
    <em>No data</em>
  </p>
</ng-container>
  `,
  styles: [`
app-show-card-content {
  display: block;
  margin-left: 1rem;

  border-left: 1px solid #eee;
  padding-left: 1rem;
}

.array-list {
  margin: 0;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    NgFor,
    NgIf,
  ]
})
export class ShowCardContentComponent<T extends object> implements OnChanges {
  @Input({ required: true }) data: T | T[] | null = null;
  @Input({ required: true }) statuses: Record<number, string> = [];

  keys: string[] = [];

  ngOnChanges() {
    if (this.data) {
      this.keys = Object.keys(this.data).sort();
    }
  }

  /**
   * Changes the syntax of a camelCase string by removing "_", place a
   * space between each UpperCase character, and put this character in lowercase,
   * and turn the first character to an uppercase character
   * @param key string to format
   * @returns formatted string
   */
  pretty(key: string): string {
    return key.replaceAll('_', '').replace(/(?<!^)([A-Z])/g, ' $1'.toLowerCase()).replace(/^./, (str) => str.toUpperCase());
  }

  isString(value: unknown): boolean {
    return typeof value === 'string';
  }

  isNumber(value: unknown): boolean {
    return typeof value === 'number';
  }

  isStatus(key: string): boolean {
    return key.toLowerCase().includes('status');
  }

  isArray(value: unknown): boolean {
    return Array.isArray(value);
  }

  hasLength(value: unknown): boolean {
    return value != undefined && (value as unknown as unknown[]).length > 0;
  }

  toArray(value: unknown): unknown[] {
    return value as unknown as unknown[];
  }

  isObject(value: unknown): boolean {
    return typeof value === 'object' && !this.isArray(value) && !this.isDuration(value) && !this.isTimestamp(value);
  }

  isDuration(value: unknown): boolean {
    return value instanceof Duration;
  }

  isTimestamp(value: unknown): boolean {
    return value instanceof Timestamp;
  }

  /**
   * Search for a string in the component JSON data.
   * @param key the key of the JSON data you are looking for.
   * @returns the string, or "-" if not found.
   */
  findValue(key: string) {
    if (!this.data) {
      return '-';
    }

    const value = (this.data as unknown as Data)[key];

    if (value === null || value === undefined) {
      return '-';
    }

    return value;
  }

  /**
   * Search for an array in the component JSON data.
   * @param key the key of the JSON data you are looking for.
   * @returns the array, or an empty array if not found.
   */
  findArray(key: string): string[] {
    if (!this.data) {
      return [];
    }

    const value = (this.data as unknown as Data)[key];

    if (value === null || value === undefined) {
      return [];
    }

    return value as string[];
  }

  /**
   * Search for a object in the component JSON data.
   * @param key the key of the JSON data you are looking for.
   * @returns the object, or an empty object if not found.
   */
  findObject(key: string): Data {
    if (!this.data) {
      return {};
    }

    const value = (this.data as unknown as Data)[key];

    if (value === null || value === undefined) {
      return {};
    }

    return value as Data;
  }

  /**
   * Turns a stored JSON data into a string of Time.
   * The JSON data is of type Duration.
   * @param key the key of the JSON time you are looking for.
   * @returns "seconds+s nanos+s" if found, "-" if not. 
   */
  toTime(key: string): string {
    if (!this.data) {
      return '-';
    }

    const value = (this.data as unknown as Data)[key] as unknown as Duration;

    if (!value || value.seconds === undefined || value.nanos === undefined 
    || (value.seconds === '0' && value.nanos === 0)) {
      return '-';
    }

    return `${value.seconds}s ${value.nanos}ns`;
  }

  /**
   * Turns a stored JSON data into a TimeStamp.
   * The JSON data is of type Duration.
   * @param key the key of the JSON time you are looking for.
   * @returns a Date if found, "-" if not.
   */
  toTimestamp(key: string): string | Date {
    if (!this.data) {
      return '-';
    }

    const value = new Timestamp((this.data as unknown as Data)[key] as Data);

    if (value.seconds === undefined || value.nanos === undefined 
    || (value.seconds === '0' && value.nanos === 0)) {
      return '-';
    }

    return value.toDate();
  }

  /**
   * Returns the label associated to a status.
   * @param key the key of the status
   * @returns the label if found, "-" if not
   */
  statusToLabel(key: string): string {
    if (!this.data || !this.statuses) {
      return '-';
    }

    const status = Number((this.data as unknown as Data)[key]);

    return this.statuses[status] ? this.statuses[status] : '-';
  }

  /**
   * Used for a for-loop angular element.
   */
  trackByKey(index: number, key: string): string {
    return key;
  }

  /**
   * Used for a for-loop angular element.
   */
  trackByItem(index: number, item: unknown): string {
    return String(item);
  }
}
