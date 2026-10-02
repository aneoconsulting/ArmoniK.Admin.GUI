import { ResultStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { KeyValuePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ArmoniKGraphNode, GraphLink, GraphUpdate, LinkType } from '@app/types/graph.types';
import { SpinnerComponent } from '@components/spinner.component';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { Observable, Subscription, bufferTime, filter, retry, tap, timer } from 'rxjs';
import { Coordinates, DATA_ROW_OFFSET, LAYER_STEP, LayoutAlgorithm, LayoutInput, LayoutResponse, NODE_GAP, NODE_SIZE, SLOT, push } from './graph-layout';
import { createLayoutWorker } from './graph-layout-worker.factory';
import { GraphLegendComponent } from './graph-legend.component';
import { GraphRenderer, RESULT_SHAPE, TASK_SHAPE } from './graph-renderer';
import { Camera, NodeGrid } from './graph-view';

type Node = ArmoniKGraphNode;
type Link = GraphLink<Node>;

/** What the debug panel shows, refreshed every DEBUG_REFRESH_MS while it is open. */
export type GraphDebug = {
  tasks: number;
  results: number;
  links: Record<LinkType, number>;
  events: {
    structure: number;
    status: number;
    perSecond: number;
    /** Seconds after which the initial graph was over, null while it is still arriving. */
    initialGraphSeconds: number | null;
  };
  layout: {
    state: 'waiting' | 'running' | 'laid-out';
    runs: number;
    lastSeconds: number | null;
    runningSeconds: number | null;
    /** Nodes added since the last layout, put on placed ones until it runs again. */
    waitingNodes: number;
  };
  rendering: {
    framesPerSecond: number;
    drawsPerSecond: number;
    drawMs: number;
    lastBatchMs: number;
    heapMb: number | null;
  };
};

/** Events are handled in batches: the initial graph alone is thousands of them. */
const BATCH_MS = 250;
/** The layout runs once the structure has stopped changing for this long… */
const QUIET_MS = 1000;
/**
 * …or this long after the first change, for a running session never stops changing. New nodes
 * are put in their families meanwhile, close to where the layout would put them: it can wait.
 */
const MAX_WAIT_MS = 60000;
/**
 * The same cap while the initial graph arrives, wider: laying it out before its end means laying
 * it out twice, but a session never quiet enough to end it must still show up.
 */
const INITIAL_MAX_WAIT_MS = 30000;
/** Delays before reconnecting to the events: doubling from the first, up to the last. */
const RECONNECT_FIRST_MS = 1000;
const RECONNECT_MAX_MS = 30000;
/** Refresh period of the loading counters. */
const LOADING_REFRESH_MS = 500;
/**
 * A session with nothing in it sends no event at all: once nothing has come for this long, it is
 * shown empty. What comes later is placed as it would be after a layout.
 */
const EMPTY_SESSION_MS = 5000;
/**
 * The events start with the whole current graph, thousands per batch, then trickle. A batch with
 * fewer events than this tells the initial graph is over. All events count, not only structural
 * ones: the initial graph sends results its tasks already brought in, which change no structure.
 */
const INITIAL_BATCH_SIZE = 200;
/** Refresh period of the debug panel. */
const DEBUG_REFRESH_MS = 1000;
/** Duration of the move of the nodes to the places the layout gave them. */
const ANIMATION_MS = 600;
/** However far zoomed out, a node stays this wide on screen. */
const MIN_NODE_SCREEN_SIZE = 2;
/** Fitting a small graph to the view stops at this zoom: a single task would fill the screen. */
const MAX_FIT_ZOOM = 1;
/** The zoom a click on a node goes to, and how long it takes. */
const CLICK_ZOOM = 4;
const CLICK_ZOOM_MS = 1000;
/** A press that moves less than this, in pixels, is a click, not a drag. */
const CLICK_TOLERANCE = 4;
/** How much a notch of the wheel zooms. */
const WHEEL_ZOOM = 0.0015;
/** The pointer picks a node this close, in pixels, when the node is smaller on screen. */
const PICK_RADIUS = 6;
/** Space left around the graph when it is fitted to the view. */
const FIT_PADDING = 40;
/** Smallest size on screen of the mark of a highlighted node, however far zoomed out. */
const HIGHLIGHT_SCREEN_SIZE = 12;
/** Opacity of what is not around the hovered node. */
const FADED_ALPHA = 0.08;
/**
 * The search runs once typing pauses for this long, or on Enter: going through hundreds of
 * thousands of ids on every key would not keep up.
 */
const SEARCH_DELAY_MS = 300;
/** How far the hovered node's neighbourhood reaches: task → data → task. */
const HOVER_DEPTH = 2;

/**
 * Draws the graph of a session. Nodes are placed by a layout in a worker, not by a simulation.
 * Nothing is drawn until its first layout, which shows the whole graph at once; the nodes added
 * since are put in their families, as the layout would put them, until it runs again.
 */
@Component({
  selector: 'app-graph',
  templateUrl: 'graph.component.html',
  styleUrl: 'graph.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterModule,
    GraphLegendComponent,
    MatTooltipModule,
    KeyValuePipe,
    PrettyPipe,
    SpinnerComponent,
  ],
  providers: [
    TasksStatusesService,
    ResultsStatusesService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) updates: Observable<GraphUpdate>;
  @Input({ required: true }) sessionId: string;

  @ViewChild('graph', { static: false }) private graphRef: ElementRef<HTMLDivElement> | null = null;

  private renderer: GraphRenderer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private readonly camera = new Camera();
  private renderFrame = 0;
  private cameraFrame = 0;
  /** Why the graph cannot be drawn, null while it can. */
  readonly rendererError = signal<string | null>(null);
  /** The id of the node under the pointer, and where to show it. */
  readonly tooltip = signal<{ id: string, x: number, y: number } | null>(null);

  highlightParentNodes = false;
  highlightChildrenNodes = false;
  private readonly nodesToHighlight = new Set<string>();
  private nodeToHighlight: string | null = null;

  colorMap: Record<LinkType, string>;

  private readonly iconsService = inject(IconsService);
  private readonly tasksStatusesService = inject(TasksStatusesService);
  private readonly resultsStatusesService = inject(ResultsStatusesService);
  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly clipboard = inject(Clipboard);

  private readonly subscription = new Subscription();
  private resizeObserver: ResizeObserver | null = null;

  private nodes: Node[] = [];
  private links: Link[] = [];
  private predecessors = new Map<string, string[]>();
  private successors = new Map<string, string[]>();
  private nodesById = new Map<string, Node>();

  /** What the search matches, the one shown, and what was searched. */
  readonly matches = signal<string[]>([]);
  readonly matchIndex = signal<number>(0);
  readonly searched = signal<string>('');
  private searchTimer: ReturnType<typeof setTimeout> | undefined;
  readonly nodeCount = signal<number>(0);
  readonly layingOut = signal<boolean>(false);
  /** Why the events stream was lost, null while it is up. */
  readonly streamError = signal<string | null>(null);
  /** Why the last layout failed, null when it did not. */
  readonly layoutError = signal<string | null>(null);
  /** What arrived so far, shown instead of the graph until its first layout. Null once shown. */
  readonly loading = signal<{ tasks: number, results: number, seconds: number } | null>({ tasks: 0, results: 0, seconds: 0 });
  private loadingInterval: ReturnType<typeof setInterval> | undefined;
  private emptyTimer: ReturnType<typeof setTimeout> | undefined;
  readonly highlightLabel = $localize`Highlight a task`;

  readonly debugEnabled = signal<boolean>(false);
  /** Offered in the debug options, to compare the layout of our own with ELK. */
  readonly layoutAlgorithm = signal<LayoutAlgorithm>('layered');
  readonly debug = signal<GraphDebug | null>(null);
  private readonly createdAt = Date.now();
  private readonly eventCounts = { structure: 0, status: 0 };
  private eventsAtLastTick = 0;
  private initialGraphEndedAt: number | null = null;
  private layoutRuns = 0;
  private layoutStartedAt: number | null = null;
  private lastLayoutMs: number | null = null;
  private lastLayoutNodes = 0;
  private lastBatchMs = 0;
  private frames = 0;
  private drawStart = 0;
  private drawDurations: number[] = [];
  private debugInterval: ReturnType<typeof setInterval> | undefined;
  private debugFrame = 0;

  /** Whether the layout has placed the graph once: until then, nothing is drawn. */
  private laidOut = false;
  private layoutTimer: ReturnType<typeof setTimeout> | undefined;
  /** When the first change not laid out yet happened. */
  private firstChangeAt: number | null = null;
  /** Whether the initial graph is still arriving: the wait is not capped until it is over. */
  private initialGraph = true;
  /** Batches received so far: the first one tells nothing, see applyBatch. */
  private batches = 0;
  /**
   * Nodes given a position by this component. Not `x !== undefined`: the renderer gives a position
   * of its own, on a spiral around the origin, to any node that reaches it without one.
   */
  private readonly placed = new Set<string>();
  /**
   * Nodes put on the top row for want of a placed node to be put on. A node can arrive before
   * its links: a result names its owner before the task itself arrives. Such nodes are placed again
   * on each change, until they can go with the node they belong to.
   */
  private unanchored = new Set<string>();
  /** Kept from one layout to the next: a new one would load its script again. */
  private worker: Worker | null = null;
  private layoutRunning = false;
  /** The structure changed while the layout was running: its result is already out of date. */
  private layoutPending = false;
  private animationFrame = 0;
  /** Where the nodes being moved go: a node arriving meanwhile is put where its parent goes. */
  private animationTargets: Coordinates | null = null;

  private hovered: Set<string> | null = null;
  private hoveredNode: Node | null = null;
  /** What the renderer was given: the index of each node is its index in `nodes`. */
  private readonly nodeIndex = new Map<string, number>();
  private drawnStatuses: Node['status'][] = [];
  private positions = new Float32Array(0);
  /** The nodes by place, for the pointer; built again once the nodes have moved. */
  private grid: NodeGrid | null = null;
  /** Colors as bytes, by CSS color. */
  private readonly rgbaCache = new Map<string, Uint8Array>();
  private readonly pointer = { down: false, moved: false, x: 0, y: 0, startX: 0, startY: 0 };

  ngOnInit(): void {
    const storedColorMap = this.storageService.getItem<Record<LinkType, string>>('graph-links-colors', true) as Record<LinkType, string> | null;
    // Stored maps may predate a link type.
    this.colorMap = { ...this.defaultConfigService.defaultGraphLinksColors, ...storedColorMap };

    const storedHighlightParents = this.storageService.getItem<boolean>('graph-highlight-parents', true) as boolean;
    this.highlightParentNodes = storedHighlightParents ?? this.defaultConfigService.defaultGraphHighlightParents;

    const storedHighlightChildren = this.storageService.getItem<boolean>('graph-highlight-children', true) as boolean;
    this.highlightChildrenNodes = storedHighlightChildren ?? this.defaultConfigService.defaultGraphHighlightChildren;

    const storedDebug = this.storageService.getItem<boolean>('graph-debug', true) as boolean | null;
    this.setDebug(storedDebug ?? this.defaultConfigService.defaultGraphDebug);

    this.loadingInterval = setInterval(() => this.refreshLoading(), LOADING_REFRESH_MS);
  }

  ngAfterViewInit(): void {
    if (!this.graphRef) {
      return;
    }

    const element = this.graphRef.nativeElement;
    this.canvas = document.createElement('canvas');
    element.appendChild(this.canvas);
    try {
      this.renderer = new GraphRenderer(this.canvas, {
        nodeSize: NODE_SIZE,
        // In screen pixels whatever the zoom: thick lines over thousands of links cover the whole
        // overview, so they get thinner as it zooms out.
        linkWidth: NODE_SIZE / 12,
        minLinkPixels: 1,
        maxLinkPixels: 4,
        minNodePixels: MIN_NODE_SCREEN_SIZE,
        minHighlightPixels: HIGHLIGHT_SCREEN_SIZE,
        fadedAlpha: FADED_ALPHA,
      });
    } catch (error) {
      console.error(error);
      this.rendererError.set(String((error as Error)?.message ?? error));
    }
    this.setLinkColors();
    this.onResize();
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });

    // The canvas follows its container, which the window does not always move: the sidebar folds.
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(element);
    }

    this.listen();
  }

  /**
   * A lost stream is opened again: a new one starts with the whole current graph, which the
   * service merges with what it has. Without it, the graph would freeze until the page reloads.
   */
  private listen(): void {
    this.emptyTimer = setTimeout(() => {
      if (this.nodes.length === 0 && !this.laidOut) {
        this.laidOut = true;
        this.loading.set(null);
        this.display();
      }
    }, EMPTY_SESSION_MS);
    this.subscription.add(this.updates.pipe(
      tap(() => {
        if (this.streamError() !== null) {
          this.streamError.set(null);
        }
      }),
      retry({
        delay: (error: unknown, attempt: number) => {
          const message = (error as { statusMessage?: string, message?: string })?.statusMessage || (error as Error)?.message || String(error);
          console.error(error);
          this.streamError.set(message);
          return timer(Math.min(RECONNECT_FIRST_MS * 2 ** (attempt - 1), RECONNECT_MAX_MS));
        },
        resetOnSuccess: true,
      }),
      bufferTime(BATCH_MS),
      filter(batch => batch.length !== 0),
    ).subscribe(batch => this.apply(batch)));
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.setDebug(false);
    clearInterval(this.loadingInterval);
    this.subscription.unsubscribe();
    clearTimeout(this.layoutTimer);
    clearTimeout(this.emptyTimer);
    clearTimeout(this.searchTimer);
    cancelAnimationFrame(this.animationFrame);
    cancelAnimationFrame(this.renderFrame);
    cancelAnimationFrame(this.cameraFrame);
    this.worker?.terminate();
    this.renderer?.destroy();
    this.renderer = null;
  }

  /**
   * Places the graph again from scratch.
   */
  redraw(): void {
    this.runLayout();
  }

  /**
   * A layout can take minutes on a large graph, and a worker in a layout cannot be interrupted,
   * only replaced.
   */
  cancelLayout(): void {
    this.layoutFailed($localize`The layout was cancelled.`, true);
  }

  /**
   * Returns the associated icon
   * @param name string | undefined, icon to search 
   * @returns string
   */
  getIcon(name: string | undefined): string {
    return this.iconsService.getIcon(name);
  }

  /**
   * Copy the Id of the session
   */
  copySessionId() {
    this.clipboard.copy(this.sessionId);
  }

  /**
   * Updates and stores highlightParentNodes.
   * @param checked boolean
   */
  toggleHighlightParentNodes(checked: boolean) {
    this.highlightParentNodes = checked;
    this.storageService.setItem('graph-highlight-parents', checked);
    if (this.nodeToHighlight !== null) {
      this.highlightNodes(this.nodeToHighlight);
    }
  }

  /**
   * Updates and stores highlightChildrenNodes.
   * @param checked boolean
   */
  toggleHighlightChildrenNodes(checked: boolean) {
    this.highlightChildrenNodes = checked;
    this.storageService.setItem('graph-highlight-children', checked);
    if (this.nodeToHighlight !== null) {
      this.highlightNodes(this.nodeToHighlight);
    }
  }

  /**
   * Returns the complementary color of the provided color
   * @param color hexadecimal color
   * @returns hexadecimal color
   */
  getComplementaryColor(color: string) {
    const colorHex = color.replace('#', '');
    const colorDec = Number.parseInt(colorHex, 16);
    let complementaryHex = ((1 << 4 * colorHex.length) - 1 - colorDec).toString(16);

    while (complementaryHex.length < colorHex.length) {
      complementaryHex = '0' + complementaryHex;
    }
    return '#' + complementaryHex;
  }

  /** A search once typing pauses. */
  searchChanged(value: string): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.highlightNodes(value), SEARCH_DELAY_MS);
  }

  /** A search now, on Enter. */
  searchNow(value: string): void {
    clearTimeout(this.searchTimer);
    this.highlightNodes(value);
  }

  nextMatch(): void {
    this.showMatch((this.matchIndex() + 1) % this.matches().length);
  }

  previousMatch(): void {
    this.showMatch((this.matchIndex() - 1 + this.matches().length) % this.matches().length);
  }

  /**
   * Highlights the nodes whose id contains the searched value, and centres on the first of them.
   * A pasted id is found at once; a part of one, by going through them all. When a single node
   * matches, its ancestors and descendants are highlighted too, as configured.
   */
  highlightNodes(searchedValue: string) {
    this.nodesToHighlight.clear();
    this.nodeToHighlight = searchedValue;
    this.searched.set(searchedValue);
    const found: string[] = [];
    if (searchedValue !== '') {
      // Indexed once laid out; before, the nodes are only counted.
      if (this.nodesById.has(searchedValue) || (!this.laidOut && this.nodes.some(node => node.id === searchedValue))) {
        found.push(searchedValue);
      } else {
        for (const node of this.nodes) {
          if (node.id.includes(searchedValue)) {
            found.push(node.id);
          }
        }
      }
    }
    this.matches.set(found);
    found.forEach(id => this.nodesToHighlight.add(id));
    // Before the first layout nothing is indexed nor placed: the search is applied again after it.
    if (found.length === 1 && this.laidOut) {
      const [nodeId] = found;
      if (this.highlightParentNodes) {
        this.reach(nodeId, this.predecessors, Infinity).forEach(id => this.nodesToHighlight.add(id));
      }
      if (this.highlightChildrenNodes) {
        this.reach(nodeId, this.successors, Infinity).forEach(id => this.nodesToHighlight.add(id));
      }
    }
    this.syncHighlights();
    this.showMatch(0);
  }

  /** Centres the view on a match. */
  private showMatch(index: number): void {
    this.matchIndex.set(index);
    const node = this.laidOut ? this.nodesById.get(this.matches()[index]) : undefined;
    if (node?.x !== undefined && node.y !== undefined) {
      this.moveCamera(node.x, node.y, this.camera.scale, 500);
    }
    this.requestRender();
  }

  /**
   * Handles the resize event (zoom in or out)
   */
  onResize(): void {
    const element = this.graphRef?.nativeElement;
    if (element) {
      this.camera.resize(element.clientWidth, element.clientHeight);
      this.renderer?.resize(element.clientWidth, element.clientHeight);
      this.requestRender();
    }
  }

  /** The graph in the view, its nodes whole, zoomed in no further than MAX_FIT_ZOOM. */
  private fitView(): void {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const node of this.nodes) {
      if (node.x !== undefined && node.y !== undefined) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
      }
    }
    if (!Number.isFinite(minX)) {
      return;
    }
    const margin = NODE_SIZE / 2;
    this.camera.fit(minX - margin, maxX + margin, minY - margin, maxY + margin, FIT_PADDING, MAX_FIT_ZOOM);
    this.requestRender();
  }

  /** Lays the graph out again with the chosen algorithm. */
  setLayoutAlgorithm(algorithm: LayoutAlgorithm): void {
    this.layoutAlgorithm.set(algorithm);
    this.runLayout();
  }

  toggleDebug(checked: boolean): void {
    this.storageService.setItem('graph-debug', checked);
    this.setDebug(checked);
  }

  /** The panel costs nothing while closed: nothing is counted per frame, nothing is refreshed. */
  private setDebug(enabled: boolean): void {
    this.debugEnabled.set(enabled);
    clearInterval(this.debugInterval);
    cancelAnimationFrame(this.debugFrame);
    if (!enabled) {
      this.debug.set(null);
      return;
    }
    const countFrame = () => {
      this.frames++;
      this.debugFrame = requestAnimationFrame(countFrame);
    };
    this.debugFrame = requestAnimationFrame(countFrame);
    this.refreshDebug();
    this.debugInterval = setInterval(() => this.refreshDebug(), DEBUG_REFRESH_MS);
  }

  private refreshDebug(): void {
    const links: Record<LinkType, number> = { parent: 0, dependency: 0, output: 0, payload: 0 };
    for (const link of this.links) {
      links[link.type]++;
    }
    const tasks = this.nodes.filter(node => node.type === 'task').length;
    const events = this.eventCounts.structure + this.eventCounts.status;
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    const seconds = (from: number | null, to: number = Date.now()) => (from === null ? null : (to - from) / 1000);

    this.debug.set({
      tasks,
      results: this.nodes.length - tasks,
      links,
      events: {
        ...this.eventCounts,
        perSecond: Math.round((events - this.eventsAtLastTick) * 1000 / DEBUG_REFRESH_MS),
        initialGraphSeconds: this.initialGraphEndedAt === null ? null : seconds(this.createdAt, this.initialGraphEndedAt),
      },
      layout: {
        state: this.layoutRunning ? 'running' : this.laidOut ? 'laid-out' : 'waiting',
        runs: this.layoutRuns,
        lastSeconds: this.lastLayoutMs === null ? null : this.lastLayoutMs / 1000,
        runningSeconds: seconds(this.layoutStartedAt),
        waitingNodes: this.laidOut ? Math.max(0, this.nodes.length - this.lastLayoutNodes) : this.nodes.length,
      },
      rendering: {
        framesPerSecond: this.frames,
        drawsPerSecond: this.drawDurations.length,
        drawMs: this.drawDurations.length === 0 ? 0 : this.drawDurations.reduce((sum, value) => sum + value, 0) / this.drawDurations.length,
        lastBatchMs: this.lastBatchMs,
        heapMb: memory ? memory.usedJSHeapSize / 1024 / 1024 : null,
      },
    });
    this.eventsAtLastTick = events;
    this.frames = 0;
    this.drawDurations = [];
  }

  private apply(batch: GraphUpdate[]): void {
    const start = performance.now();
    for (const update of batch) {
      this.eventCounts[update.kind]++;
    }
    this.applyBatch(batch);
    this.lastBatchMs = performance.now() - start;
  }

  private applyBatch(batch: GraphUpdate[]): void {
    const last = batch[batch.length - 1];
    // Copies: the service keeps adding to its arrays as events arrive, and the renderer reads them
    // a moment later. Nodes added in between would reach it without a position.
    this.nodes = [...last.nodes];
    this.links = [...last.links];

    const structural = batch.filter(update => update.kind === 'structure').length;
    // The first batch is often cut short: its window opened with the subscription, not with the
    // first event, so it being small does not tell the initial graph is over.
    if (this.initialGraph && this.batches++ > 0 && batch.length < INITIAL_BATCH_SIZE) {
      this.initialGraph = false;
      this.initialGraphEndedAt = Date.now();
      // The capped wait starts now, not with the first event of the initial graph.
      this.firstChangeAt = null;
    }
    if (structural === 0) {
      this.syncStatuses();
      this.requestRender();
      return;
    }

    this.nodeCount.set(this.nodes.length);
    // Until the first layout the nodes are only counted: a placement shown meanwhile would cost a
    // pass over the whole graph on every batch, and the whole graph would move once laid out.
    if (this.laidOut) {
      this.display();
    }
    this.scheduleLayout();
  }

  /** Hands the graph to the renderer, the nodes without a place put on placed ones. */
  private display(): void {
    this.indexGraph();
    const unanchored = this.unanchored;
    this.unanchored = new Set();
    this.placeNew(this.incrementalCoordinates(id => {
      if (unanchored.has(id)) {
        return undefined;
      }
      const node = this.nodesById.get(id)!;
      return this.animationTargets?.get(id) ?? (this.placed.has(id) ? [node.x!, node.y!] : undefined);
    }), unanchored);
    this.syncGraph();
  }

  private refreshLoading(): void {
    if (!this.loading()) {
      clearInterval(this.loadingInterval);
      return;
    }
    const tasks = this.nodes.filter(node => node.type === 'task').length;
    this.loading.set({ tasks, results: this.nodes.length - tasks, seconds: (Date.now() - this.createdAt) / 1000 });
  }

  /**
   * The initial graph arrives in one go and has an end: while it arrives the wait is capped wider,
   * or the layout would run on half of it, then again on the whole.
   */
  private scheduleLayout(): void {
    const now = Date.now();
    this.firstChangeAt ??= now;
    const cap = this.initialGraph ? INITIAL_MAX_WAIT_MS : MAX_WAIT_MS;
    const delay = Math.min(QUIET_MS, this.firstChangeAt + cap - now);
    clearTimeout(this.layoutTimer);
    this.layoutTimer = setTimeout(() => {
      this.firstChangeAt = null;
      this.runLayout();
    }, delay);
  }

  /** Runs the layout in a worker, then moves the nodes to the places it gave them. */
  private runLayout(): void {
    if (this.layoutRunning) {
      this.layoutPending = true;
      return;
    }
    const input = this.layoutInput();
    this.layingOut.set(true);
    this.layoutError.set(null);
    this.layoutRuns++;
    this.layoutStartedAt = Date.now();
    this.layoutRunning = true;
    this.worker ??= createLayoutWorker();
    const startedAt = this.layoutStartedAt;
    this.worker.onmessage = ({ data }: MessageEvent<LayoutResponse>) => {
      if ('error' in data) {
        this.layoutFailed(data.error, false);
        return;
      }
      this.endLayout();
      this.lastLayoutMs = Date.now() - startedAt;
      // Laid out only when shown empty: this is the first graph to fit in the view.
      const shownEmpty = this.laidOut && this.lastLayoutNodes === 0;
      this.lastLayoutNodes = input.nodes.length;
      const targets: Coordinates = new Map();
      input.nodes.forEach((id, index) => targets.set(id, [data.positions[index * 2], data.positions[index * 2 + 1]]));
      if (this.laidOut) {
        // Nodes that arrived during the run were placed against positions it replaces: they are
        // placed again against the new ones, and move with them.
        for (const node of this.nodes) {
          if (!targets.has(node.id)) {
            this.placed.delete(node.id);
          }
        }
        this.indexGraph();
        this.unanchored = new Set();
        this.animateTo(this.incrementalCoordinates(id => targets.get(id)));
        if (shownEmpty) {
          this.fitView();
        }
      } else {
        // The first layout shows the graph at once, the nodes that arrived meanwhile included.
        this.laidOut = true;
        for (const node of this.nodes) {
          const target = targets.get(node.id);
          if (target) {
            this.setPosition(node, target[0], target[1]);
          }
        }
        this.display();
        this.loading.set(null);
        this.fitView();
        if (this.nodeToHighlight !== null) {
          this.highlightNodes(this.nodeToHighlight);
        }
      }
      if (this.layoutPending) {
        this.layoutPending = false;
        this.scheduleLayout();
      }
    };
    // Also what happens when the worker cannot even load, its script gone after a deployment: the
    // event then has no message.
    this.worker.onerror = event => this.layoutFailed(event.message || $localize`The layout could not run.`, true);
    this.worker.postMessage(input);
  }

  /**
   * Nothing is drawn until a first layout succeeds, so its failure must show, and leave a way to
   * try again. A change that came in meanwhile gets its layout anyway.
   */
  private layoutFailed(message: string, replaceWorker: boolean): void {
    this.endLayout();
    if (replaceWorker) {
      this.worker?.terminate();
      this.worker = null;
    }
    console.error(message);
    this.layoutError.set(message);
    if (this.layoutPending) {
      this.layoutPending = false;
      this.scheduleLayout();
    }
  }

  private endLayout(): void {
    this.layoutRunning = false;
    this.layoutStartedAt = null;
    this.layingOut.set(false);
  }

  private layoutInput(): LayoutInput {
    return {
      algorithm: this.layoutAlgorithm(),
      nodes: this.nodes.map(node => node.id),
      types: this.nodes.map(node => node.type),
      links: this.links.map(link => ({ source: endId(link.source), target: endId(link.target), type: link.type })),
    };
  }

  /**
   * Nodes added since the last layout, put in their families until it runs again, as it would
   * place them: a subtask at the end of the first row of its family, or the first one below its
   * parent; an aggregation, or a task the client submitted, below what it reads; a payload above
   * its task, outputs below it. Nodes with nothing placed to go with go to the right of the graph,
   * on its top row, and are kept in `unanchored`. `positionOf` gives the nodes already placed,
   * undefined for the others. They may overlap other families until the next layout.
   */
  private incrementalCoordinates(positionOf: (id: string) => [number, number] | undefined): Coordinates {
    const payloads = new Map<string, string>();
    const parents = new Map<string, string>();
    const owners = new Map<string, string>();
    const outputs = new Map<string, string[]>();
    const fed = new Map<string, string>();
    const inputs = new Map<string, string[]>();
    for (const link of this.links) {
      const source = endId(link.source);
      const target = endId(link.target);
      if (link.type === 'payload') {
        payloads.set(target, source);
        fed.set(source, target);
      } else if (link.type === 'parent') {
        parents.set(target, source);
      } else if (link.type === 'output') {
        owners.set(target, source);
        push(outputs, source, target);
      } else {
        push(inputs, target, source);
        if (!fed.has(source)) {
          fed.set(source, target);
        }
      }
    }
    const parentOf = (task: string) => {
      const payload = payloads.get(task);
      return payload === undefined ? undefined : parents.get(payload);
    };

    const coordinates: Coordinates = new Map();
    let top = Infinity;
    let right = -Infinity;
    // The first row of each family, as placed: its height and its right end, which the new
    // subtasks extend.
    const rows = new Map<string, { y: number, right: number }>();
    for (const node of this.nodes) {
      const position = positionOf(node.id);
      if (position) {
        coordinates.set(node.id, position);
        top = Math.min(top, position[1]);
        right = Math.max(right, position[0] + NODE_SIZE / 2);
        const parent = node.type === 'task' ? parentOf(node.id) : undefined;
        if (parent !== undefined) {
          const row = rows.get(parent);
          if (!row || position[1] < row.y) {
            rows.set(parent, { y: position[1], right: position[0] });
          } else if (position[1] === row.y) {
            row.right = Math.max(row.right, position[0]);
          }
        }
      }
    }
    top = Number.isFinite(top) ? top : 0;
    right = Number.isFinite(right) ? right : 0;

    const placedProducers = (task: string) => (inputs.get(task) ?? [])
      .map(input => owners.get(input))
      .filter((producer): producer is string => producer !== undefined && coordinates.has(producer));

    // The node a new one goes with, undefined for a new root.
    const anchor = (node: Node): string | undefined => {
      if (node.type !== 'task') {
        return owners.get(node.id) ?? fed.get(node.id);
      }
      const deeper = (candidate: string | undefined, than: string | undefined) => {
        const position = candidate === undefined ? undefined : coordinates.get(candidate);
        return position !== undefined && (than === undefined || position[1] > coordinates.get(than)![1]);
      };
      let deepestProducer: string | undefined;
      let deepestInput: string | undefined;
      let other: string | undefined;
      for (const input of inputs.get(node.id) ?? []) {
        const producer = owners.get(input);
        if (deeper(producer, deepestProducer)) {
          deepestProducer = producer;
        }
        // Data the client uploaded has no producer: the task goes next to it.
        if (deeper(input, deepestInput)) {
          deepestInput = input;
        }
        other ??= producer;
      }
      // What it reads first, an aggregation below the subtasks it gathers; else its parent.
      return deepestProducer ?? parentOf(node.id) ?? deepestInput ?? other;
    };

    // Where a new node goes, `anchor` placed at `at`.
    const place = (node: Node, anchorId: string, at: [number, number]): [number, number] => {
      if (node.type !== 'task') {
        if (owners.get(node.id) === anchorId) {
          const rank = outputs.get(anchorId)?.indexOf(node.id) ?? 0;
          return [at[0] + Math.max(0, rank) * SLOT, at[1] + DATA_ROW_OFFSET];
        }
        // A payload, or an input of its only consumer: above it.
        return [at[0], at[1] - DATA_ROW_OFFSET];
      }
      const parent = parentOf(node.id);
      if (parent === anchorId) {
        const row = rows.get(parent);
        const position: [number, number] = row ? [row.right + SLOT, row.y] : [at[0], at[1] + LAYER_STEP];
        rows.set(parent, { y: position[1], right: position[0] });
        return position;
      }
      // Below what it reads, centred on what of it is placed.
      const producers = placedProducers(node.id);
      const x = producers.length === 0 ? at[0] : producers.reduce((sum, producer) => sum + coordinates.get(producer)![0], 0) / producers.length;
      return [x, at[1] + LAYER_STEP];
    };

    // A chain of new nodes is placed from its placed end, without recursion: a new chain of
    // subtasks may be thousands long.
    for (const node of this.nodes) {
      if (coordinates.has(node.id)) {
        continue;
      }
      const chain: Node[] = [];
      const seen = new Set<string>();
      let current: Node | undefined = node;
      let end: string | undefined;
      while (current && !coordinates.has(current.id) && !seen.has(current.id)) {
        chain.push(current);
        seen.add(current.id);
        end = anchor(current);
        current = end === undefined ? undefined : this.nodesById.get(end);
      }
      let first = chain.length - 1;
      if (!current || !coordinates.has(current.id)) {
        // Nothing placed to go with: its end goes to the right of the graph, on its top row.
        right += NODE_GAP + NODE_SIZE;
        coordinates.set(chain[first].id, [right - NODE_SIZE / 2, top]);
        chain.forEach(chained => this.unanchored.add(chained.id));
        current = chain[first--];
      }
      // From the placed end back to the new node, each placed next to the one it goes with.
      let anchorId = current.id;
      for (let k = first; k >= 0; k--) {
        coordinates.set(chain[k].id, place(chain[k], anchorId, coordinates.get(anchorId)!));
        anchorId = chain[k].id;
      }
    }
    return coordinates;
  }

  /** The placed nodes are left alone, but for the `unanchored` ones: they may be moving to their place. */
  private placeNew(coordinates: Coordinates, unanchored: Set<string>): void {
    for (const node of this.nodes) {
      const position = coordinates.get(node.id);
      if (position && (!this.placed.has(node.id) || unanchored.has(node.id))) {
        this.setPosition(node, position[0], position[1]);
      }
    }
  }

  private setPosition(node: Node, x: number, y: number): void {
    node.x = x;
    node.y = y;
    this.placed.add(node.id);
  }

  /** Moves the nodes to their targets over ANIMATION_MS, so that the eye can follow them. */
  private animateTo(targets: Coordinates): void {
    cancelAnimationFrame(this.animationFrame);
    const moves = this.nodes
      .filter(node => targets.has(node.id))
      .map(node => {
        const [x, y] = targets.get(node.id)!;
        return { node, fromX: node.x ?? x, fromY: node.y ?? y, x, y };
      });
    this.animationTargets = targets;
    const start = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / ANIMATION_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      for (const move of moves) {
        this.setPosition(move.node, move.fromX + (move.x - move.fromX) * eased, move.fromY + (move.y - move.fromY) * eased);
      }
      this.syncPositions();
      this.requestRender();
      if (t < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else {
        this.animationTargets = null;
      }
    };
    this.animationFrame = requestAnimationFrame(step);
  }

  private indexGraph(): void {
    this.nodesById = new Map(this.nodes.map(node => [node.id, node]));
    this.predecessors = new Map();
    this.successors = new Map();
    for (const link of this.links) {
      push(this.successors, endId(link.source), endId(link.target));
      push(this.predecessors, endId(link.target), endId(link.source));
    }
  }

  /** The nodes reachable from `id` in at most `depth` steps, each visited once. */
  private reach(id: string, neighbours: Map<string, string[]>, depth: number): Set<string> {
    const reached = new Set<string>();
    let frontier = [id];
    for (let step = 0; step < depth && frontier.length !== 0; step++) {
      const next: string[] = [];
      for (const current of frontier) {
        for (const neighbour of neighbours.get(current) ?? []) {
          if (neighbour !== id && !reached.has(neighbour)) {
            reached.add(neighbour);
            next.push(neighbour);
          }
        }
      }
      frontier = next;
    }
    return reached;
  }

  private hover(node: Node | null): void {
    this.hoveredNode = node;
    this.hovered = node === null
      ? null
      : new Set([node.id, ...this.reach(node.id, this.predecessors, HOVER_DEPTH), ...this.reach(node.id, this.successors, HOVER_DEPTH)]);
    if (this.hovered === null) {
      this.renderer?.setFocus(null);
    } else {
      const focused = new Uint8Array(this.nodes.length);
      for (const id of this.hovered) {
        const index = this.nodeIndex.get(id);
        if (index !== undefined) {
          focused[index] = 1;
        }
      }
      this.renderer?.setFocus(focused);
    }
    this.requestRender();
  }

  /** Draws the graph once, at the next frame, however many changes asked for it. */
  private requestRender(): void {
    if (!this.renderer || this.renderFrame) {
      return;
    }
    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = 0;
      const start = performance.now();
      // Translucent while zoomed out, where links pile up, opaque once they can be told apart.
      this.renderer?.render(this.camera, Math.min(1, Math.max(0.15, NODE_SIZE * this.camera.scale / 40)));
      if (this.debugEnabled()) {
        this.drawDurations.push(performance.now() - start);
      }
    });
  }

  /**
   * Hands what changed to the renderer: the nodes added, all the links, the positions, the
   * statuses. A batch adds to the nodes, never removes any: a node keeps its index.
   */
  private syncGraph(): void {
    const renderer = this.renderer;
    if (!renderer) {
      return;
    }
    const count = this.nodes.length;
    if (count !== this.drawnStatuses.length) {
      const shapes = new Uint8Array(count);
      const colors = new Uint8Array(count * 4);
      this.nodes.forEach((node, index) => {
        this.nodeIndex.set(node.id, index);
        shapes[index] = node.type === 'task' ? TASK_SHAPE : RESULT_SHAPE;
        colors.set(this.rgba(this.getNodeColor(node)), index * 4);
      });
      renderer.setNodes(count, shapes, colors);
      this.drawnStatuses = this.nodes.map(node => node.status);
    }
    const sources = new Uint32Array(this.links.length);
    const targets = new Uint32Array(this.links.length);
    const types = new Uint8Array(this.links.length);
    let linkCount = 0;
    for (const link of this.links) {
      const source = this.nodeIndex.get(endId(link.source));
      const target = this.nodeIndex.get(endId(link.target));
      if (source !== undefined && target !== undefined) {
        sources[linkCount] = source;
        targets[linkCount] = target;
        types[linkCount++] = LINK_TYPES.indexOf(link.type);
      }
    }
    renderer.setLinks(linkCount, sources, targets, types);
    this.syncPositions();
    this.syncStatuses();
    this.syncHighlights();
    this.requestRender();
  }

  private syncPositions(): void {
    const count = this.nodes.length;
    if (this.positions.length !== count * 2) {
      this.positions = new Float32Array(count * 2);
    }
    this.nodes.forEach((node, index) => {
      this.positions[index * 2] = node.x ?? 0;
      this.positions[index * 2 + 1] = node.y ?? 0;
    });
    this.renderer?.setPositions(this.positions);
    this.grid = null;
  }

  /** Only the colors of the nodes whose status changed: 4 bytes each. */
  private syncStatuses(): void {
    const renderer = this.renderer;
    if (!renderer) {
      return;
    }
    for (let index = 0; index < this.drawnStatuses.length; index++) {
      const node = this.nodes[index];
      if (node.status !== this.drawnStatuses[index]) {
        this.drawnStatuses[index] = node.status;
        renderer.setNodeColor(index, this.rgba(this.getNodeColor(node)));
      }
    }
  }

  /** Each highlighted node marked with the complementary color of its own. */
  private syncHighlights(): void {
    const indices: number[] = [];
    const colors: number[] = [];
    for (const id of this.nodesToHighlight) {
      const index = this.nodeIndex.get(id);
      if (index !== undefined) {
        indices.push(index);
        colors.push(...this.rgba(this.getComplementaryColor(this.getNodeColor(this.nodes[index]))));
      }
    }
    this.renderer?.setHighlights(Uint32Array.from(indices), Uint8Array.from(colors));
  }

  private setLinkColors(): void {
    this.renderer?.setLinkColors(LINK_TYPES.map(type => {
      const [r, g, b, a] = this.rgba(this.colorMap[type]);
      return [r / 255, g / 255, b / 255, a / 255];
    }));
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    this.canvas?.setPointerCapture?.(event.pointerId);
    Object.assign(this.pointer, { down: true, moved: false, x: event.offsetX, y: event.offsetY, startX: event.offsetX, startY: event.offsetY });
  };

  /** A drag moves the view; otherwise the node under the pointer is hovered. */
  private readonly onPointerMove = (event: PointerEvent) => {
    const pointer = this.pointer;
    if (pointer.down) {
      pointer.moved ||= Math.hypot(event.offsetX - pointer.startX, event.offsetY - pointer.startY) > CLICK_TOLERANCE;
      if (pointer.moved) {
        cancelAnimationFrame(this.cameraFrame);
        this.camera.pan(event.offsetX - pointer.x, event.offsetY - pointer.y);
        this.requestRender();
      }
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;
      return;
    }
    const node = this.pick(event.offsetX, event.offsetY);
    if (node !== this.hoveredNode) {
      this.hover(node);
    }
    this.tooltip.set(node ? { id: node.id, x: event.offsetX, y: event.offsetY } : null);
  };

  /** A press that did not move is a click: it zooms on the node under the pointer. */
  private readonly onPointerUp = (event: PointerEvent) => {
    const clicked = this.pointer.down && !this.pointer.moved;
    this.pointer.down = false;
    if (clicked) {
      const node = this.pick(event.offsetX, event.offsetY);
      if (node) {
        this.moveCamera(node.x!, node.y!, CLICK_ZOOM, CLICK_ZOOM_MS);
      }
    }
  };

  private readonly onPointerLeave = () => {
    this.pointer.down = false;
    this.tooltip.set(null);
    if (this.hoveredNode) {
      this.hover(null);
    }
  };

  /** Zooms towards the pointer. */
  private readonly onWheel = (event: WheelEvent) => {
    event.preventDefault();
    cancelAnimationFrame(this.cameraFrame);
    this.camera.zoomAt(event.offsetX, event.offsetY, Math.exp(-event.deltaY * WHEEL_ZOOM));
    this.tooltip.set(null);
    this.requestRender();
  };

  /** The node under the pointer, if any: within its size, or a few pixels when it is smaller. */
  private pick(screenX: number, screenY: number): Node | null {
    if (!this.laidOut || this.nodes.length === 0) {
      return null;
    }
    this.grid ??= new NodeGrid(this.positions, this.nodes.length, NODE_SIZE);
    const [x, y] = this.camera.toGraph(screenX, screenY);
    const index = this.grid.nearest(x, y, Math.max(NODE_SIZE / 2, PICK_RADIUS / this.camera.scale));
    return index === -1 ? null : this.nodes[index];
  }

  /** Moves the view to `x`, `y` at `scale` over `duration`, so that the eye can follow. */
  private moveCamera(x: number, y: number, scale: number, duration: number): void {
    cancelAnimationFrame(this.cameraFrame);
    const camera = this.camera;
    const from = { x: camera.x, y: camera.y, scale: camera.scale };
    const start = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      camera.x = from.x + (x - from.x) * eased;
      camera.y = from.y + (y - from.y) * eased;
      // Zooming at a constant rate: an interpolated scale would rush through the far views.
      camera.scale = from.scale * (scale / from.scale) ** eased;
      this.requestRender();
      if (t < 1) {
        this.cameraFrame = requestAnimationFrame(step);
      }
    };
    this.cameraFrame = requestAnimationFrame(step);
  }

  private getNodeColor(node: Node): string {
    const status = node.type === 'task'
      ? this.tasksStatusesService.statusToLabel(node.status as TaskStatus)
      : this.resultsStatusesService.statusToLabel(node.status as ResultStatus);
    return status?.color ?? 'grey';
  }

  /** A CSS color as 4 bytes, through the canvas for a color that is not hexadecimal. */
  private rgba(color: string): Uint8Array {
    let bytes = this.rgbaCache.get(color);
    if (!bytes) {
      bytes = hexToRgba(color) ?? hexToRgba(canvasColor(color)) ?? Uint8Array.of(128, 128, 128, 255);
      this.rgbaCache.set(color, bytes);
    }
    return bytes;
  }
}

/** The order of the link colors the renderer is given. */
const LINK_TYPES: LinkType[] = ['parent', 'dependency', 'output', 'payload'];

/** The renderer replaces the ends of a link, given as ids, with the node objects. */
function endId(end: Link['source']): string {
  return typeof end === 'object' ? (end as Node).id : String(end);
}

/** `#rgb`, `#rrggbb` or `#rrggbbaa` as 4 bytes, null for another color. */
function hexToRgba(color: string): Uint8Array | null {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
    return null;
  }
  let value = color.slice(1);
  if (value.length === 3) {
    value = value.split('').map(char => char + char).join('');
  }
  return Uint8Array.of(
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
    value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) : 255,
  );
}

/** A CSS color as the canvas writes it back, `#rrggbb` when opaque, kept as it is without a canvas. */
function canvasColor(color: string): string {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) {
    return color;
  }
  ctx.fillStyle = color;
  return ctx.fillStyle;
}
