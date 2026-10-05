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
import { GraphRenderer } from './graph-renderer';
import { GraphComponent } from './graph.component';

// jsdom has no WebGL: a renderer that records what it is given.
const mockRenderer = {
  setNodes: jest.fn(),
  setNodeColor: jest.fn(),
  setPositions: jest.fn(),
  setFocus: jest.fn(),
  setLinks: jest.fn(),
  setLinkColors: jest.fn(),
  setHighlights: jest.fn(),
  resize: jest.fn(),
  render: jest.fn(),
  destroy: jest.fn(),
};
jest.mock('./graph-renderer', () => ({
  GraphRenderer: jest.fn(() => mockRenderer),
  TASK_SHAPE: 0,
  RESULT_SHAPE: 1,
}));

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
    // jsdom has no canvas either: the icons are drawn on nothing.
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
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

    it('should wait longer for the next layouts, the new nodes being placed meanwhile', () => {
      component['apply']([structure()]);
      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array(8) } } as MessageEvent);
      mockWorker.postMessage.mockClear();

      for (let elapsed = 0; elapsed < 30000; elapsed += 500) {
        component['apply']([structure()]);
        jest.advanceTimersByTime(500);
      }
      expect(mockWorker.postMessage).not.toHaveBeenCalled();

      for (let elapsed = 30000; elapsed < 61000; elapsed += 500) {
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
    beforeEach(() => {
      component['graphRef'] = { nativeElement: document.createElement('div') };
      component['canvasRef'] = { nativeElement: document.createElement('canvas') };
      component.updates = new Subject<GraphUpdate>();
    });

    it('should draw on the canvas of its template, which its styles size', () => {
      component.ngAfterViewInit();

      expect(GraphRenderer).toHaveBeenLastCalledWith(component['canvasRef']!.nativeElement, expect.anything());
      expect(component['graphRef']!.nativeElement.childElementCount).toEqual(0);
    });

    it('should create the renderer and follow the session', () => {
      component.ngAfterViewInit();

      expect(GraphRenderer).toHaveBeenCalled();
      expect(component['subscription'].closed).toBe(false);
    });

    it('should say why the graph cannot be drawn, and keep following the session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
      (GraphRenderer as unknown as jest.Mock).mockImplementationOnce(() => {
        throw new Error('WebGL2 is not available.');
      });
      component.ngAfterViewInit();

      expect(component.rendererError()).toEqual('WebGL2 is not available.');
      expect(component['subscription'].closed).toBe(false);
    });
  });

  describe('view', () => {
    const element = () => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'clientWidth', { value: 1080 });
      Object.defineProperty(div, 'clientHeight', { value: 680 });
      return div;
    };
    const pointer = (offsetX: number, offsetY: number, pointerId = 1, button = 0) => ({ offsetX, offsetY, pointerId, button }) as PointerEvent;
    // parent at the top, child 250 below it: drawn once laid out.
    const drawn = async (positions = [0, 0, 0, 180, 0, 250, 0, 320]) => {
      component['graphRef'] = { nativeElement: element() };
      component['canvasRef'] = { nativeElement: document.createElement('canvas') };
      component.updates = new Subject<GraphUpdate>();
      component.ngAfterViewInit();
      component['apply']([structure()]);
      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array(positions) } } as MessageEvent);
      jest.advanceTimersByTime(100);
    };

    it('should fit the graph without zooming in past its natural size', async () => {
      await drawn();

      expect(component['camera'].scale).toEqual(1);
      expect([component['camera'].x, component['camera'].y]).toEqual([0, 160]);
    });

    it('should zoom out as far as a very wide graph needs', async () => {
      await drawn([0, 0, 250000, 0, 0, 250, 0, 320]);

      // 1000 pixels for the graph and half a node on each side.
      expect(component['camera'].scale).toBeCloseTo(1000 / (250000 + NODE_SIZE));
    });

    it('should size the canvas as its container, not as the window', async () => {
      await drawn();

      expect(mockRenderer.resize).toHaveBeenCalledWith(1080, 680);
      expect(component['camera'].width).toEqual(1080);
    });

    it('should draw again as soon as the canvas is resized, which clears it, before the frame is shown', async () => {
      await drawn();
      mockRenderer.render.mockClear();

      component.onResize();

      expect(mockRenderer.resize).toHaveBeenLastCalledWith(1080, 680);
      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });

    it('should hand the renderer the nodes, their links and their places', async () => {
      await drawn();

      expect(mockRenderer.setNodes).toHaveBeenLastCalledWith(4, Uint8Array.from([0, 1, 0, 1]), expect.any(Uint8Array));
      expect(mockRenderer.setLinks).toHaveBeenLastCalledWith(3, Uint32Array.from([0, 1, 2]), Uint32Array.from([1, 2, 3]), expect.any(Uint8Array));
      expect(mockRenderer.setPositions).toHaveBeenLastCalledWith(Float32Array.from([0, 0, 0, 180, 0, 250, 0, 320]));
      expect(mockRenderer.render).toHaveBeenCalled();
    });

    it('should only write the colors of the nodes whose status changed', async () => {
      await drawn();
      mockRenderer.setNodeColor.mockClear();
      const update = structure();
      update.nodes[2].status = TaskStatus.TASK_STATUS_COMPLETED;

      component['apply']([{ ...update, kind: 'status' }]);

      expect(mockRenderer.setNodeColor).toHaveBeenCalledTimes(1);
      expect(mockRenderer.setNodeColor).toHaveBeenCalledWith(2, expect.any(Uint8Array));
    });

    it('should move the view with a drag, without taking it for a click', async () => {
      await drawn();
      const { x, y } = component['camera'];

      component['onPointerDown'](pointer(500, 300));
      component['onPointerMove']({ ...pointer(560, 280), buttons: 1 } as PointerEvent);
      component['onPointerUp'](pointer(560, 280));

      expect([component['camera'].x, component['camera'].y]).toEqual([x - 60, y + 20]);
    });

    it('should leave the other buttons to the browser, its menu included', async () => {
      await drawn();
      const { x, y, scale } = component['camera'];
      const [nodeX, nodeY] = component['camera'].toScreen(0, 250);

      component['onPointerDown'](pointer(nodeX, nodeY, 1, 2));
      component['onPointerUp'](pointer(nodeX, nodeY, 1, 2));
      jest.advanceTimersByTime(2000);
      // The menu opened on the press: no release comes, the pointer moves on with no button.
      component['onPointerDown'](pointer(500, 300, 1, 2));
      component['onPointerMove'](pointer(nodeX, nodeY));

      expect([component['camera'].x, component['camera'].y, component['camera'].scale]).toEqual([x, y, scale]);
      expect(component.tooltip()).toEqual(expect.objectContaining({ id: 'child' }));
    });

    it('should stop moving the view when the browser takes the pointer back', async () => {
      await drawn();
      const { x, y } = component['camera'];

      component['onPointerDown'](pointer(500, 300));
      component['onPointerCancel'](pointer(500, 300));
      component['onPointerMove'](pointer(560, 280));

      expect([component['camera'].x, component['camera'].y]).toEqual([x, y]);
    });

    it('should zoom with two fingers, between them, without taking it for a click', async () => {
      await drawn();
      const { scale } = component['camera'];

      component['onPointerDown'](pointer(440, 340, 1));
      component['onPointerDown'](pointer(640, 340, 2));
      const between = component['camera'].toGraph(540, 340);
      component['onPointerMove'](pointer(740, 340, 2));
      component['onPointerUp'](pointer(740, 340, 2));
      component['onPointerUp'](pointer(440, 340, 1));
      jest.advanceTimersByTime(2000);

      // 200 pixels apart, then 300: what was between the fingers stays between them.
      expect(component['camera'].scale).toBeCloseTo(scale * 1.5);
      const [x, y] = component['camera'].toScreen(...between);
      expect(x).toBeCloseTo(590);
      expect(y).toBeCloseTo(340);
    });

    it('should bring the whole graph back into the view', async () => {
      await drawn();
      const { x, y, scale } = component['camera'];
      component['onPointerDown'](pointer(500, 300));
      component['onPointerMove'](pointer(5000, 3000));
      component['onPointerUp'](pointer(5000, 3000));
      component['onWheel']({ offsetX: 540, offsetY: 340, deltaY: 1000, preventDefault: jest.fn() } as unknown as WheelEvent);

      component.center();

      expect([component['camera'].x, component['camera'].y, component['camera'].scale]).toEqual([x, y, scale]);
    });

    it('should zoom towards the pointer with the wheel', async () => {
      await drawn();
      const preventDefault = jest.fn();

      component['onWheel']({ offsetX: 540, offsetY: 340, deltaY: -100, preventDefault } as unknown as WheelEvent);

      expect(component['camera'].scale).toBeGreaterThan(1);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should follow the fingers pinching a trackpad', async () => {
      await drawn();
      const { scale } = component['camera'];

      // Fingers twice as far apart: the browser sends wheel events with the Ctrl key, their deltas
      // adding up to -100 ln 2.
      for (let event = 0; event < 16; event++) {
        component['onWheel']({ offsetX: 540, offsetY: 340, deltaY: -100 * Math.LN2 / 16, ctrlKey: true, preventDefault: jest.fn() } as unknown as WheelEvent);
      }

      expect(component['camera'].scale).toBeCloseTo(scale * 2);
    });

    it('should zoom on a clicked node', async () => {
      await drawn();
      // The child, at 0, 250: on screen, the centre of the view is at 0, 160.
      const [x, y] = component['camera'].toScreen(0, 250);

      component['onPointerDown'](pointer(x, y));
      component['onPointerUp'](pointer(x, y));
      jest.advanceTimersByTime(2000);

      expect([component['camera'].x, component['camera'].y]).toEqual([0, 250]);
      expect(component['camera'].scale).toEqual(4);
    });

    it('should fade what is not around the hovered node, and tell its id', async () => {
      await drawn();
      const [x, y] = component['camera'].toScreen(0, 0);

      component['onPointerMove'](pointer(x, y));

      expect(mockRenderer.setFocus).toHaveBeenLastCalledWith(Uint8Array.from([1, 1, 1, 0]));
      expect(component.tooltip()).toEqual(expect.objectContaining({ id: 'parent' }));
      component['onPointerLeave']();
      expect(mockRenderer.setFocus).toHaveBeenLastCalledWith(null);
      expect(component.tooltip()).toBeNull();
    });

    it('should keep the hovered node under the pointer while a layout moves it', async () => {
      await drawn();
      const [x, y] = component['camera'].toScreen(0, 0);
      component['onPointerMove'](pointer(x, y));

      component.redraw();
      mockWorker.onmessage!({ data: { positions: new Float64Array([400, 0, 400, 180, 400, 250, 400, 320]) } } as MessageEvent);
      jest.advanceTimersByTime(1000);

      expect(component['nodesById'].get('parent')!.x).toEqual(400);
      expect(component['camera'].toScreen(400, 0)).toEqual([x, y]);
      expect(component.tooltip()).toEqual(expect.objectContaining({ id: 'parent' }));
    });

    it('should not move the view with a layout when no node is hovered', async () => {
      await drawn();
      const { x, y } = component['camera'];

      component.redraw();
      mockWorker.onmessage!({ data: { positions: new Float64Array([400, 0, 400, 180, 400, 250, 400, 320]) } } as MessageEvent);
      jest.advanceTimersByTime(1000);

      expect([component['camera'].x, component['camera'].y]).toEqual([x, y]);
    });

    it('should mark the highlighted nodes with the complementary color of theirs', async () => {
      await drawn();
      component.highlightParentNodes = false;
      component.highlightChildrenNodes = false;

      component.highlightNodes('output');

      expect(mockRenderer.setHighlights).toHaveBeenLastCalledWith(Uint32Array.from([3]), Uint8Array.from([255, 0, 255, 255]));
    });

    it('should change the mark of a highlighted node with its status', async () => {
      await drawn();
      component.highlightParentNodes = false;
      component.highlightChildrenNodes = false;
      component.highlightNodes('child');
      mockStatuses.statusToLabel.mockReturnValue({ label: 'Completed', color: '#0000ff' });
      const update = structure();
      update.nodes[2].status = TaskStatus.TASK_STATUS_COMPLETED;

      component['apply']([{ ...update, kind: 'status' }]);

      expect(mockRenderer.setHighlights).toHaveBeenLastCalledWith(Uint32Array.from([2]), Uint8Array.from([255, 255, 0, 255]));
      mockStatuses.statusToLabel.mockReturnValue({ label: 'Completed', color: '#00ff00' });
    });

    it('should draw again once the browser gives a lost WebGL context back', async () => {
      await drawn();
      const { restored } = (GraphRenderer as unknown as jest.Mock).mock.lastCall[1];
      mockRenderer.render.mockClear();

      restored(null);
      jest.advanceTimersByTime(100);

      expect(mockRenderer.render).toHaveBeenCalled();
    });

    it('should say why the graph cannot be drawn once a lost WebGL context cannot be set up again', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
      await drawn();
      const { restored } = (GraphRenderer as unknown as jest.Mock).mock.lastCall[1];

      restored(new Error('The shaders do not compile.'));

      expect(component.rendererError()).toEqual('The shaders do not compile.');
    });

    it('should let the renderer go when left', async () => {
      await drawn();

      component.ngOnDestroy();

      expect(mockRenderer.destroy).toHaveBeenCalled();
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
      const fitView = jest.spyOn(component as unknown as { fitView: () => void }, 'fitView');
      jest.advanceTimersByTime(5000);

      streams[0].next(structure());
      // A batch, then the quiet time before the layout.
      jest.advanceTimersByTime(1500);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);

      expect(fitView).toHaveBeenCalled();
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
      mockWorker.onmessage!({ data: { error: 'The layout exploded' } } as MessageEvent);

      expect(component.layoutError()).toEqual('The layout exploded');
      expect(component.layingOut()).toBe(false);
      component.redraw();
      expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
    });

    it('should lay out a change that came in during the failed run', () => {
      component.redraw();
      mockWorker.onmessage!({ data: { error: 'The layout exploded' } } as MessageEvent);
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

    it('should put new subtasks at the end of the first row of their family, their data around them', () => {
      const update = laidOut();
      addTask(update, 'sibling-1', 'parent');
      addTask(update, 'sibling-2', 'parent');
      component['apply']([update]);

      // child is at 0, 250: its siblings go on to its right.
      expect(place(update, 'sibling-1')).toEqual([80, 250]);
      expect(place(update, 'sibling-1-payload')).toEqual([80, 180]);
      expect(place(update, 'sibling-1-output')).toEqual([80, 320]);
      expect(place(update, 'sibling-2')).toEqual([160, 250]);
    });

    it('should put the first subtask of a task below it', () => {
      const update = laidOut();
      addTask(update, 'grandchild', 'child');
      component['apply']([update]);

      expect(place(update, 'grandchild')).toEqual([0, 500]);
    });

    it('should put a chain of thousands of new subtasks from its placed end, without recursion', () => {
      const update = laidOut();
      addTask(update, 'chain-0', 'child');
      for (let index = 1; index < 10000; index++) {
        addTask(update, `chain-${index}`, `chain-${index - 1}`);
      }
      component['apply']([update]);

      expect(place(update, 'chain-9999')).toEqual([0, 250 + 10000 * 250]);
    });

    it('should put an aggregation below what it gathers, centred on it', () => {
      const update = laidOut();
      addTask(update, 'sibling', 'parent');
      addTask(update, 'gather', 'parent');
      update.links.push(
        { source: 'output', target: 'gather', type: 'dependency' },
        { source: 'sibling-output', target: 'gather', type: 'dependency' },
      );
      component['apply']([update]);

      // child at 0 and sibling at 80, on the row at 250.
      expect(place(update, 'gather')).toEqual([40, 500]);
    });

    it('should put a task the client submitted below the data it uploaded, which has no producer', () => {
      const update = laidOut();
      addTask(update, 'consumer');
      update.links.push({ source: 'payload-child', target: 'consumer', type: 'dependency' });
      component['apply']([update]);

      expect(place(update, 'consumer')).toEqual([0, 180 + 250]);
    });

    it('should move a task that arrived before its links to its parent once they come', () => {
      // A result names its owner before the task itself arrives.
      const update = laidOut();
      update.nodes.push(
        { id: 'early-output', type: 'result', status: ResultStatus.RESULT_STATUS_CREATED },
        { id: 'early', type: 'task', status: TaskStatus.TASK_STATUS_UNSPECIFIED },
      );
      update.links.push({ source: 'early', target: 'early-output', type: 'output' });
      component['apply']([update]);
      expect(place(update, 'early')[1]).toEqual(0);
      expect(place(update, 'early')[0]).toBeGreaterThan(100 + NODE_SIZE);

      update.nodes.push({ id: 'early-payload', type: 'result', status: ResultStatus.RESULT_STATUS_COMPLETED });
      update.links.push(
        { source: 'early-payload', target: 'early', type: 'payload' },
        { source: 'child', target: 'early-payload', type: 'parent' },
      );
      component['apply']([update]);

      // child had no subtask: the first one goes below it.
      expect(place(update, 'early')).toEqual([0, 500]);
      expect(place(update, 'early-payload')).toEqual([0, 430]);
      expect(place(update, 'early-output')).toEqual([0, 570]);
    });

    it('should put a new root to the right of the graph, on its top row', () => {
      const update = laidOut();
      addTask(update, 'root');
      component['apply']([update]);

      const [x, y] = place(update, 'root');
      expect(x).toBeGreaterThan(100 + NODE_SIZE);
      expect(y).toEqual(0);
      expect(place(update, 'root-payload')).toEqual([x, y! - 70]);
      expect(place(update, 'root-output')).toEqual([x, y! + 70]);
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

      // To the right of child, the other subtask of parent.
      const late = update.nodes.find(node => node.id === 'late')!;
      expect([late.x, late.y]).toEqual([5080, 250]);
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
      expect([late.x, late.y]).toEqual([5080, 250]);
      expect([parent.x, parent.y]).toEqual([5000, 0]);
    });
  });

  describe('highlight before the first layout', () => {
    it('should wait for the layout to centre on a single match and highlight its ancestors', () => {
      const moveCamera = jest.spyOn(component as unknown as { moveCamera: () => void }, 'moveCamera');
      component.highlightParentNodes = true;
      component['apply']([structure()]);

      expect(() => component.highlightNodes('output')).not.toThrow();
      expect(moveCamera).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      mockWorker.onmessage!({ data: { positions: new Float64Array([0, 0, 0, 180, 0, 250, 0, 320]) } } as MessageEvent);

      expect(moveCamera).toHaveBeenCalledWith(0, 320, expect.any(Number), 500);
      expect(component['nodesToHighlight']).toEqual(new Set(['output', 'child', 'payload-child', 'parent']));
    });
  });

  describe('highlight', () => {
    beforeEach(() => {
      component['laidOut'] = true;
      component['apply']([structure()]);
    });

    it('should highlight the nodes whose id holds the search', () => {
      component.highlightChildrenNodes = false;
      component.highlightNodes('chil');

      expect([...component['nodesToHighlight']]).toEqual(['payload-child', 'child']);
      expect(component.matches()).toEqual(['payload-child', 'child']);
    });

    it('should find a pasted id alone, not the ids that hold it', () => {
      component.highlightParentNodes = false;
      component.highlightChildrenNodes = false;
      component.highlightNodes('child');

      expect(component.matches()).toEqual(['child']);
    });

    it('should search once typing pauses, not on every key', () => {
      component.searchChanged('chi');
      component.searchChanged('chil');
      expect(component.matches()).toEqual([]);

      jest.advanceTimersByTime(300);
      expect(component.matches()).toEqual(['payload-child', 'child']);
    });

    it('should search at once on Enter', () => {
      component.searchChanged('chil');
      component.searchNow('output');

      expect(component.matches()).toEqual(['output']);
      jest.advanceTimersByTime(300);
      expect(component.matches()).toEqual(['output']);
    });

    it('should go from a match to the next and back, centring on each', () => {
      component['nodes'].forEach((node, index) => component['setPosition'](node, index * 100, 0));
      const moveCamera = jest.spyOn(component as unknown as { moveCamera: () => void }, 'moveCamera');
      component.highlightNodes('chil');
      expect(moveCamera).toHaveBeenLastCalledWith(100, 0, expect.any(Number), 500);

      component.nextMatch();
      expect(component.matchIndex()).toEqual(1);
      expect(moveCamera).toHaveBeenLastCalledWith(200, 0, expect.any(Number), 500);

      component.nextMatch();
      expect(component.matchIndex()).toEqual(0);
      component.previousMatch();
      expect(component.matchIndex()).toEqual(1);
    });

    it('should tell a search that matches nothing', () => {
      component.highlightNodes('nothing');

      expect(component.matches()).toEqual([]);
      expect(component.searched()).toEqual('nothing');
    });

    it('should highlight the ancestors and descendants of a single match', () => {
      component.highlightParentNodes = true;
      component.highlightChildrenNodes = true;
      component.highlightNodes('output');

      expect(component['nodesToHighlight']).toEqual(new Set(['output', 'child', 'payload-child', 'parent']));
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
