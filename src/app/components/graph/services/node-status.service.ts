import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { StatusLabelColor } from '@app/types/status';

@Injectable()
export class NodeStatusService<N extends ArmoniKGraphNode> {
  private readonly sessionsStatusesService = inject(SessionsStatusesService);
  private readonly tasksStatusesService = inject(TasksStatusesService);
  private readonly resultsStatusesService = inject(ResultsStatusesService);

  /**
   * Get the data associated to the node status.
   * @param node N
   * @returns StatusLabelColor, contains label, color and icon.
   */
  getNodeStatusData(node: N): StatusLabelColor {
    switch (node.type) {
    case 'session':
      return this.sessionsStatusesService.statusToLabel(node.status as SessionStatus);
    case 'task':
      return this.tasksStatusesService.statusToLabel(node.status as TaskStatus);
    case 'result':
      return this.resultsStatusesService.statusToLabel(node.status as ResultStatus);
    default:
      return {
        label: $localize`Unknown`,
        color: 'grey',
      };
    }
  }
}