import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
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
section {
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

section > * {
  margin-bottom: 1rem;
}

article {
  grid-column: 1 / 4;
  display: flex;
  flex-direction: column;
}

app-show-card-content {
  border-left: 1px solid #eee;
  padding-left: 1rem;
  margin-left: 1rem;
}

p {
  width: fit-content;
}

.no-data {
  grid-column: 1 / 4;
  width: 100%;
  text-align: center;
}

.array-list {
  margin: 0;
}

.key {
  font-weight: bold;
}
  `],
  imports: [
    DurationPipe,
    DatePipe,
    EmptyCellPipe,
    MatChipsModule,
  ],
  standalone: true
})
export class ShowCardContentComponent<T extends object> {
  @Input({ required: true }) set data(entry: T | T[] | null) {
    if (entry) {
      this._data = entry as Data;
      if (this._keys.length === 0) {
        this.setDefaultKeys();
      }
    }
  }
  @Input({ required: true }) statuses: Record<number, string> = [];

  @Input({ required: false }) set keys(entries: (keyof Data)[]) {
    if (entries.length !== 0) {
      this._keys = entries;
    }
  }

  private _keys: (keyof Data)[] = [];
  private _data: Data = {};

  get data(): Data {
    return this._data;
  }

  get keys(): (keyof Data)[] {
    return this._keys;
  }

  setDefaultKeys() {
    this._keys = Object.keys(this.data).sort((a, b) => a.toString().localeCompare(b.toString()));
  }

  /**
   * Changes the syntax of a camelCase string by removing "_", place a
   * space between each UpperCase character, and put this character in lowercase,
   * and turn the first character to an uppercase character
   * @param key string to format
   * @returns formatted string
   */
  pretty(key: keyof Data): string {
    return key.toString().replaceAll('_', '').replace(/(?<!^)([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  isString(key: keyof Data): boolean {
    return typeof this.data[key] === 'string';
  }

  isNumber(key: keyof Data): boolean {
    return typeof this.data[key] === 'number';
  }

  isStatus(key: keyof Data): boolean {
    return key.toString().toLowerCase().includes('status');
  }

  isArray(value: unknown): boolean {
    return Array.isArray(value);
  }

  isTimestamp(key: keyof Data): boolean {
    return this.data[key] instanceof Timestamp;
  }

  hasLength(value: unknown): boolean {
    return (value as unknown[])?.length > 0;
  }

  toArray(value: unknown): unknown[] {
    return value as unknown[];
  }

  isObject(key: keyof Data): boolean {
    return typeof this.data[key] === 'object' && !this.isArray(this.data[key]) && !this.isDuration(key) && !this.isTimestamp(key);
  }

  isDuration(key: keyof Data): boolean {
    const duration = this.data[key] as unknown as Duration;
    return !Number.isNaN(duration?.nanos) && !!duration?.seconds;
  }

  toDate(key: keyof Data): Date | undefined {
    if (this.data) {
      const timestamp = this.data[key] as unknown as Timestamp;
      if (timestamp) {
        return timestamp.toDate();
      }
    }
    return undefined;
  }

  toDuration(key: keyof Data) {
    if (this.data?.[key]) {
      return new Duration(this.data[key] as Partial<Duration.AsObject>);
    }
    return null;
  }

  /**
   * Search for an array in the component JSON data.
   * @param key the key of the JSON data you are looking for.
   * @returns the array, or an empty array if not found.
   */
  findArray(key: keyof Data): string[] {
    if (this.data) {
      const value = this.data[key];
      if (value !== null && value !== undefined) {
        return value as string[];
      }
    }
    return [];
  }

  /**
   * Search for a object in the component JSON data.
   * @param key the key of the JSON data you are looking for.
   * @returns the object, or an empty object if not found.
   */
  findObject(key: keyof Data): Data {
    if (this.data) {
      const value = this.data[key];
      if (value !== null && value !== undefined) {
        return value as Data;
      }
    }
    return {};
  }

  /**
   * Returns the label associated to a status.
   * @param key the key of the status
   * @returns the label if found, "-" if not
   */
  statusToLabel(key: keyof Data) {
    if (this.data && this.statuses) {
      const label = this.statuses[Number(this.data[key])];
      if (label) {
        return label;
      }
    }
    return null;
  }
}
