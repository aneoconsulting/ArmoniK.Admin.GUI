import { FilterStringOperator, ResultRawEnumField, TaskDetailed, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Params, Router } from '@angular/router';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { FiltersService } from '@services/filters.service';
import { Subscription } from 'rxjs';

/**
 * Displays all actions available for a selected task on ArmoniK Graph.
 */
@Component({
  selector: 'app-graph-inspect-task-actions',
  templateUrl: 'inspect-task-actions.component.html',
  styleUrl: 'inspect-node.component.css',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardActions
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectTaskActionsComponent<N extends ArmoniKGraphNode> implements OnDestroy {
  private readonly grpcService = inject(TasksGrpcService);
  private readonly filtersService = inject(FiltersService);
  private readonly router = inject(Router);

  private readonly subscriptions = new Subscription();

  task = signal<TaskDetailed | null>(null);

  @Input({ required: true }) set node(entry: N) {
    const getSubscription = this.grpcService.get$(entry.id)
      .subscribe(result => {
        if (result.task) {
          this.task.set(result.task);
        }
      });

    this.subscriptions.add(getSubscription);
  };

  /**
   * Navigates to the task inspection page
   * @param task TaskDetailed
   */
  seeTask(task: TaskDetailed) {
    this.router.navigate(['/tasks', task.id]);
  }

  /**
   * Navigates to the partition inspection page
   * @param task TaskDetailed
   */
  seePartition(task: TaskDetailed) {
    if (task.options) {
      this.router.navigate(['/partitions', task.options.partitionId]);
    }
  }

  /**
   * Navigates to the task table, filtered on all parent tasks ids.
   * @param task TaskDetailed
   */
  listParentTasks(task: TaskDetailed) {
    const queryParams = task.parentTaskIds
      .filter(parent => parent !== task.sessionId)
      .map((parent, index) => {
        const key = this.filtersService.createQueryParamsKey(index, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID);
        return [key, parent];
      })
      .reduce((record: Params, [key, parent]) => {
        record[key] = parent;
        return record;
      }, {});

    this.router.navigate(['/tasks'], {
      queryParams: queryParams,
    });
  }

  /**
   * Navigates to the result table, filtered on all expected output ids.
   * @param task 
   */
  listResults(task: TaskDetailed) {
    const queryParams = task.expectedOutputIds
      .map((parent, index) => {
        const key = this.filtersService.createQueryParamsKey(index, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID);
        return [key, parent];
      })
      .reduce((record: Params, [key, parent]) => {
        record[key] = parent;
        return record;
      }, {});

    this.router.navigate(['/results'], {
      queryParams: queryParams,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}