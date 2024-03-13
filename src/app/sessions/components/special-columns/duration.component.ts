import { FilterStringOperator, TaskSummary, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Duration } from '@ngx-grpc/well-known-types';
import { Subject, startWith } from 'rxjs';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';

@Component({
  selector: 'app-session-duration',
  standalone: true,
  template: `
    <span>{{ duration | async | duration | emptyCell }}</span>
  `,
  imports: [
    AsyncPipe,
    DurationPipe,
    EmptyCellPipe
  ],
  providers: [
    TasksGrpcService
  ]
})
export class SessionDurationComponent {
  duration = new Subject<Duration>();
  
  readonly _tasksGrpcService = inject(TasksGrpcService);
  readonly nextDuration = new Subject<string>();

  readonly subscription = this.nextDuration.pipe(startWith()).subscribe(sessionId => {
    this.getTaskData$(sessionId, 'endedAt', 'desc').subscribe(last => {
      this.getTaskData$(sessionId, 'createdAt', 'asc').subscribe(first => {
        const lastDuration = last.tasks?.at(0)?.endedAt;
        const firstDuration = first.tasks?.at(0)?.createdAt;
        if (firstDuration && lastDuration) {
          this.duration.next({
            seconds: (Number(lastDuration.seconds) - Number(firstDuration.seconds)).toString(),
            nanos: lastDuration.nanos - firstDuration.nanos                
          } as Duration);
        }
      });
    });
  });

  @Input({required: true}) set sessionId(entry: string) {
    this.nextDuration.next(entry);
  }

  getTaskData$(sessionId: string, activeField: keyof TaskSummary.AsObject, direction: SortDirection) {
    return this._tasksGrpcService.list$(
      {
        pageIndex: 0,
        pageSize: 1,
        sort: {
          active: activeField,
          direction
        }
      },
      [
        [
          {
            field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: sessionId
          }
        ]
      ]
    );
  }
}