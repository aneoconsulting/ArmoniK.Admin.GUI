import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';

type Data = {
  [key: string]: string | string[] | Data;
};

@Component({
  selector: 'app-show-card-content',
  templateUrl: './show-card-content.component.html',
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
  imports: [
    DurationPipe,
    DatePipe,
    EmptyCellPipe,
  ],
  standalone: true
})
export class ShowCardContentComponent<T extends object> implements OnChanges {
  @Input({ required: true }) set data(entry: T | T[] | null) {
    this._data = entry as Data;
  }
  @Input({ required: true }) statuses: Record<number, string> = [];

  keys: string[] = [];
  private _data: Data;

  get data(): Data {
    return this._data;
  }

  ngOnChanges() {
    if (this.data) {
      this.keys = Object.keys(this.data).sort((a, b) => a.toString().localeCompare(b.toString()));
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
    return key.replaceAll('_', '').replace(/(?<!^)([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  isString(key: string): boolean {
    return typeof this.data[key] === 'string';
  }

  isNumber(key: string): boolean {
    return typeof this.data[key] === 'number';
  }

  isStatus(key: string): boolean {
    return key.toLowerCase().includes('status');
  }

  isArray(value: unknown): boolean {
    return Array.isArray(value);
  }

  isTimestamp(key: string): boolean {
    return this.data[key] instanceof Timestamp;
  }

  hasLength(value: unknown): boolean {
    return value != undefined && (value as unknown[]).length > 0;
  }

  toArray(value: unknown): unknown[] {
    return value as unknown[];
  }

  isObject(key: string): boolean {
    return typeof this.data[key] === 'object' && !this.isArray(this.data[key]) && !this.isDuration(key) && !this.isTimestamp(key);
  }

  isDuration(key: string): boolean {
    const duration = this.data[key] as unknown as Duration;
    return !Number.isNaN(duration?.nanos) && !!duration?.seconds;
  }

  toDate(key: string): Date | undefined {
    if (this.data) {
      const timestamp = this.data[key] as unknown as Timestamp;
      return timestamp.toDate();
    }
    return undefined;
  }

  toDuration(key: string) {
    return this.data[key] as unknown as Duration ?? null;
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

    const value = this.data[key];

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

    const value = this.data[key];

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

    const value = this.data[key] as unknown as Duration;

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

    const value = new Timestamp(this.data[key] as Data);

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
  statusToLabel(key: string) {
    if (this.data && this.statuses) {
      const label = this.statuses[Number(this.data[key])];
      if (label) {
        return label;
      }
    }
    return null;
  }
}
