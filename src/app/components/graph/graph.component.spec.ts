import { ResultStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ArmoniKGraphNode, GraphLink, GraphUpdate } from '@app/types/graph.types';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { Subject, defer } from 'rxjs';
import { createLayoutWorker } from './graph-layout-worker.factory';
import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: GraphComponent;

  const mockStorageService = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  const mockStatuses = {
    statusToLabel: jest.fn(() => ({ label: 'Completed', color: '#00ff00' })),
  };

  const mockClipboard = {
    copy: jest.fn(),
  };

  const mockWorker = {
    postMessage: jest.fn(),
    terminate: jest.fn(),
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null,
  };

  // parent → payload-child → child → output
  const nodes = (): ArmoniKGraphNode[] => [
    { id: 'parent', type: 'task', status: TaskStatus.TASK_STATUS_COMPLETED },
    { id: 'payload-child', type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED },
    { id: 'child', type: 'task', status: TaskStatus.TASK_STATUS_PROCESSING },
    { id: 'output', type: 'result', status: ResultStatus.RESULT_STATUS_CREATED },
  ];
  const links = (): GraphLink<ArmoniKGraphNode>[] => [
    { source: 'parent', target: 'payload-child', type: 'parent' },
    { source: 'payload-child', target: 'child', type: 'payload' },
    { source: 'child', target: 'output', type: 'output' },
  ];
  const structure = (): GraphUpdate => ({ nodes: nodes(), links: links(), kind: 'structure' });

  beforeEach(() => {
    jest.useFakeTimers();
    (createLayoutWorker as jest.Mock).mockReturnValue(mockWorker);
    component = TestBed.configureTestingModule({
      providers: [
        GraphComponent,
        DefaultConfigService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: IconsService, useValue: { getIcon: jest.fn(icon => icon) } },
        { provide: TasksStatusesService, useValue: mockStatuses },
        { provide: ResultsStatusesService, useValue: mockStatuses },
        { provide: Clipboard, useValue: mockClipboard },
      ],
    }).inject(GraphComponent);
    component.sessionId = 'session';
    component.ngOnInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should complete a stored color map with the default colors', () => {
      mockStorageService.getItem.mockImplementation(key => (key === 'graph-links-colors' ? { parent: '#123456' } : null));
      component.ngOnInit();

      expect(component.colorMap).toEqual({ ...new DefaultConfigService().defaultGraphLinksColors, parent: '#123456' });
      mockStorageService.getItem.mockReset();
    });
  });

  describe('updates', () => {
    it('should only count the nodes until the first layout', () => {
      const update = structure();
      component['apply']([update]);
      jest.advanceTimersByTime(500);

      expect(update.nodes.every(node => node.x === undefined)).toBe(true);
      expect(component.loading()).toEqual(expect.objectContaining({ tasks: 2, results: 2 }));
    });

    it('should show the whole graph at once after the first layout, late nodes included', () => {
      const update = structure();
      component['apply']([update]);
      jest.advanceTimersByTime(1000);
      const late: ArmoniKGraphNode = { id: 'late', type: 'task', status: TaskStatus.TASK_STATUS_CREATING };
      update.nodes.push(late);
      component['apply']([update]);

      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);

      expect(component.loading()).toBeNull();
      expect(update.nodes.slice(0, 4).map(node => [node.x, node.y])).toEqual([[0, 0], [0, 180], [0, 250], [0, 320]]);
      expect(late.x).toBeDefined();
    });

    it('should lay the graph out once the structure stops changing', () => {
      component['apply']([structure()]);
      expect(mockWorker.postMessage).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockWorker.postMessage).toHaveBeenCalledWith(expect.objectContaining({
        nodes: ['parent', 'payload-child', 'child', 'output'],
        types: ['task', 'result', 'task', 'result'],
      }));
    });

    it('should lay the graph out even when the structure never stops changing', () => {
      for (let elapsed = 0; elapsed < 10000; elapsed += 500) {
        component['apply']([structure()]);
        jest.advanceTimersByTime(500);
      }

      expect(mockWorker.postMessage).toHaveBeenCalled();
    });

    it('should lay the initial graph out after 30 s even when it never ends', () => {
      const initialBatch = Array.from({ length: 200 }, () => structure());
      for (let elapsed = 0; elapsed < 30000; elapsed += 500) {
        component['apply'](initialBatch);
        jest.advanceTimersByTime(500);
      }

      expect(mockWorker.postMessage).toHaveBeenCalled();
    });

    it('should wait for the end of the initial graph before the first layout', () => {
      const initialBatch = Array.from({ length: 200 }, () => structure());
      for (let elapsed = 0; elapsed < 10000; elapsed += 500) {
        component['apply'](initialBatch);
        jest.advanceTimersByTime(500);
      }

      expect(mockWorker.postMessage).not.toHaveBeenCalled();
    });

    it('should give the renderer a copy of the nodes, not the array the service keeps filling', () => {
      const update = structure();
      component['apply']([update]);
      update.nodes.push({ id: 'late', type: 'task', status: TaskStatus.TASK_STATUS_CREATING });

      expect(component['nodes']).toHaveLength(4);
    });

    it('should not lay the graph out for a status change', () => {
      component['apply']([{ ...structure(), kind: 'status' }]);
      jest.advanceTimersByTime(1000);

      expect(mockWorker.postMessage).not.toHaveBeenCalled();
    });

    it('should wait for the running layout before starting another one', () => {
      component['apply']([structure()]);
      jest.advanceTimersByTime(1000);
      component.redraw();

      expect(createLayoutWorker).toHaveBeenCalledTimes(1);
    });
  });

  describe('events stream', () => {
    let streams: Subject<GraphUpdate>[];

    beforeEach(() => {
      streams = [];
      component.updates = defer(() => {
        const stream = new Subject<GraphUpdate>();
        streams.push(stream);
        return stream;
      });
      component['listen']();
    });

    it('should reconnect once the stream is lost, and say so meanwhile', () => {
      streams[0].error({ statusCode: 14, statusMessage: 'unavailable' });

      expect(component.streamError()).toEqual('unavailable');
      jest.advanceTimersByTime(1000);
      expect(streams).toHaveLength(2);

      streams[1].next(structure());
      expect(component.streamError()).toBeNull();
    });

    it('should wait longer after each failed attempt', () => {
      streams[0].error(new Error('down'));
      jest.advanceTimersByTime(1000);
      streams[1].error(new Error('down'));
      jest.advanceTimersByTime(1000);

      expect(streams).toHaveLength(2);
      jest.advanceTimersByTime(1000);
      expect(streams).toHaveLength(3);
    });
  });

  describe('layout failure', () => {
    beforeEach(() => {
      component['apply']([structure()]);
      jest.advanceTimersByTime(1000);
    });

    it('should show why the layout failed and allow a retry', () => {
      mockWorker.onmessage!({ data: { error: 'ELK exploded' } } as MessageEvent);

      expect(component.layoutError()).toEqual('ELK exploded');
      expect(component.layingOut()).toBe(false);
      component.redraw();
      expect(createLayoutWorker).toHaveBeenCalledTimes(2);
    });

    it('should lay out a change that came in during the failed run', () => {
      component.redraw();
      mockWorker.onmessage!({ data: { error: 'ELK exploded' } } as MessageEvent);
      jest.advanceTimersByTime(1000);

      expect(createLayoutWorker).toHaveBeenCalledTimes(2);
    });

    it('should give up a layout that never ends', () => {
      jest.advanceTimersByTime(120000);

      expect(mockWorker.terminate).toHaveBeenCalled();
      expect(component.layoutError()).not.toBeNull();
    });
  });

  describe('nodes added after a layout', () => {
    it('should put new subtasks below their parent, side by side, with their data around them', () => {
      // The service keeps the same node objects from one update to the next.
      const update = structure();
      component['apply']([update]);
      component['laidOut'] = true;
      const [parent, , child] = update.nodes;
      const siblings = ['sibling-1', 'sibling-2'];
      for (const sibling of siblings) {
        update.nodes.push(
          { id: `${sibling}-payload`, type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED },
          { id: sibling, type: 'task', status: TaskStatus.TASK_STATUS_CREATING },
        );
        update.links.push(
          { source: 'parent', target: `${sibling}-payload`, type: 'parent' },
          { source: `${sibling}-payload`, target: sibling, type: 'payload' },
        );
      }
      component['apply']([update]);

      const placed = (id: string) => update.nodes.find(node => node.id === id)!;
      const xs = ['child', ...siblings].map(id => placed(id).x);
      expect(new Set(xs).size).toEqual(3);
      for (const sibling of siblings) {
        expect(placed(sibling).y).toEqual(child.y);
        expect(placed(sibling).y).toBeGreaterThan(parent.y!);
        expect(placed(`${sibling}-payload`).x).toEqual(placed(sibling).x);
        expect(placed(`${sibling}-payload`).y).toBeLessThan(placed(sibling).y!);
      }
    });
  });

  describe('highlight', () => {
    beforeEach(() => {
      component['laidOut'] = true;
      component['apply']([structure()]);
    });

    it('should highlight the nodes matching the search', () => {
      component.highlightChildrenNodes = false;
      component.highlightNodes('child');

      expect([...component['nodesToHighlight']]).toEqual(['payload-child', 'child']);
    });

    it('should highlight the ancestors and descendants of a single match', () => {
      component.highlightParentNodes = true;
      component.highlightChildrenNodes = true;
      component.highlightNodes('output');

      expect(component['nodesToHighlight']).toEqual(new Set(['output', 'child', 'payload-child', 'parent']));
    });

    it('should mark the highlighted nodes on top of the frame when zoomed out', () => {
      const ctx = { fillRect: jest.fn(), fillStyle: '' } as unknown as CanvasRenderingContext2D;
      component['nodes'].forEach((node, index) => component['setPosition'](node, index * 100, 0));
      component.highlightChildrenNodes = false;
      component.highlightParentNodes = false;
      component.highlightNodes('output');

      component['drawHighlights'](ctx, 0.01);

      // 12 px on screen at a zoom of 0.01: 1200 units, then its centre.
      expect(ctx.fillRect).toHaveBeenCalledWith(300 - 600, -600, 1200, 1200);
      expect(ctx.fillRect).toHaveBeenCalledTimes(2);
    });

    it('should leave the highlights to the icons when zoomed in', () => {
      const ctx = { fillRect: jest.fn() } as unknown as CanvasRenderingContext2D;
      component.highlightNodes('output');

      component['drawHighlights'](ctx, 1);

      expect(ctx.fillRect).not.toHaveBeenCalled();
    });

    it('should store the parents highlight setting', () => {
      component.toggleHighlightParentNodes(true);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('graph-highlight-parents', true);
    });

    it('should store the children highlight setting', () => {
      component.toggleHighlightChildrenNodes(true);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('graph-highlight-children', true);
    });
  });

  describe('debug', () => {
    it('should stay closed by default', () => {
      expect(component.debug()).toBeNull();
    });

    it('should store the setting', () => {
      component.toggleDebug(true);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('graph-debug', true);
    });

    it('should describe the graph, its events and its layout', () => {
      component.toggleDebug(true);
      component['apply']([structure(), { ...structure(), kind: 'status' }]);
      // The layout starts after 1 s, the panel refreshed after it reads it running.
      jest.advanceTimersByTime(2000);

      expect(component.debug()).toEqual(expect.objectContaining({
        tasks: 2,
        results: 2,
        links: { parent: 1, dependency: 0, output: 1, payload: 1 },
        events: expect.objectContaining({ structure: 1, status: 1 }),
        layout: expect.objectContaining({ state: 'running', runs: 1, waitingNodes: 4 }),
      }));
    });

    it('should stop refreshing once closed', () => {
      component.toggleDebug(true);
      component.toggleDebug(false);
      jest.advanceTimersByTime(1000);

      expect(component.debug()).toBeNull();
    });
  });

  it('should copy the session id', () => {
    component.copySessionId();
    expect(mockClipboard.copy).toHaveBeenCalledWith('session');
  });

  it('should compute the complementary color', () => {
    expect(component.getComplementaryColor('#00ff00')).toEqual('#ff00ff');
  });
});
