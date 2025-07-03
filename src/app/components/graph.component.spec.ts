import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ArmoniKGraphNode, GraphData, GraphLink } from '@app/types/graph.types';
import { IconsService } from '@services/icons.service';
import { Subject } from 'rxjs';
import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: GraphComponent<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>;

  const grpcObservable = new Subject<GraphData<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>>();

  const mockSessionsStatuses = {
    statusToLabel: jest.fn(() => ({
      label: 'Running',
      color: 'green'
    })),
  };

  const mockTasksStatuses = {
    statusToLabel: jest.fn(() => ({
      label: 'Completed',
      color: 'green'
    })),
  };

  const mockResultsStatuses = {
    statusToLabel: jest.fn(() => ({
      label: 'Completed',
      color: 'green'
    })),
  };

  const mockIconsService = {
    getIcon: jest.fn(v => v)
  };

  const mockGraph = {
    nativeElement: {}
  } as ElementRef;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        GraphComponent,
        { provide: IconsService, useValue: mockIconsService },
        { provide: SessionsStatusesService, useValue: mockSessionsStatuses },
        { provide: TasksStatusesService, useValue: mockTasksStatuses },
        { provide: ResultsStatusesService, useValue: mockResultsStatuses },
      ]
    }).inject(GraphComponent<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>);

    component.grpcObservable = grpcObservable;
    component['canvasHeight'] = 100;
    component['canvasWidth'] = 100;
    component['graphRef'] = mockGraph;
    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should set the graph', () => {
      expect(component['graph']).toBeDefined();
    });
    
    it('should subscribe the provided observable', () => {
      expect(grpcObservable.observed).toBeTruthy();
    });

    it('should subscribe the refresh observable', () => {
      expect(component['redrawGraph$'].observed).toBeTruthy();
    });
  });

  it('should redraw properly', () => {
    const spy = jest.spyOn(component['redrawGraph$'], 'next');
    component.redraw();
    expect(spy).toHaveBeenCalled();
  });

  it('should get icons', () => {
    const name = 'heart';
    component.getIcon(name);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(name);
  });

  it('should highlight nodes correctly', () => {
    component['nodes'] = [
      {
        id: 'abc',
      },
      {
        id: '123abc',
      },
      {
        id: '123',
      },
    ] as ArmoniKGraphNode[];

    const event = {
      target: {
        value: 'abc',
      },
    } as unknown as Event;
    component.highlightNodes(event);
    expect(component['nodesToHighlight']).toEqual(new Set(['abc', '123abc']));
  });

  describe('onResize', () => {
    const dimensions = {
      innerHeight: 10,
      innerWidth: 10,
    };
    const event = {
      target: dimensions,
    } as unknown as UIEvent;

    beforeEach(() => {
      component.onResize(event);
    });
    
    it('should update the canvas width', () => {
      expect(component['canvasWidth']).toEqual(dimensions.innerWidth);
    });

    it('should set the canvas width to the graph', () => {
      expect(component['graph'].width).toHaveBeenCalledWith(dimensions.innerWidth);
    });

    it('should update the canvas height', () => {
      expect(component['canvasHeight']).toEqual(dimensions.innerHeight);
    });

    it('should set the canvas height to the graph', () => {
      expect(component['graph'].height).toHaveBeenCalledWith(dimensions.innerHeight);
    });
  });

  describe('setParticles', () => {
    it('should display particles', () => {
      component.setParticles(true);
      expect(component['graph'].linkDirectionalParticles).toHaveBeenCalledWith(1);
    });
    
    it('should stop displaying particles', () => {
      component.setParticles(false);
      expect(component['graph'].linkDirectionalParticles).toHaveBeenCalledWith(0);
    });
  });

  it('should draw a node', () => {
    const node = {
      x: 0,
      y: 0,
      type: 'session',
    } as ArmoniKGraphNode;

    const mockCtx = {
      fillText: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    component['drawNode'](node, mockCtx);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      `${node.type}-graph-icon`,
      node.x! - 25,
      node.y! + 25,
    );
  });

  describe('getNodeStatusData', () => {
    it('should return the running session label', () => {
      const node = {
        type: 'session',
        status: SessionStatus.SESSION_STATUS_RUNNING,
      } as ArmoniKGraphNode;
      expect(component['getNodeStatusData'](node)).toEqual(
        mockSessionsStatuses.statusToLabel()
      );
    });

    it('should return the running task label', () => {
      const node = {
        type: 'task',
        status: TaskStatus.TASK_STATUS_COMPLETED,
      } as ArmoniKGraphNode;
      expect(component['getNodeStatusData'](node)).toEqual(
        mockTasksStatuses.statusToLabel()
      );
    });

    it('should return the running result label', () => {
      const node = {
        type: 'result',
        status: ResultStatus.RESULT_STATUS_COMPLETED,
      } as ArmoniKGraphNode;
      expect(component['getNodeStatusData'](node)).toEqual(
        mockResultsStatuses.statusToLabel()
      );
    });
    

    it('should get the default color', () => {
      const node = {
        type: 'unknown',
        status: ResultStatus.RESULT_STATUS_COMPLETED,
      } as unknown as ArmoniKGraphNode;

      expect(component['getNodeStatusData'](node)).toEqual({
        label: 'Unknown',
        color: 'grey'
      });
    });
  });

  describe('getLinkColor', () => {
    it('should get the parentlink color', () => {
      const link = {
        type: 'parent'
      } as GraphLink<ArmoniKGraphNode>;
      expect(component['getLinkColor'](link)).toEqual(component['colorMap'].get('parentLink'));
    });
    
    it('should get the dependencyLink color', () => {
      const link = {
        type: 'dependency'
      } as GraphLink<ArmoniKGraphNode>;
      expect(component['getLinkColor'](link)).toEqual(component['colorMap'].get('dependencyLink'));
    });
    
    it('should get the taskResultLink color', () => {
      const link = {
        type: 'output'
      } as GraphLink<ArmoniKGraphNode>;
      expect(component['getLinkColor'](link)).toEqual(component['colorMap'].get('taskResultLink'));
    });
  });

  describe('On new node data', () => {
    const nodes = [
      {
        id: 'abc',
      },
      {
        id: '123',
      },
    ] as ArmoniKGraphNode[];

    const links = [
      {
        source: 'abc',
        target: '123',
      },
    ] as GraphLink<ArmoniKGraphNode>[];

    beforeEach(() => {
      grpcObservable.next({
        nodes: nodes,
        links: links,
      });
    });

    it('should update the component nodes', () => {
      expect(component['nodes']).toEqual(nodes);
    });

    it('should redraw the graph', () => {
      expect(component['graph'].graphData).toHaveBeenCalledWith({
        nodes: nodes,
        links: links,
      });
    });

    it('should center the node', () => {
      expect(component['graph'].centerAt).toHaveBeenCalled();
    });

    it('should zoom on the node' ,() => {
      expect(component['graph'].zoom).toHaveBeenCalled();
    });
  });
});