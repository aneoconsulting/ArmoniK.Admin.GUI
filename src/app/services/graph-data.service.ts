import { EventSubscriptionResponse, ResultStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { ArmoniKGraphNode, GraphLink, GraphUpdate, LinkType, NodeEventType } from '@app/types/graph.types';
import { GraphData } from 'force-graph';
import { Observable, Subject, map } from 'rxjs';
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

  readonly updateGraphSubject = new Subject<GraphData>();

  private readonly nodesById = new Map<string, ArmoniKGraphNode>();
  private readonly linksByEnds = new Map<string, GraphLink<ArmoniKGraphNode>>();
  /** Where each link is in `links`, so that removing one does not search them all. */
  private readonly linkIndexes = new Map<GraphLink<ArmoniKGraphNode>, number>();
  /** The task each result is an output of: a result has one owner at a time. */
  private readonly owners = new Map<string, string>();
  /** Nodes and links added or removed so far: a link replaced leaves their numbers unchanged. */
  private changes = 0;

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
    const before = this.changes;
    switch (event.update) {
    case EventSubscriptionResponse.UpdateCase.newTask:
      this.addTask(event.newTask!);
      return this.changes === before ? 'status' : 'structure';
    case EventSubscriptionResponse.UpdateCase.newResult:
      this.addResult(event.newResult!);
      return this.changes === before ? 'status' : 'structure';
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

  /**
   * A result and its link to its owner. The results the client uploads are owned by the session
   * itself: a session node would link every one of them to it.
   */
  private addResult(result: EventSubscriptionResponse.NewResult) {
    this.setNode(result.resultId, result.status, 'result');
    if (result.ownerId && result.ownerId !== this.sessionId) {
      this.setOwner(result.resultId, result.ownerId);
    }
  }

  private moveOutput(resultId: string, previousOwnerId: string, currentOwnerId: string) {
    this.removeLink(`${previousOwnerId}|${resultId}`);
    if (currentOwnerId && currentOwnerId !== this.sessionId) {
      // The change can come before the result itself: live events and the initial graph share
      // the stream. A link to a node that does not exist would break the renderer.
      this.ensureNode(resultId, ResultStatus.RESULT_STATUS_UNSPECIFIED, 'result');
      this.setOwner(resultId, currentOwnerId);
    } else {
      this.owners.delete(resultId);
    }
  }

  /**
   * Replaces the output link of the previous owner, which a change missed can leave: while the
   * stream was lost, a new one then telling the result with its current owner.
   */
  private setOwner(resultId: string, ownerId: string) {
    const previous = this.owners.get(resultId);
    if (previous !== undefined && previous !== ownerId) {
      this.removeLink(`${previous}|${resultId}`);
    }
    this.owners.set(resultId, ownerId);
    this.ensureNode(ownerId, TaskStatus.TASK_STATUS_UNSPECIFIED, 'task');
    this.addLink(ownerId, resultId, 'output');
  }

  /** Creates the node, or updates its status when it exists. */
  private setNode(id: string, status: Status, type: NodeEventType) {
    this.ensureNode(id, status, type);
    this.setStatus(id, status);
  }

  /** Creates the node if it does not exist yet, leaving an existing one untouched. */
  private ensureNode(id: string, status: Status, type: NodeEventType) {
    if (!this.nodesById.has(id)) {
      const node: ArmoniKGraphNode = { id, status, type };
      this.nodesById.set(id, node);
      this.nodes.push(node);
      this.changes++;
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
      this.linkIndexes.set(link, this.links.length);
      this.links.push(link);
      this.changes++;
    }
  }

  /** The last link takes the place of the removed one: the order of the links does not matter. */
  private removeLink(key: string) {
    const link = this.linksByEnds.get(key);
    if (!link) {
      return;
    }
    const index = this.linkIndexes.get(link)!;
    const last = this.links.pop()!;
    if (last !== link) {
      this.links[index] = last;
      this.linkIndexes.set(last, index);
    }
    this.linksByEnds.delete(key);
    this.linkIndexes.delete(link);
    this.changes++;
  }
}
