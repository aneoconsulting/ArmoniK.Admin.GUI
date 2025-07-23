import { EventSubscriptionResponse, ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ArmoniKGraphNode, GraphLink } from '@app/types/graph.types';
import { Subject, Subscription } from 'rxjs';
import { GraphDataService } from './graph-data.service';
import { GrpcEventsService } from './grpc-events.service';

describe('GraphDataService', () => {
  let service: GraphDataService;

  let subscription: Subscription;

  const events = new Subject<EventSubscriptionResponse>();
  const mockGrpcEventsService = {
    getEvents$: jest.fn(() => events),
  };

  const sessionId = 'session';

  const sessionNode: ArmoniKGraphNode = {
    id: sessionId,
    status: SessionStatus.SESSION_STATUS_RUNNING,
    type: 'session',
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        GraphDataService,
        { provide: GrpcEventsService, useValue: mockGrpcEventsService },
      ],
    }).inject(GraphDataService);
    service.sessionId = sessionId;
    subscription = service.listenToEvents().subscribe();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('new Task', () => {
    const startingNodes = [
      {
        id: 'task-parent',
        status: TaskStatus.TASK_STATUS_COMPLETED,
        type: 'task'
      },
      {
        id: 'result-1',
        status: ResultStatus.RESULT_STATUS_COMPLETED,
        type: 'result',
      },
    ] as ArmoniKGraphNode[];

    const event: EventSubscriptionResponse = {
      update: EventSubscriptionResponse.UpdateCase.newTask,
      newTask: {
        taskId: 'task',
        status: TaskStatus.TASK_STATUS_CREATING,
        payloadId: 'result-payload',
        parentTaskIds: ['task-parent'],
        dataDependencies: [
          'result-1', 'result-2',
        ],
      } as EventSubscriptionResponse.NewTask
    } as EventSubscriptionResponse;
      
    beforeEach(() => {
      service.nodes.push(
        ...startingNodes,
      );
    });

    it('should add a task to the nodes', () => {
      events.next(event);
      expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
        sessionNode,
        ...startingNodes,
        {
          id: event.newTask!.taskId,
          status: event.newTask!.status,
          type: 'task'
        }
      ]);
    });

    it('should add task dependencies to links', () => {
      events.next(event);
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>(
        event.newTask!.dataDependencies.map((dependency) => ({
          type: 'dependency',
          source: dependency,
          target: event.newTask!.taskId
        })),
      );
    });

    describe('with payloadId and no dataDependency', () => {
      beforeEach(() => {
        event.newTask!.dataDependencies = [];
        events.next(event);
      });

      it('should add a payload link if there is no data dependency', () => {
        expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>(
          [       
            {
              type: 'payload',
              source: event.newTask!.payloadId,
              target: event.newTask!.taskId,
            },
            {
              type: 'parent',
              source: event.newTask!.parentTaskIds.at(-1),
              target: event.newTask!.payloadId,
            }
          ]
        );
      });

      it('should add the payload to the nodes', () => {
        expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
          sessionNode,
          ...startingNodes,
          {
            id: event.newTask!.taskId,
            status: event.newTask!.status,
            type: 'task'
          },
          {
            id: event.newTask!.payloadId,
            status: ResultStatus.RESULT_STATUS_UNSPECIFIED,
            type: 'result'
          },
        ]);
      });
    });
  });

  describe('new Result', () => {
    const event: EventSubscriptionResponse = {
      update: EventSubscriptionResponse.UpdateCase.newResult,
      newResult: {
        resultId: 'result',
        status: ResultStatus.RESULT_STATUS_CREATED,
        ownerId: 'task'
      } as EventSubscriptionResponse.NewResult,
    } as EventSubscriptionResponse;

    beforeEach(() => {
      events.next(event);
    });

    it('should add the result node and its owner if it does not exists', () => {
      expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
        sessionNode,
        {
          id: event.newResult!.resultId,
          status: event.newResult!.status,
          type: 'result',
        },
        {
          id: event.newResult!.ownerId,
          status: TaskStatus.TASK_STATUS_UNSPECIFIED,
          type: 'task',
        },
      ]);
    });

    it('should add the link between the result node and its owner', () => {
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        {
          type: 'output',
          source: event.newResult!.ownerId,
          target: event.newResult!.resultId,
        }
      ]);
    });
  });

  describe('taskStatusUpdate', () => {
    const startingNodes: ArmoniKGraphNode[] = [
      {
        id: 'task',
        status: TaskStatus.TASK_STATUS_PROCESSING,
        type: 'task',
      },
    ];

    const event: EventSubscriptionResponse = {
      update: EventSubscriptionResponse.UpdateCase.taskStatusUpdate,
      taskStatusUpdate: {
        taskId: 'task',
        status: TaskStatus.TASK_STATUS_PAUSED,
      } as EventSubscriptionResponse.TaskStatusUpdate
    } as EventSubscriptionResponse;

    beforeEach(() => {
      service.nodes.push(...startingNodes);
      events.next(event);
    });

    it('should change the status of the specified node', () => {
      expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
        sessionNode,
        {
          id: event.taskStatusUpdate!.taskId,
          status: event.taskStatusUpdate!.status,
          type: 'task',
        },
      ]);
    });
  });

  describe('resultStatusUpdate', () => {
    const startingNodes: ArmoniKGraphNode[] = [
      {
        id: 'result',
        status: ResultStatus.RESULT_STATUS_CREATED,
        type: 'result',
      },
    ];

    const event: EventSubscriptionResponse = {
      update: EventSubscriptionResponse.UpdateCase.resultStatusUpdate,
      resultStatusUpdate: {
        resultId: 'result',
        status: ResultStatus.RESULT_STATUS_DELETED,
      } as EventSubscriptionResponse.ResultStatusUpdate,
    } as EventSubscriptionResponse;

    beforeEach(() => {
      service.nodes.push(...startingNodes);
      events.next(event);
    });

    it('should change the status of the specified node', () => {
      expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
        sessionNode,
        {
          id: event.resultStatusUpdate!.resultId,
          status: event.resultStatusUpdate!.status,
          type: 'result',
        },
      ]);
    });
  });

  describe('resultOwnerUpdate', () => {
    const startingLinks: GraphLink<ArmoniKGraphNode>[] = [
      {
        type: 'output',
        source: 'task-1',
        target: 'result',
      },
    ];

    const event: EventSubscriptionResponse = {
      update: EventSubscriptionResponse.UpdateCase.resultOwnerUpdate,
      resultOwnerUpdate: {
        resultId: 'result',
        previousOwnerId: 'task-1',
        currentOwnerId: 'task-2'
      } as EventSubscriptionResponse.ResultOwnerUpdate,
    } as EventSubscriptionResponse;

    it('should change the owner of the specified link', () => {
      service.links.push(...startingLinks);
      events.next(event);
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        {
          type: 'output',
          source: event.resultOwnerUpdate!.currentOwnerId,
          target: event.resultOwnerUpdate!.resultId,
        },
      ]);
    });

    it('should create the link if it does not exists', () => {
      events.next(event);
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        {
          type: 'output',
          source: event.resultOwnerUpdate!.currentOwnerId,
          target: event.resultOwnerUpdate!.resultId,
        },
      ]);
    });
  });

  it('should catch an unknown event', () => {
    const spy = jest.spyOn(console, 'warn');
    spy.mockImplementationOnce(() => {});
    const event: EventSubscriptionResponse = {
      update: 'some random unknown event' as unknown as EventSubscriptionResponse.UpdateCase,
    } as EventSubscriptionResponse;
    events.next(event);
    expect(spy).toHaveBeenCalledWith('Unknown Grpc Update Event.');
  });

  describe('createNode', () => {
    it('should create a node if it does not exists', () => {
      service['createNode']('task', TaskStatus.TASK_STATUS_PROCESSED, 'task');
      expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
        sessionNode,
        {
          id: 'task',
          status: TaskStatus.TASK_STATUS_PROCESSED,
          type: 'task'
        }
      ]);
    });

    it('should update a node status if it already exists', () => {
      service.nodes.push({
        id: 'task',
        status: TaskStatus.TASK_STATUS_UNSPECIFIED,
        type: 'task',
      });
      service['createNode']('task', TaskStatus.TASK_STATUS_PROCESSED, 'task');
      expect(service.nodes).toEqual<ArmoniKGraphNode[]>([
        sessionNode,
        {
          id: 'task',
          status: TaskStatus.TASK_STATUS_PROCESSED,
          type: 'task'
        }
      ]);
    });
  });

  describe('addLink', () => {
    it('should add a link that does not exists', () => {
      service['addLink']('result', 'task-parent', 'output');
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        {
          target: 'result',
          source: 'task-parent',
          type: 'output',
        }
      ]);
    });

    it('should not add or update a link that already exists', () => {
      const startingLink = {
        target: 'result',
        source: 'task-parent',
        type: 'output',
      } as GraphLink<ArmoniKGraphNode>;
      service.links.push(startingLink);
      service['addLink']('result', 'task-parent', 'dependency');
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        startingLink
      ]);
    });

    it('should add a link with a target already in the links array', () => {
      const startingLink = {
        target: 'result',
        source: 'task-parent',
        type: 'output',
      } as GraphLink<ArmoniKGraphNode>;
      service.links.push(startingLink);
      service['addLink']('result', 'task-parent-2', 'output');
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        startingLink,
        {
          target: 'result',
          source: 'task-parent-2',
          type: 'output',
        }
      ]);
    });

    it('should add a link with a source already in the links array', () => {
      const startingLink = {
        target: 'result',
        source: 'task-parent',
        type: 'output',
      } as GraphLink<ArmoniKGraphNode>;
      service.links.push(startingLink);
      service['addLink']('result-2', 'task-parent', 'output');
      expect(service.links).toEqual<GraphLink<ArmoniKGraphNode>[]>([
        startingLink,
        {
          target: 'result-2',
          source: 'task-parent',
          type: 'output',
        }
      ]);
    });
  });
});