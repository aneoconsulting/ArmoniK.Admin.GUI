import { EventSubscriptionResponse, ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { ArmoniKGraphNode, GraphLink, LinkType, NodeEventType } from '@app/types/graph.types';
import { GraphData } from 'force-graph';
import { Observable, Subject, of, switchMap } from 'rxjs';
import { GrpcEventsService } from './grpc-events.service';
import { Status } from '../types/status';

@Injectable()
export class GraphDataService {
  private readonly grpcEventsService = inject(GrpcEventsService);

  sessionId: string = '';

  readonly nodes: ArmoniKGraphNode[] = [];
  readonly links: GraphLink<ArmoniKGraphNode>[] = [];

  private missingSources: GraphLink<ArmoniKGraphNode>[] = [];

  readonly updateGraphSubject = new Subject<GraphData>();

  /**
   * Add the session node to the nodes array.
   * Subscribe to the ArmoniK events associated to the current session.
   * Handles :
   * - New Task event: create a task node and its links
   * - New Result event: create a result node and its links
   * - Task status update event: update the status of a task node
   * - Result status update event: update the status of a result node
   * - Result Owner update event: update the task owner of a result
   */
  listenToEvents(): Observable<GraphData<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>> {
    this.addSession();
    return this.grpcEventsService.getEvents$(this.sessionId)
      .pipe(
        switchMap((event: EventSubscriptionResponse) => {
          switch(event.update) {
          case (EventSubscriptionResponse.UpdateCase.newTask): {
            this.addTask(event.newTask);
            break;
          }
          case (EventSubscriptionResponse.UpdateCase.newResult): {
            this.addResult(event.newResult);
            break;
          }
          case (EventSubscriptionResponse.UpdateCase.taskStatusUpdate): {
            this.updateStatus(
              event.taskStatusUpdate!.taskId,
              event.taskStatusUpdate!.status
            );
            break;
          }
          case (EventSubscriptionResponse.UpdateCase.resultStatusUpdate): {
            this.updateStatus(
              event.resultStatusUpdate!.resultId,
              event.resultStatusUpdate!.status
            );
            break;
          }
          case (EventSubscriptionResponse.UpdateCase.resultOwnerUpdate): {
            this.updateTaskOwner(
              event.resultOwnerUpdate!.resultId,
              event.resultOwnerUpdate!.previousOwnerId,
              event.resultOwnerUpdate!.currentOwnerId
            );
            break;
          }
          default: {
            console.warn('Unknown Grpc Update Event.');
          }
          }
          return of({ nodes: this.nodes, links: this.links });
        })
      );
  }

  /**
   * Return a node based on its Id. If none is found, return `undefined`.
   */
  private getNodeById(id: string): ArmoniKGraphNode | undefined {
    return this.nodes.find(node => node.id === id);
  }

  /**
   * Check if a node with the same Id exists. If none are found, creates the node.
   * If a node is found and its status is different, updates the status.
   * @param id 
   * @param status 
   * @param type 
   */
  private createNode(id: string, status: Status, type: NodeEventType) {
    const node = this.getNodeById(id);
    if (!node) {
      const node: ArmoniKGraphNode = { id, status, type };
      this.nodes.push(node);
      this.checkForMissingSource(node);
    } else if (node.status !== status) {
      node.status = status;
    }
  }

  /**
   * Create a task node.
   * If the node has dependencies, it will create dependencies link.
   * If the node has no dependencies, it will create links with parent tasks.
   */
  private addTask(newTask: EventSubscriptionResponse.NewTask | undefined) {
    if (newTask) {
      this.createNode(newTask.taskId, newTask.status, 'task');
      if (newTask.dataDependencies.length === 0) {
        this.addParentTask(
          newTask.taskId,
          newTask.parentTaskIds.at(-1) as string
        );
      } else {
        newTask.dataDependencies.forEach(dependencyId => {
          this.addDependency(newTask.taskId, dependencyId);
        });
      }
    }
  }

  /**
   * Creates the session node.
   */
  private addSession() {
    this.createNode(this.sessionId, SessionStatus.SESSION_STATUS_RUNNING, 'session');
  }

  /**
   * Create a result ands its link with the owner task.
   */
  private addResult(newResult: EventSubscriptionResponse.NewResult | undefined) {
    if (newResult) {
      this.createNode(newResult.resultId, newResult.status, 'result');
      this.addTaskOwner(newResult.resultId, newResult.ownerId);
    }
  }

  /**
   * Update the status of a result or task node
   */
  private updateStatus(nodeId: string, newStatus: TaskStatus | ResultStatus) {
    const node = this.getNodeById(nodeId);
    if (node) {
      node.status = newStatus;
    }
  }

  /**
   * Check if a link with the same source and target exist in the Link array.
   * If none is found, creates the link.
   * @param target end of the link
   * @param source start of the link
   * @param type parent | dependency | output
   */
  private addLink(target: string, source: string, type: LinkType) {
    if (!this.links.find(link => link.source === source && link.target === target)) {
      if (this.getNodeById(source)) {
        this.links.push({source, target, type});
      } else {
        this.missingSources.push({ target, source, type });
      }
    }
  }

  /**
   * Creates a link between a task (target) and its parent task (source)
   */
  private addParentTask(taskId: string, parentTaskId: string) {
    this.addLink(taskId, parentTaskId, 'parent');
  }

  /**
   * Creates a link between a result (source) and a task (target).
   */
  private addDependency(taskId: string, dependencyId: string) {
    this.addLink(taskId, dependencyId, 'dependency');
  }

  /**
   * Creates a link between a result (target) and its owner task (source)
   * @param resultId 
   * @param taskOwnerId 
   */
  private addTaskOwner(resultId: string, taskOwnerId: string) {
    if (taskOwnerId !== '') {
      this.addLink(resultId, taskOwnerId, 'output');
    }
  }

  /**
   * Update the owner task id of a result.
   */
  private updateTaskOwner(resultId: string, previousTaskOwnerId: string, newTaskOwnerId: string) {
    const link = this.links.find(link => link.target === resultId && link.source === previousTaskOwnerId);
    if (link) {
      link.source = newTaskOwnerId;
    } else {
      this.addTaskOwner(resultId, newTaskOwnerId);
    }
  }

  private checkForMissingSource(node: ArmoniKGraphNode) {
    const result = this.missingSources.find((link) => link.source === node.id);
    if (result) {
      this.links.push(result);
      this.missingSources = this.missingSources.filter((link) => link.source !== node.id);
    }
  }
}