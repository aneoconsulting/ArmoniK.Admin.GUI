import { Clipboard } from '@angular/cdk/clipboard';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArmoniKGraphNode, GraphData, GraphLink, LinkType } from '@app/types/graph.types';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { Subject } from 'rxjs';
import { NodeStatusService } from './graph/services/node-status.service';
import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: GraphComponent<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>;

  const grpcObservable = new Subject<GraphData<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>>();

  const mockStorageService = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn(),
  };

  const mockIconsService = {
    getIcon: jest.fn(v => v)
  };

  const mockGraph = {
    nativeElement: {}
  } as ElementRef;

  const mockNodeStatusService = {
    getNodeStatusData: jest.fn(() => ({ label: 'status', color: 'green' })),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        GraphComponent,
        DefaultConfigService,
        { provide: NodeStatusService, useValue: mockNodeStatusService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: IconsService, useValue: mockIconsService },
        { provide: Clipboard, useValue: mockClipboard },
      ]
    }).inject(GraphComponent<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>);

    component.grpcObservable = grpcObservable;
    component['canvasHeight'] = 100;
    component['canvasWidth'] = 100;
    component['graphRef'] = mockGraph;
    component.ngOnInit();
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

  it('should copy the session Id', () => {
    component.copySessionId();
    expect(mockClipboard.copy).toHaveBeenCalledWith(component.sessionId);
  });

  describe('highlightNodes', () => {
    const nodes = [
      {
        id: 'abc',
      },
      {
        id: '123abc',
      },
      {
        id: '123',
      },
      {
        id: '1234',
      },
    ] as ArmoniKGraphNode[];

    const links = [
      {
        source: '123',
        target: '123abc',
      },
      {
        source: '123abc',
        target: '1234',
      }
    ] as GraphLink<ArmoniKGraphNode>[];

    beforeEach(() => {
      component['nodes'] = nodes;
      component['links'] = links;
    });

    it('should highlight nodes correctly', () => {
      const event = 'abc';
      component.highlightNodes(event);
      expect(component['nodesToHighlight']).toEqual(new Set(['abc', '123abc']));
    });

    it('should highlight all parents nodes if there is only one matching node and highlightParentNodes is true', () => {
      const event = '123abc';
      component.highlightParentNodes = true;
      component.highlightNodes(event);
      expect(component['nodesToHighlight']).toEqual(new Set(['123', '123abc']));
    });

    it('should highlight all parents nodes if there is only one matching node and highlightChildrenNodes is true', () => {
      const event = '123abc';
      component.highlightChildrenNodes = true;
      component.highlightNodes(event);
      expect(component['nodesToHighlight']).toEqual(new Set(['123abc', '1234']));
    });

    it('should highlight both parents and children nodes if there is only one matching node and highlightChildrenNodes and highlightParentNodes are true', () => {
      const event = '123abc';
      component.highlightChildrenNodes = true;
      component.highlightParentNodes = true;
      component.highlightNodes(event);
      expect(component['nodesToHighlight']).toEqual(new Set(['123', '123abc', '1234']));
    });
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

  describe('drawNode', () => {
    let mockCtx: CanvasRenderingContext2D;

    const node = {
      id: '1',
      x: 0,
      y: 0,
      type: 'session',
    } as ArmoniKGraphNode;

    beforeEach(() => {
      mockCtx = {
        fillText: jest.fn(),
      } as unknown as CanvasRenderingContext2D;
    });

    it('should draw a node', () => {
      component['drawNode'](node, mockCtx);

      expect(mockCtx.fillText).toHaveBeenCalledWith(
        `${node.type}-graph-icon`,
        node.x! - 25,
        node.y! + 25,
      );
    });

    it('should highlight a node if its id is in the nodesToHighlight', () => {
      component['nodesToHighlight'].add('1');
      component['drawNode'](node, mockCtx);

      expect(mockCtx.fillText).toHaveBeenCalledTimes(2);
    });
  });

  describe('getLinkColor', () => {
    it('should get all kind of link colors', () => {
      const types: LinkType[] = ['dependency', 'output', 'parent', 'payload'];
      types.forEach(type => {
        const link = {
          type: type
        } as GraphLink<ArmoniKGraphNode>;
        expect(component['getLinkColor'](link)).toEqual(component.colorMap[type]);
      });
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

  describe('toggleHighlightChildrenNodes', () => {
    const checked = true;
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component, 'highlightNodes');
      component['highlightChildrenNodes'] = !checked;
      component['nodeToHighlight'] = null;
    });

    it('should set the provided value as highlightChildrenNodes', () => {
      component.toggleHighlightChildrenNodes(checked);
      expect(component['highlightChildrenNodes']).toEqual(checked);
    });

    it('should not highlight the nodes if there is no nodes to hightlight', () => {
      component.toggleHighlightChildrenNodes(checked);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should hightlight the nodes if there is a node to highlight', () => {
      component['nodeToHighlight'] = 'some node';
      component.toggleHighlightChildrenNodes(checked);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toggleHighlightChildrenNodes', () => {
    const checked = true;
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component, 'highlightNodes');
      component['highlightParentNodes'] = !checked;
      component['nodeToHighlight'] = null;
    });

    it('should set the provided value as highlightChildrenNodes', () => {
      component.toggleHighlightChildrenNodes(checked);
      expect(component['highlightChildrenNodes']).toEqual(checked);
    });

    it('should not highlight the nodes if there is no nodes to hightlight', () => {
      component.toggleHighlightParentNodes(checked);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should hightlight the nodes if there is a node to highlight', () => {
      component['nodeToHighlight'] = 'some node';
      component.toggleHighlightParentNodes(checked);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should close node panel', () => {
    component.selectedNode.set({ id: 'id' } as ArmoniKGraphNode);
    component.closeNodePanel();
    expect(component.selectedNode()).toBeNull();
  });
});