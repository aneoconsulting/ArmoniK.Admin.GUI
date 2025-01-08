import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { PrettyPipe } from '@pipes/pretty.pipe';

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
    PrettyPipe,
  ],
  standalone: true
})
export class ShowCardContentComponent<T extends object> {
  @Input({ required: true }) set data(entry: T | T[] | null) {
    this._data = entry as Data;
    if (entry) {
      this.keys = Object.keys(this.data).sort((a, b) => a.toString().localeCompare(b.toString()));
    }
  }

  keys: (keyof Data)[] = [];
  private _data: Data;

  get data(): Data {
    return this._data;
  }

  isString(key: keyof Data): boolean {
    return typeof this.data[key] === 'string';
  }

  isNumber(key: keyof Data): boolean {
    return typeof this.data[key] === 'number';
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
}
