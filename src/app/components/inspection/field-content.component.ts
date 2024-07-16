import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { TaskOptions } from '@app/tasks/types';
import { ColumnType, Field } from '@app/types/column.type';
import {  Custom, DataRaw, RawColumnKey, Status } from '@app/types/data';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { InspectionComponent } from './inspection.component';

@Component({
  selector: 'app-field-content',
  templateUrl: 'field-content.component.html',
  standalone: true,
  imports: [
    MatChipsModule,
    DatePipe,
    DurationPipe,
    EmptyCellPipe,
    JsonPipe,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    InspectionComponent,
    MatTooltipModule
  ],
  providers: [
    NotificationService,
    IconsService
  ],
  styles: [`
    .field {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    p {
      margin: 0;
    }

    mat-chip {
      display: flex;
      align-items: center;
    }

    mat-icon {
      cursor: pointer;
    }
  `]
})
export class FieldContentComponent<K extends RawColumnKey, D extends DataRaw, S extends Status> {
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);
  private readonly iconsService = inject(IconsService);

  readonly viewIcon = this.iconsService.getIcon('view');
  readonly copyIcon = this.iconsService.getIcon('copy');

  @Input({ required: true }) set field(entry: Field<K>) {
    this.prettyKey = this.pretty(entry.key as string);
    this._field = entry;
  }

  @Input({ required: true }) set data(entry: D | null) {
    if (entry) {
      switch (this.field.type) {
      case 'status': {
        this._value = this.statuses[entry[this.field.key as unknown as keyof D] as S];
        break;
      }
      case 'date': {
        const date = new Timestamp(entry[this.field.key as unknown as keyof D] as Partial<Timestamp>);
        this._value = date.toDate();
        break;
      }
      default: {
        this._value = entry[this.field.key as unknown as keyof D];
      }
      }
    }
  }

  @Input({ required: false }) statuses: Record<S, string>;

  type: ColumnType | undefined;
  prettyKey: string;
  private _field: Field<K>;
  private _value: unknown;

  get field(): Field<K> {
    return this._field;
  }

  /**
   * Can be a string, number, status label, or Duration
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

  get object(): TaskOptions | Custom {
    return this._value as TaskOptions | Custom;
  }

  pretty(key: string): string {
    return key.toString().replaceAll('_', '').replace(/(?<!^)([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
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

  private clipboardCopy(value: string) {
    this.clipboard.copy(value);
    this.notificationService.success('Value copied');
  }
}