import { AsyncPipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TaskStatus } from '@armonik.admin.gui/shared/data-access';
import { Subject, map, tap } from 'rxjs';

type StatusItem = {
  className: string;
  group: number;
  name: string;
  value: number;
};

@Component({
  standalone: true,
  selector: 'app-tasks-by-status',
  templateUrl: './tasks-by-status.component.html',
  styleUrls: ['./tasks-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, AsyncPipe, PercentPipe],
})
export class TasksByStatusComponent {
  @Input() data: { status: number; count: number }[] | null;

  private _statusMap = new Map<number, StatusItem>([
    [
      TaskStatus.TASK_STATUS_UNSPECIFIED,
      {
        className: 'unspecified',
        group: 1,
        name: $localize`Unspecified`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_CREATING,
      {
        className: 'creating',
        group: 2,
        name: $localize`Creating`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_SUBMITTED,
      {
        className: 'submitted',
        group: 2,
        name: $localize`Submitted`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_DISPATCHED,
      {
        className: 'dispatched',
        group: 2,
        name: $localize`Dispatched`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_PROCESSING,
      {
        className: 'processing',
        group: 3,
        name: $localize`Processing`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_PROCESSED,
      {
        className: 'processed',
        group: 3,
        name: $localize`Processed`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_COMPLETED,
      {
        className: 'completed',
        group: 4,
        name: $localize`Completed`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_CANCELLING,
      {
        className: 'cancelling',
        group: 6,
        name: $localize`Cancelling`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_CANCELLED,
      {
        className: 'cancelled',
        group: 6,
        name: $localize`Cancelled`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_TIMEOUT,
      {
        className: 'timeout',
        group: 5,
        name: $localize`Timeout`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_ERROR,
      {
        className: 'error',
        group: 5,
        name: $localize`Error`,
        value: 0,
      },
    ],
  ]);

  public formattedData() {
    // Reset all values
    for (const [key, value] of this._statusMap) {
      value.value = 0;
      this._statusMap.set(key, value);
    }

    if (this.data) {
      // Update values
      this.data.forEach(({ status, count }) => {
        const item = this._statusMap.get(status);
        if (item) {
          item.value = count;
          this._statusMap.set(status, item);
        }
      });
    }

    const groups = new Map<number, any>();
    for (const [_, value] of this._statusMap) {
      if (groups.has(value.group)) {
        groups.set(value.group, [...groups.get(value.group), value]);
      } else {
        groups.set(value.group, [value]);
      }
    }

    return Array.from(groups, ([key, value]) => ({ key, value }));
  }

  public total() {
    if (!this.data) {
      return 0;
    }

    return this.data.reduce((acc, item) => acc + item.count, 0);
  }

  public trackGroup(_: number, group: { key: number }) {
    return group.key;
  }

  public trackStatus(_: number, status: StatusItem) {
    return status.name;
  }
}
