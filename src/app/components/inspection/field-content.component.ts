import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TaskOptions } from '@app/tasks/types';
import { ColumnType, Field } from '@app/types/column.type';
import { DataRaw } from '@app/types/data';
import { Status } from '@app/types/status';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-field-content',
  templateUrl: 'field-content.component.html',
  imports: [
    MatChipsModule,
    DatePipe,
    DurationPipe,
    EmptyCellPipe,
    JsonPipe,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    PrettyPipe,
  ],
  providers: [
    NotificationService,
    IconsService
  ],
  styleUrl: '../../../inspections.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldContentComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null> {
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);
  private readonly iconsService = inject(IconsService);

  type: ColumnType | undefined;
  private _field: Field<T> | Field<O>;
  private _value: unknown;

  readonly viewIcon = this.iconsService.getIcon('view');
  readonly copyIcon = this.iconsService.getIcon('copy');

  @Input({ required: true }) set field(entry: Field<T> | Field<O>) {
    this._field = entry;
    if (entry.type) {
      this.type = entry.type;
    } else {
      this.type = this.guessType(entry.key);
    }
  }

  @Input({ required: true }) set data(entry: T  | NonNullable<O> | null) {
    if (entry) {
      switch (this.type) {
      case 'status': {
        this._value = this.statuses[entry[this.field.key as keyof (T |O)] as S];
        break;
      }
      case 'date': {
        const value = entry[this.field.key as keyof (T |O)] as Partial<Timestamp> | undefined;
        if (value) {
          const date = new Timestamp(value);
          this._value = date.toDate();
        } else {
          this._value = undefined;
        }
        break;
      }
      default: {
        this._value = entry[this.field.key as keyof (T |O)];
        this.checkIfArray();
      }
      }
    }
  }

  @Input({ required: false }) statuses: Record<S, string>;

  get key(): string {
    return this._field.key.toString();
  }

  get field(): Field<T> | Field<O> {
    return this._field;
  }

  /**
   * Can be a string, number, status label
   */
  get value(): string {
    return this._value as string;
  }

  get duration(): Duration {
    return this._value as Duration;
  }

  get date(): Date {
    return this._value as Date;
  }

  get object(): object {
    return this._value as object;
  }

  get array(): Array<string> {
    return this._value as Array<string>;
  }

  /**
   * When the type is not provided by the `field` object, for display purpose, the component has to find the correct type. 
   * @param value  - key of the field.
   * @returns The guessed type of the field.
   */
  private guessType(value: keyof T | keyof O): ColumnType {
    const key = value.toString().toLowerCase().replace('_', '');
    if (key.endsWith('at')) {
      return 'date';
    } else if (key.includes('duration') || key.includes('ttl')) {
      return 'duration';
    } else if (key === 'options' || key === 'options.options' || key === 'output') {
      return 'object';
    } else {
      return 'raw';
    }
  }

  /**
   * Check if the received data is an Array.
   * If `true`, then the type is set to `array`.
   * If `false`, the provided type does not change.
   */
  private checkIfArray() {
    if (this._value instanceof Array) {
      this.type = 'array';
    }
  }

  copy() {
    switch (this.field.type) {
    case 'date': {
      this.clipboardCopy(this.date.toLocaleString());
      break;
    }
    case 'duration': {
      const durationPipe = new DurationPipe();
      const durationString = durationPipe.transform(this.duration);
      if (durationString) {
        this.clipboardCopy(durationString);
      }
      break;
    }
    default: {
      this.clipboardCopy(this.value);
    }
    }
  }

  clipboardCopy(value: string) {
    this.clipboard.copy(value);
    this.notificationService.success('Value copied');
  }
}