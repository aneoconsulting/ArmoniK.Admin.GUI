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
import { NODE_SIZE } from './graph-layout';
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
      // The initial graph ends with the second batch, the first one telling nothing: 10 s after.
      for (let elapsed = 0; elapsed < 11000; elapsed += 500) {
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

    it('should not take a short first batch for the end of the initial graph', () => {
      const initialBatch = Array.from({ length: 200 }, () => structure());
      component['apply']([structure()]);
      for (let elapsed = 0; elapsed < 10000; elapsed += 500) {
        component['apply'](initialBatch);
        jest.advanceTimersByTime(500);
      }

      expect(mockWorker.postMessage).not.toHaveBeenCalled();
    });

    it('should not take a batch of results already known for the end of the initial graph', () => {
      const knownResults = Array.from({ length: 200 }, (): GraphUpdate => ({ ...structure(), kind: 'status' }));
      for (let elapsed = 0; elapsed < 10000; elapsed += 500) {
        component['apply']([structure(), ...knownResults]);
        component['apply'](knownResults);
        jest.advanceTimersByTime(500);
      }

      expect(mockWorker.postMessage).not.toHaveBeenCalled();
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

      expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
    });

    it('should keep the worker from one layout to the next', () => {
      component['apply']([structure()]);
      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array(8) } } as MessageEvent);
      component.redraw();

      expect(createLayoutWorker).toHaveBeenCalledTimes(1);
      expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
      expect(mockWorker.terminate).not.toHaveBeenCalled();
    });
  });

  describe('view initialisation', () => {
    const fonts = (load: () => Promise<unknown>) => Object.defineProperty(document, 'fonts', { value: { load }, configurable: true });

    beforeEach(() => {
      component['graphRef'] = { nativeElement: document.createElement('div') };
      component.updates = new Subject<GraphUpdate>();
    });

    afterEach(() => {
      delete (document as { fonts?: unknown }).fonts;
    });

    it('should draw the graph even when the icon font fails to load', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      fonts(() => Promise.reject(new Error('blocked')));
      await component.ngAfterViewInit();

      expect(component['graph']).not.toBeNull();
      expect(component['subscription'].closed).toBe(false);
    });

    it('should not create the renderer once left while the font was loading', async () => {
      let loaded!: () => void;
      fonts(() => new Promise<void>(resolve => (loaded = resolve)));
      const init = component.ngAfterViewInit();
      component.ngOnDestroy();
      loaded();
      await init;

      expect(component['graph']).toBeNull();
    });
  });

  describe('view', () => {
    // A renderer of 1080 × 680, 40 of padding left: 1000 × 600 for a graph of the given size.
    const renderer = (width: number, height: number, zoom: number) => {
      const graph = {
        _destructor: jest.fn(),
        zoomToFit: jest.fn(),
        zoom: jest.fn((value?: number): unknown => (value === undefined ? zoom : graph)),
        width: () => 1080,
        height: () => 680,
        minZoom: jest.fn((value?: number): unknown => (value === undefined ? 0.01 : graph)),
        getGraphBbox: () => ({ x: [0, width], y: [0, height] }),
      };
      component['graph'] = graph as never;
      return graph;
    };

    it('should fit the graph without zooming in past its natural size', () => {
      const graph = renderer(100, 100, 16);

      component['fitView']();

      expect(graph.zoomToFit).toHaveBeenCalled();
      // Not 1: force-graph would take the view as never zoomed, and zoom it its own way.
      expect(graph.zoom).toHaveBeenLastCalledWith(0.99);
    });

    it('should zoom out further than force-graph allows by default to fit a very wide graph', () => {
      const graph = renderer(250000, 600, 0.004);

      component['fitView']();

      expect(graph.minZoom).toHaveBeenCalledWith(0.004);
      expect(graph.zoomToFit).toHaveBeenCalled();
    });

    it('should keep the default limit for a graph that fits within it', () => {
      const graph = renderer(5000, 600, 0.2);

      component['fitView']();

      expect(graph.minZoom).not.toHaveBeenCalledWith(expect.any(Number));
    });

    it('should size the canvas as its container, not as the window', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'clientWidth', { value: 1200 });
      Object.defineProperty(element, 'clientHeight', { value: 700 });
      const graph = { _destructor: jest.fn(), width: jest.fn((): unknown => graph), height: jest.fn((): unknown => graph) };
      component['graphRef'] = { nativeElement: element };
      component['graph'] = graph as never;

      component.onResize();

      expect(graph.width).toHaveBeenCalledWith(1200);
      expect(graph.height).toHaveBeenCalledWith(700);
    });
  });

  describe('events stream', () => {
    let streams: Subject<GraphUpdate>[];

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
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

    it('should show a session that sends nothing as empty', () => {
      jest.advanceTimersByTime(5000);

      expect(component.loading()).toBeNull();
    });

    it('should fit the view on the first graph to come to a session shown empty', () => {
      const graph: Record<string, jest.Mock> = {};
      for (const method of ['graphData', 'nodeCanvasObject', 'zoomToFit', 'zoom', '_destructor']) {
        graph[method] = jest.fn(() => graph);
      }
      graph['getGraphBbox'] = jest.fn(() => ({ x: [0, 100], y: [0, 400] }));
      graph['width'] = jest.fn(() => 1000);
      graph['height'] = jest.fn(() => 800);
      graph['minZoom'] = jest.fn(() => 0.01);
      component['graph'] = graph as unknown as typeof component['graph'];
      jest.advanceTimersByTime(5000);

      streams[0].next(structure());
      // A batch, then the quiet time before the layout.
      jest.advanceTimersByTime(1500);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);

      expect(graph['zoomToFit']).toHaveBeenCalled();
    });

    it('should keep loading a session whose graph is arriving', () => {
      streams[0].next(structure());
      jest.advanceTimersByTime(5000);

      expect(component.loading()).not.toBeNull();
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
      expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
    });

    it('should lay out a change that came in during the failed run', () => {
      component.redraw();
      mockWorker.onmessage!({ data: { error: 'ELK exploded' } } as MessageEvent);
      jest.advanceTimersByTime(1000);

      expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
    });

    it('should let a long layout run', () => {
      jest.advanceTimersByTime(600000);

      expect(component.layingOut()).toBe(true);
      expect(mockWorker.terminate).not.toHaveBeenCalled();
    });

    it('should stop a cancelled layout, and its worker with it', () => {
      component.cancelLayout();

      expect(component.layingOut()).toBe(false);
      expect(mockWorker.terminate).toHaveBeenCalled();
      expect(component.layoutError()).not.toBeNull();
      component.redraw();
      expect(createLayoutWorker).toHaveBeenCalledTimes(2);
    });
  });

  describe('nodes added after a layout', () => {
    // parent at the top, its subtask child below it, and a result of the parent on the side.
    const laidOut = () => {
      const update = structure();
      update.nodes.push({ id: 'parent-output', type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED });
      update.links.push({ source: 'parent', target: 'parent-output', type: 'output' });
      component['apply']([update]);
      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320, 100, 70]) } } as MessageEvent);
      return update;
    };
    const place = (update: GraphUpdate, id: string) => {
      const node = update.nodes.find(candidate => candidate.id === id)!;
      return [node.x, node.y];
    };
    const addTask = (update: GraphUpdate, id: string, parent?: string) => {
      update.nodes.push(
        { id: `${id}-payload`, type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED },
        { id, type: 'task', status: TaskStatus.TASK_STATUS_CREATING },
        { id: `${id}-output`, type: 'result', status: ResultStatus.RESULT_STATUS_CREATED },
      );
      update.links.push(
        { source: `${id}-payload`, target: id, type: 'payload' },
        { source: id, target: `${id}-output`, type: 'output' },
      );
      if (parent) {
        update.links.push({ source: parent, target: `${id}-payload`, type: 'parent' });
      }
    };

    it('should put new subtasks and their data on their parent, for the next layout to spread them', () => {
      const update = laidOut();
      addTask(update, 'sibling-1', 'parent');
      addTask(update, 'sibling-2', 'parent');
      component['apply']([update]);

      for (const id of ['sibling-1', 'sibling-1-payload', 'sibling-1-output', 'sibling-2', 'sibling-2-payload', 'sibling-2-output']) {
        expect(place(update, id)).toEqual([0, 0]);
      }
    });

    it('should put a chain of thousands of new subtasks on its placed end', () => {
      const update = laidOut();
      addTask(update, 'chain-0', 'child');
      for (let index = 1; index < 10000; index++) {
        addTask(update, `chain-${index}`, `chain-${index - 1}`);
      }
      component['apply']([update]);

      expect(place(update, 'chain-9999')).toEqual([0, 250]);
    });

    it('should put a task the client submitted on the deepest producer of its data', () => {
      const update = laidOut();
      addTask(update, 'reduce');
      update.links.push(
        { source: 'parent-output', target: 'reduce', type: 'dependency' },
        { source: 'output', target: 'reduce', type: 'dependency' },
      );
      component['apply']([update]);

      expect(place(update, 'reduce')).toEqual([0, 250]);
    });

    it('should put a new root to the right of the graph, on its top row', () => {
      const update = laidOut();
      addTask(update, 'root');
      component['apply']([update]);

      const [x, y] = place(update, 'root');
      expect(x).toBeGreaterThan(100 + NODE_SIZE);
      expect(y).toEqual(0);
      expect(place(update, 'root-output')).toEqual([x, y]);
    });
  });

  describe('nodes added during a layout', () => {
    it('should move them with the node they are on once it is done', () => {
      const update = structure();
      component['apply']([update]);
      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);

      // A second layout runs, and a subtask of the parent arrives meanwhile.
      component.redraw();
      update.nodes.push(
        { id: 'late-payload', type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED },
        { id: 'late', type: 'task', status: TaskStatus.TASK_STATUS_CREATING },
      );
      update.links.push(
        { source: 'parent', target: 'late-payload', type: 'parent' },
        { source: 'late-payload', target: 'late', type: 'payload' },
      );
      component['apply']([update]);

      // The layout moves everything 5000 to the right.
      mockWorker.onmessage!({ data: { positions: new Float64Array([5000, 0, 5000, 180, 5000, 250, 5000, 320]) } } as MessageEvent);
      jest.advanceTimersByTime(1000);

      const late = update.nodes.find(node => node.id === 'late')!;
      expect([late.x, late.y]).toEqual([5000, 0]);
    });

    it('should put one arriving while the nodes move where its parent goes', () => {
      const update = structure();
      component['apply']([update]);
      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);
      component.redraw();
      mockWorker.onmessage!({ data: { positions: new Float64Array([5000, 0, 5000, 180, 5000, 250, 5000, 320]) } } as MessageEvent);

      // Halfway through the move.
      jest.advanceTimersByTime(300);
      update.nodes.push(
        { id: 'late-payload', type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED },
        { id: 'late', type: 'task', status: TaskStatus.TASK_STATUS_CREATING },
      );
      update.links.push(
        { source: 'parent', target: 'late-payload', type: 'parent' },
        { source: 'late-payload', target: 'late', type: 'payload' },
      );
      component['apply']([update]);
      jest.advanceTimersByTime(1000);

      const late = update.nodes.find(node => node.id === 'late')!;
      const parent = update.nodes.find(node => node.id === 'parent')!;
      expect([late.x, late.y]).toEqual([5000, 0]);
      expect([parent.x, parent.y]).toEqual([5000, 0]);
    });
  });

  describe('highlight before the first layout', () => {
    it('should wait for the layout to centre on a single match and highlight its ancestors', () => {
      const graph: Record<string, jest.Mock> = {};
      for (const method of ['centerAt', 'graphData', 'nodeCanvasObject', 'zoomToFit', 'zoom', '_destructor']) {
        graph[method] = jest.fn(() => graph);
      }
      graph['getGraphBbox'] = jest.fn(() => ({ x: [0, 100], y: [0, 400] }));
      graph['width'] = jest.fn(() => 1000);
      graph['height'] = jest.fn(() => 800);
      graph['minZoom'] = jest.fn(() => 0.01);
      component['graph'] = graph as unknown as typeof component['graph'];
      component.highlightParentNodes = true;
      component['apply']([structure()]);

      expect(() => component.highlightNodes('output')).not.toThrow();
      expect(graph['centerAt']).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);

      expect(graph['centerAt']).toHaveBeenCalledWith(0, 320, 500);
      expect(component['nodesToHighlight']).toEqual(new Set(['output', 'child', 'payload-child', 'parent']));
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

    it('should not paint a pointer area for a node force-graph gave no pick color', () => {
      const ctx = { fillRect: jest.fn(), fillStyle: '#000001' } as unknown as CanvasRenderingContext2D;

      component['paintPointerArea'](component['nodes'][0], null, ctx);

      expect(ctx.fillRect).not.toHaveBeenCalled();
      expect(ctx.fillStyle).toEqual('#000001');
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

  describe('colors', () => {
    it('should fade the links as it zooms out', () => {
      const link: GraphLink<ArmoniKGraphNode> = { source: 'a', target: 'b', type: 'output' };
      component['scale'] = 10;
      const zoomedIn = component['getLinkColor'](link);
      component['scale'] = 0.01;
      const zoomedOut = component['getLinkColor'](link);

      expect(zoomedIn).not.toEqual(zoomedOut);
      expect(component['getLinkColor'](link)).toBe(zoomedOut);
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
