import { EventSubscriptionResponse, ResultStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { GraphUpdate } from '@app/types/graph.types';
import { Subject, Subscription } from 'rxjs';
import { GraphDataService } from './graph-data.service';
import { GrpcEventsService } from './grpc-events.service';

describe('GraphDataService', () => {
  let service: GraphDataService;
  let subscription: Subscription;
  let updates: GraphUpdate[];

  let events: Subject<EventSubscriptionResponse>;
  const mockGrpcEventsService = {
    getEvents$: jest.fn(() => events),
  };

  const sessionId = 'session';

  const newTask = (taskId: string, fields: Partial<EventSubscriptionResponse.NewTask> = {}) => ({
    update: EventSubscriptionResponse.UpdateCase.newTask,
    newTask: {
      taskId,
      status: TaskStatus.TASK_STATUS_CREATING,
      payloadId: `${taskId}-payload`,
      parentTaskIds: [sessionId],
      dataDependencies: [],
      ...fields,
    },
  } as unknown as EventSubscriptionResponse);

  const newResult = (resultId: string, ownerId: string) => ({
    update: EventSubscriptionResponse.UpdateCase.newResult,
    newResult: { resultId, ownerId, status: ResultStatus.RESULT_STATUS_CREATED },
  } as unknown as EventSubscriptionResponse);

  const links = () => service.links.map(link => `${link.source} -${link.type}-> ${link.target}`);

  beforeEach(() => {
    events = new Subject<EventSubscriptionResponse>();
    service = TestBed.configureTestingModule({
      providers: [
        GraphDataService,
        { provide: GrpcEventsService, useValue: mockGrpcEventsService },
      ],
    }).inject(GraphDataService);
    service.sessionId = sessionId;
    updates = [];
    subscription = service.graph$().subscribe(update => updates.push(update));
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should listen to the events of the session', () => {
    expect(mockGrpcEventsService.getEvents$).toHaveBeenCalledWith(sessionId);
  });

  describe('new task', () => {
    it('should add the task, its payload and its dependencies', () => {
      events.next(newTask('task', { dataDependencies: ['input'] }));

      expect(service.nodes.map(node => `${node.type}:${node.id}`)).toEqual(['task:task', 'result:task-payload', 'result:input']);
      expect(links()).toEqual(['task-payload -payload-> task', 'input -dependency-> task']);
    });

    it('should not link a root task to the session', () => {
      events.next(newTask('task'));

      expect(service.nodes.map(node => node.id)).not.toContain(sessionId);
    });

    it('should link the parent task to the payload of its subtask', () => {
      events.next(newTask('child', { parentTaskIds: [sessionId, 'parent'] }));

      expect(links()).toContain('parent -parent-> child-payload');
    });

    it('should update a node created as a placeholder', () => {
      events.next(newTask('child', { parentTaskIds: [sessionId, 'parent'] }));
      events.next(newTask('parent', { status: TaskStatus.TASK_STATUS_PROCESSING }));

      expect(service.nodes.filter(node => node.id === 'parent')).toEqual([expect.objectContaining({ status: TaskStatus.TASK_STATUS_PROCESSING })]);
    });

    it('should not duplicate the links of a task sent twice', () => {
      events.next(newTask('task'));
      events.next(newTask('task'));

      expect(links()).toEqual(['task-payload -payload-> task']);
    });

    it('should report a change of structure', () => {
      events.next(newTask('task'));

      expect(updates[0].kind).toEqual('structure');
    });

    it('should not report a task already known as a change of structure', () => {
      events.next(newTask('task'));
      events.next(newTask('task'));

      expect(updates[1].kind).toEqual('status');
    });
  });

  describe('new result', () => {
    it('should link the result to its owner', () => {
      events.next(newResult('output', 'task'));

      expect(links()).toEqual(['task -output-> output']);
    });

    it('should not turn the session owning an uploaded result into a task', () => {
      events.next(newResult('input', sessionId));

      expect(service.nodes.map(node => node.id)).toEqual(['input']);
      expect(service.links).toEqual([]);
    });
  });

  describe('status update', () => {
    it('should update the status and report it as such', () => {
      events.next(newTask('task'));
      events.next({
        update: EventSubscriptionResponse.UpdateCase.taskStatusUpdate,
        taskStatusUpdate: { taskId: 'task', status: TaskStatus.TASK_STATUS_COMPLETED },
      } as unknown as EventSubscriptionResponse);

      expect(service.nodes[0].status).toEqual(TaskStatus.TASK_STATUS_COMPLETED);
      expect(updates[1].kind).toEqual('status');
    });
  });

  describe('owner update', () => {
    it('should move the output to its new owner', () => {
      events.next(newResult('output', 'previous'));
      events.next({
        update: EventSubscriptionResponse.UpdateCase.resultOwnerUpdate,
        resultOwnerUpdate: { resultId: 'output', previousOwnerId: 'previous', currentOwnerId: 'current' },
      } as unknown as EventSubscriptionResponse);

      expect(links()).toEqual(['current -output-> output']);
    });

    it('should not turn the session into a task when it becomes the owner', () => {
      events.next(newResult('output', 'previous'));
      events.next({
        update: EventSubscriptionResponse.UpdateCase.resultOwnerUpdate,
        resultOwnerUpdate: { resultId: 'output', previousOwnerId: 'previous', currentOwnerId: sessionId },
      } as unknown as EventSubscriptionResponse);

      expect(service.nodes.map(node => node.id)).not.toContain(sessionId);
      expect(service.links).toEqual([]);
    });

    it('should find the previous link once the renderer replaced its ends with nodes', () => {
      events.next(newResult('output', 'previous'));
      const [link] = service.links;
      link.source = service.nodes.find(node => node.id === 'previous');
      link.target = service.nodes.find(node => node.id === 'output');
      events.next({
        update: EventSubscriptionResponse.UpdateCase.resultOwnerUpdate,
        resultOwnerUpdate: { resultId: 'output', previousOwnerId: 'previous', currentOwnerId: 'current' },
      } as unknown as EventSubscriptionResponse);

      expect(service.links).toHaveLength(1);
      expect(service.links[0].source).toEqual('current');
    });
  });
});
