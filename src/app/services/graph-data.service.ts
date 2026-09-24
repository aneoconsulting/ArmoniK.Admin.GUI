import { EventSubscriptionResponse, ResultStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { ArmoniKGraphNode, GraphLink, GraphUpdate, LinkType, NodeEventType } from '@app/types/graph.types';
import { Observable, map } from 'rxjs';
import { GrpcEventsService } from './grpc-events.service';
import { Status } from '../types/status';

/**
 * The graph of a session: its tasks and results, and the links between them. The events of the
 * session start with the whole current graph, then follow its changes.
 */
@Injectable()
export class GraphDataService {
  private readonly grpcEventsService = inject(GrpcEventsService);

  sessionId: string = '';

  readonly nodes: ArmoniKGraphNode[] = [];
  readonly links: GraphLink<ArmoniKGraphNode>[] = [];

  private readonly nodesById = new Map<string, ArmoniKGraphNode>();
  private readonly linksByEnds = new Map<string, GraphLink<ArmoniKGraphNode>>();

  /** Emits after each event, telling whether it changed the structure or only a status. */
  graph$(): Observable<GraphUpdate> {
    return this.grpcEventsService.getEvents$(this.sessionId).pipe(
      map(event => ({ nodes: this.nodes, links: this.links, kind: this.applyEvent(event) })),
    );
  }

  /**
   * 'structure' only when a node or a link was actually added or moved: the initial graph sends
   * results that its tasks already brought in, and reporting them as new would keep delaying the
   * layout.
   */
  private applyEvent(event: EventSubscriptionResponse): GraphUpdate['kind'] {
    const before = this.nodes.length + this.links.length;
    switch (event.update) {
    case EventSubscriptionResponse.UpdateCase.newTask:
      this.addTask(event.newTask!);
      return this.nodes.length + this.links.length === before ? 'status' : 'structure';
    case EventSubscriptionResponse.UpdateCase.newResult:
      this.addResult(event.newResult!);
      return this.nodes.length + this.links.length === before ? 'status' : 'structure';
    case EventSubscriptionResponse.UpdateCase.taskStatusUpdate:
      this.setStatus(event.taskStatusUpdate!.taskId, event.taskStatusUpdate!.status);
      return 'status';
    case EventSubscriptionResponse.UpdateCase.resultStatusUpdate:
      this.setStatus(event.resultStatusUpdate!.resultId, event.resultStatusUpdate!.status);
      return 'status';
    case EventSubscriptionResponse.UpdateCase.resultOwnerUpdate: {
      const update = event.resultOwnerUpdate!;
      this.moveOutput(update.resultId, update.previousOwnerId, update.currentOwnerId);
      return 'structure';
    }
    default:
      console.warn('Unknown Grpc Update Event.');
      return 'status';
    }
  }

  /**
   * A task, its payload and its data dependencies. Its parent feeds its payload, unless the parent
   * is the session itself: a session node would link every root task to it.
   */
  private addTask(task: EventSubscriptionResponse.NewTask) {
    this.setNode(task.taskId, task.status, 'task');
    if (task.payloadId) {
      this.ensureNode(task.payloadId, ResultStatus.RESULT_STATUS_UNSPECIFIED, 'result');
      this.addLink(task.payloadId, task.taskId, 'payload');
      const parent = task.parentTaskIds.at(-1);
      if (parent && parent !== this.sessionId) {
        this.ensureNode(parent, TaskStatus.TASK_STATUS_UNSPECIFIED, 'task');
        this.addLink(parent, task.payloadId, 'parent');
      }
    }
    for (const dependency of task.dataDependencies) {
      this.ensureNode(dependency, ResultStatus.RESULT_STATUS_UNSPECIFIED, 'result');
      this.addLink(dependency, task.taskId, 'dependency');
    }
  }

  private addResult(result: EventSubscriptionResponse.NewResult) {
    this.setNode(result.resultId, result.status, 'result');
    if (result.ownerId) {
      this.ensureNode(result.ownerId, TaskStatus.TASK_STATUS_UNSPECIFIED, 'task');
      this.addLink(result.ownerId, result.resultId, 'output');
    }
  }

  private moveOutput(resultId: string, previousOwnerId: string, currentOwnerId: string) {
    const key = `${previousOwnerId}|${resultId}`;
    const link = this.linksByEnds.get(key);
    if (link) {
      this.linksByEnds.delete(key);
      this.links.splice(this.links.indexOf(link), 1);
    }
    if (currentOwnerId) {
      this.ensureNode(currentOwnerId, TaskStatus.TASK_STATUS_UNSPECIFIED, 'task');
      this.addLink(currentOwnerId, resultId, 'output');
    }
  }

  /** Creates the node, or updates its status when it exists. */
  private setNode(id: string, status: Status, type: NodeEventType) {
    const node = this.nodesById.get(id);
    if (node) {
      node.status = status;
    } else {
      this.ensureNode(id, status, type);
    }
  }

  /** Creates the node if it does not exist yet, leaving an existing one untouched. */
  private ensureNode(id: string, status: Status, type: NodeEventType) {
    if (!this.nodesById.has(id)) {
      const node: ArmoniKGraphNode = { id, status, type };
      this.nodesById.set(id, node);
      this.nodes.push(node);
    }
  }

  private setStatus(id: string, status: Status) {
    const node = this.nodesById.get(id);
    if (node) {
      node.status = status;
    }
  }

  /**
   * Links are indexed by their ends as ids: the renderer replaces `source` and `target` with the
   * node objects, so comparing them would miss.
   */
  private addLink(source: string, target: string, type: LinkType) {
    const key = `${source}|${target}`;
    if (!this.linksByEnds.has(key)) {
      const link = { source, target, type };
      this.linksByEnds.set(key, link);
      this.links.push(link);
    }
  }
}
