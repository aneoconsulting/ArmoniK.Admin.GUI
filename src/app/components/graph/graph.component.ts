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
import ForceGraph from 'force-graph';
import { Observable, Subscription, bufferTime, filter, retry, tap, timer } from 'rxjs';
import { AutoCompleteComponent } from '../auto-complete.component';
import { Coordinates, LayoutInput, LayoutResponse, NODE_GAP, NODE_SIZE, prepareLayout } from './graph-layout';
import { createLayoutWorker } from './graph-layout-worker.factory';
import { GraphLegendComponent } from './graph-legend.component';

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
    /** Nodes added since the last layout, placed next to the others until it runs again. */
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
/** …or this long after the first change, for a running session never stops changing. */
const MAX_WAIT_MS = 10000;
/**
 * The same cap while the initial graph arrives, wider: laying it out before its end means laying
 * it out twice, but a session never quiet enough to end it must still show up.
 */
const INITIAL_MAX_WAIT_MS = 30000;
/** Delays before reconnecting to the events: doubling from the first, up to the last. */
const RECONNECT_FIRST_MS = 1000;
const RECONNECT_MAX_MS = 30000;
/** A layout still running after this long is given up: ELK takes seconds, even on large graphs. */
const LAYOUT_TIMEOUT_MS = 120000;
/** Refresh period of the loading counters. */
const LOADING_REFRESH_MS = 500;
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
/** Resolution the icons are rasterised at, so that they stay sharp once zoomed in. */
const SPRITE_SIZE = 128;
/** Under this size on screen, a node is drawn as a plain square: an icon would not be readable. */
const MIN_ICON_SCREEN_SIZE = 8;
/** Fitting a small graph to the view stops at this zoom: a single task would fill the screen. */
const MAX_FIT_ZOOM = 1;
/** Space left around the graph when it is fitted to the view. */
const FIT_PADDING = 40;
/** Smallest size on screen of the mark of a highlighted node, however far zoomed out. */
const HIGHLIGHT_SCREEN_SIZE = 12;
/** Opacity of what is not around the hovered node. */
const FADED_ALPHA = 0.08;
/** How far the hovered node's neighbourhood reaches: task → data → task. */
const HOVER_DEPTH = 2;

/**
 * Draws the graph of a session. Nodes are placed by ELK in a worker, not by a simulation. Nothing
 * is drawn until its first layout, which shows the whole graph at once; the nodes added since are
 * placed with its rules until it runs again.
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
    AutoCompleteComponent,
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

  private graph: ForceGraph<Node, Link> | null = null;

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
  private destroyed = false;
  private resizeObserver: ResizeObserver | null = null;

  private nodes: Node[] = [];
  private links: Link[] = [];
  private predecessors = new Map<string, string[]>();
  private successors = new Map<string, string[]>();
  private nodesById = new Map<string, Node>();

  readonly nodesIds = signal<string[]>([]);
  readonly nodeCount = signal<number>(0);
  readonly layingOut = signal<boolean>(false);
  /** Why the events stream was lost, null while it is up. */
  readonly streamError = signal<string | null>(null);
  /** Why the last layout failed, null when it did not. */
  readonly layoutError = signal<string | null>(null);
  private layoutTimeout: ReturnType<typeof setTimeout> | undefined;
  /** What arrived so far, shown instead of the graph until its first layout. Null once shown. */
  readonly loading = signal<{ tasks: number, results: number, seconds: number } | null>({ tasks: 0, results: 0, seconds: 0 });
  private loadingInterval: ReturnType<typeof setInterval> | undefined;
  readonly highlightLabel = $localize`Highlight a task`;

  readonly debugEnabled = signal<boolean>(false);
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

  /** Whether ELK has placed the graph once: until then, nothing is drawn. */
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
  private worker: Worker | null = null;
  /** The structure changed while ELK was running: its result is already out of date. */
  private layoutPending = false;
  private animationFrame = 0;

  /** Zoom of the frame being drawn, read by the link accessors. */
  private scale = 1;
  private hovered: Set<string> | null = null;
  private readonly sprites = new Map<string, HTMLCanvasElement>();
  private readonly linkColorCache = new Map<string, string>();
  private readonly paintNode = (node: Node, ctx: CanvasRenderingContext2D, scale: number) => this.drawNode(node, ctx, scale);

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

  async ngAfterViewInit(): Promise<void> {
    if (!this.graphRef) {
      return;
    }
    // The icons are rasterised once: the font has to be there, or they would hold the ligature
    // text instead of the glyph. A font that fails to load is no reason not to draw the graph.
    try {
      await document.fonts?.load(`${SPRITE_SIZE}px "Material Icons"`);
    } catch (error) {
      console.warn('The icon font did not load, the graph is drawn without it.', error);
    }
    // Left while the font was loading: a renderer created now would never be destroyed.
    if (this.destroyed) {
      return;
    }

    const element = this.graphRef.nativeElement;
    this.graph = new ForceGraph<Node, Link>(element)
      .width(element.clientWidth)
      .height(element.clientHeight)
      // Positions come from the layout: no simulation runs.
      .d3Force('charge', null)
      .d3Force('link', null)
      .d3Force('center', null)
      .cooldownTicks(0)
      // Only used for the box zoomToFit fits: the nodes are painted by drawNode, as big as this.
      .nodeRelSize(NODE_SIZE / 2)
      .nodeLabel('id')
      .nodeCanvasObject(this.paintNode)
      .nodePointerAreaPaint((node, color, ctx) => {
        ctx.fillStyle = color;
        ctx.fillRect(node.x! - NODE_SIZE / 2, node.y! - NODE_SIZE / 2, NODE_SIZE, NODE_SIZE);
      })
      .linkColor(link => this.getLinkColor(link))
      // In screen pixels whatever the zoom: thick lines over thousands of links cover the whole
      // overview, so they get thinner as it zooms out.
      .linkWidth(() => Math.min(4, Math.max(0.5, NODE_SIZE * this.scale / 12)))
      .linkDirectionalParticleWidth(4)
      .onRenderFramePre((_, scale) => {
        this.scale = scale;
        this.drawStart = performance.now();
      })
      .onRenderFramePost((ctx, scale) => {
        this.drawHighlights(ctx, scale);
        if (this.debugEnabled()) {
          this.drawDurations.push(performance.now() - this.drawStart);
        }
      })
      .onNodeHover(node => this.hover(node))
      .onNodeClick(node => {
        this.graph?.centerAt(node.x, node.y);
        this.graph?.zoom(4, 2000);
      });

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
    this.destroyed = true;
    this.resizeObserver?.disconnect();
    this.setDebug(false);
    clearInterval(this.loadingInterval);
    this.subscription.unsubscribe();
    clearTimeout(this.layoutTimer);
    clearTimeout(this.layoutTimeout);
    cancelAnimationFrame(this.animationFrame);
    this.worker?.terminate();
    this.graph?._destructor();
    this.graph = null;
  }

  /**
   * Places the graph again from scratch.
   */
  redraw(): void {
    this.runLayout();
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

  /**
   * Highlights the nodes whose id contains the searched value. When a single one does, centres on
   * it and, as configured, highlights its ancestors and descendants too.
   */
  highlightNodes(searchedValue: string) {
    this.nodesToHighlight.clear();
    this.nodeToHighlight = searchedValue;
    if (searchedValue !== '') {
      for (const node of this.nodes) {
        if (node.id.includes(searchedValue)) {
          this.nodesToHighlight.add(node.id);
        }
      }
    }
    if (this.nodesToHighlight.size === 1) {
      const [nodeId] = this.nodesToHighlight;
      const node = this.nodesById.get(nodeId)!;
      this.graph?.centerAt(node.x, node.y, 500);
      if (this.highlightParentNodes) {
        this.reach(nodeId, this.predecessors, Infinity).forEach(id => this.nodesToHighlight.add(id));
      }
      if (this.highlightChildrenNodes) {
        this.reach(nodeId, this.successors, Infinity).forEach(id => this.nodesToHighlight.add(id));
      }
    }
    this.requestRedraw();
  }

  /**
   * Handles the resize event (zoom in or out)
   */
  onResize(): void {
    const element = this.graphRef?.nativeElement;
    if (element) {
      this.graph?.width(element.clientWidth).height(element.clientHeight);
    }
  }

  /** The graph in the view, zoomed in no further than MAX_FIT_ZOOM. */
  private fitView(): void {
    this.graph?.zoomToFit(0, FIT_PADDING);
    if ((this.graph?.zoom() ?? 0) > MAX_FIT_ZOOM) {
      this.graph?.zoom(MAX_FIT_ZOOM);
    }
  }

  /**
   * Displays particles on the graph
   * @param checked boolean
   */
  setParticles(checked: boolean): void {
    this.graph?.linkDirectionalParticles(checked ? 1 : 0);
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
        state: this.worker ? 'running' : this.laidOut ? 'laid-out' : 'waiting',
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
      this.requestRedraw();
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

  /** Hands the graph to the renderer, the nodes without a place put next to the placed ones. */
  private display(): void {
    this.indexGraph();
    this.move(this.incrementalCoordinates(id => {
      const node = this.nodesById.get(id)!;
      return this.placed.has(id) ? [node.x!, node.y!] : undefined;
    }));
    this.graph?.graphData({ nodes: this.nodes, links: this.links });
    this.nodesIds.set(this.nodes.map(node => node.id));
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

  /** Runs ELK in a worker, then moves the nodes to the places it gave them. */
  private runLayout(): void {
    if (this.worker) {
      this.layoutPending = true;
      return;
    }
    const input = this.layoutInput();
    this.layingOut.set(true);
    this.layoutError.set(null);
    this.layoutRuns++;
    this.layoutStartedAt = Date.now();
    this.worker = createLayoutWorker();
    this.layoutTimeout = setTimeout(() => this.layoutFailed($localize`The layout did not finish within ${LAYOUT_TIMEOUT_MS / 60000} minutes.`), LAYOUT_TIMEOUT_MS);
    const startedAt = this.layoutStartedAt;
    this.worker.onmessage = ({ data }: MessageEvent<LayoutResponse>) => {
      if ('error' in data) {
        this.layoutFailed(data.error);
        return;
      }
      this.stopWorker();
      this.lastLayoutMs = Date.now() - startedAt;
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
        this.animateTo(this.incrementalCoordinates(id => targets.get(id)));
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
      }
      if (this.layoutPending) {
        this.layoutPending = false;
        this.scheduleLayout();
      }
    };
    // Also what happens when the worker cannot even load, its script gone after a deployment: the
    // event then has no message.
    this.worker.onerror = event => this.layoutFailed(event.message || $localize`The layout could not run.`);
    this.worker.postMessage(input);
  }

  /**
   * Nothing is drawn until a first layout succeeds, so its failure must show, and leave a way to
   * try again. A change that came in meanwhile gets its layout anyway.
   */
  private layoutFailed(message: string): void {
    this.stopWorker();
    console.error(message);
    this.layoutError.set(message);
    if (this.layoutPending) {
      this.layoutPending = false;
      this.scheduleLayout();
    }
  }

  private stopWorker(): void {
    clearTimeout(this.layoutTimeout);
    this.worker?.terminate();
    this.worker = null;
    this.layoutStartedAt = null;
    this.layingOut.set(false);
  }

  private layoutInput(): LayoutInput {
    return {
      nodes: this.nodes.map(node => node.id),
      types: this.nodes.map(node => node.type),
      links: this.links.map(link => ({ source: endId(link.source), target: endId(link.target), type: link.type })),
    };
  }

  /**
   * Nodes added since the last layout, placed with its rules until it runs again: a new task one
   * layer below the tasks it depends on, at the mean of their x, moved to the nearest free spot of
   * its row; the data around their task, as a layout leaves them. `positionOf` gives the tasks
   * already placed, undefined for the others.
   */
  private incrementalCoordinates(positionOf: (id: string) => [number, number] | undefined): Coordinates {
    const prepared = prepareLayout(this.layoutInput());
    const { graph } = prepared;
    const rowStep = graph.height + graph.layerGap;
    const width = (id: string) => graph.widths.get(id) ?? NODE_SIZE;

    const coordinates: Coordinates = new Map();
    const rows = new Map<number, Row>();
    const occupy = (id: string, x: number, y: number) => {
      coordinates.set(id, [x, y]);
      (rows.get(y) ?? rows.set(y, new Row(NODE_GAP)).get(y)!).add(x - width(id) / 2, x + width(id) / 2);
    };
    let top = Infinity;
    let right = -Infinity;
    for (const id of graph.ids) {
      const position = positionOf(id);
      if (position) {
        const [x, y] = position;
        occupy(id, x, y);
        top = Math.min(top, y);
        right = Math.max(right, x + width(id) / 2);
      }
    }
    top = Number.isFinite(top) ? top : 0;
    right = Number.isFinite(right) ? right : 0;

    const predecessors = new Map<string, string[]>();
    for (const link of graph.links) {
      push(predecessors, link.target, link.source);
    }

    // A task waits for its new predecessors to be placed first. When none of the waiting ones can
    // go (a cycle, which a DAG should not have), they go with whatever is placed.
    let waiting = graph.ids.filter(id => !coordinates.has(id));
    let stuck = false;
    while (waiting.length !== 0) {
      const next: string[] = [];
      for (const id of waiting) {
        const all = predecessors.get(id) ?? [];
        const known = all.filter(predecessor => coordinates.has(predecessor)).map(predecessor => coordinates.get(predecessor)!);
        if (known.length < all.length && !stuck) {
          next.push(id);
          continue;
        }
        if (known.length === 0) {
          occupy(id, right + NODE_GAP + width(id) / 2, top);
          right += NODE_GAP + width(id);
        } else {
          const y = snap(Math.max(...known.map(([, knownY]) => knownY)) + rowStep, rows, rowStep / 2);
          const x = known.reduce((sum, [knownX]) => sum + knownX, 0) / known.length;
          occupy(id, rows.get(y)?.nearestFree(x, width(id)) ?? x, y);
        }
      }
      stuck = next.length === waiting.length;
      waiting = next;
    }

    return prepared.placeData(coordinates);
  }

  private move(coordinates: Coordinates): void {
    for (const node of this.nodes) {
      const position = coordinates.get(node.id);
      if (position) {
        this.setPosition(node, position[0], position[1]);
      }
    }
  }

  private setPosition(node: Node, x: number, y: number): void {
    node.x = node.fx = x;
    node.y = node.fy = y;
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
    const start = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / ANIMATION_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      for (const move of moves) {
        this.setPosition(move.node, move.fromX + (move.x - move.fromX) * eased, move.fromY + (move.y - move.fromY) * eased);
      }
      this.requestRedraw();
      if (t < 1) {
        this.animationFrame = requestAnimationFrame(step);
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
    this.hovered = node === null
      ? null
      : new Set([node.id, ...this.reach(node.id, this.predecessors, HOVER_DEPTH), ...this.reach(node.id, this.successors, HOVER_DEPTH)]);
    this.requestRedraw();
  }

  /**
   * Nothing force-graph watches changes when a status or a highlight does, so it would not redraw:
   * setting the painter again makes it.
   */
  private requestRedraw(): void {
    this.graph?.nodeCanvasObject(this.paintNode);
  }

  private drawNode(node: Node, ctx: CanvasRenderingContext2D, scale: number): void {
    if (node.x === undefined || node.y === undefined) {
      return;
    }
    const color = this.getNodeColor(node);
    const faded = this.hovered !== null && !this.hovered.has(node.id);
    if (faded) {
      ctx.globalAlpha = FADED_ALPHA;
    }

    if (NODE_SIZE * scale < MIN_ICON_SCREEN_SIZE) {
      ctx.fillStyle = color;
      ctx.fillRect(node.x - NODE_SIZE / 2, node.y - NODE_SIZE / 2, NODE_SIZE, NODE_SIZE);
    } else {
      if (this.nodesToHighlight.has(node.id)) {
        const size = NODE_SIZE * 1.4;
        ctx.drawImage(this.sprite(node.type, this.getComplementaryColor(color)), node.x - size / 2, node.y - size / 2, size, size);
      }
      ctx.drawImage(this.sprite(node.type, color), node.x - NODE_SIZE / 2, node.y - NODE_SIZE / 2, NODE_SIZE, NODE_SIZE);
    }

    if (faded) {
      ctx.globalAlpha = 1;
    }
  }

  /**
   * Zoomed out, a highlighted node is a square of a few pixels among thousands: it is marked on top
   * of the whole frame, big enough to be seen. Zoomed in, drawNode draws it behind its icon.
   */
  private drawHighlights(ctx: CanvasRenderingContext2D, scale: number): void {
    if (this.nodesToHighlight.size === 0 || NODE_SIZE * scale >= MIN_ICON_SCREEN_SIZE) {
      return;
    }
    const size = Math.max(NODE_SIZE, HIGHLIGHT_SCREEN_SIZE / scale);
    for (const id of this.nodesToHighlight) {
      const node = this.nodesById.get(id);
      if (node?.x === undefined || node.y === undefined) {
        continue;
      }
      const color = this.getNodeColor(node);
      ctx.fillStyle = this.getComplementaryColor(color);
      ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
      ctx.fillStyle = color;
      ctx.fillRect(node.x - size / 4, node.y - size / 4, size / 2, size / 2);
    }
  }

  private getNodeColor(node: Node): string {
    const status = node.type === 'task'
      ? this.tasksStatusesService.statusToLabel(node.status as TaskStatus)
      : this.resultsStatusesService.statusToLabel(node.status as ResultStatus);
    return status?.color ?? 'grey';
  }

  /** The icon of a node type in a given color, drawn once and reused by every node sharing them. */
  private sprite(type: Node['type'], color: string): HTMLCanvasElement {
    const key = `${type}|${color}`;
    let sprite = this.sprites.get(key);
    if (!sprite) {
      sprite = document.createElement('canvas');
      sprite.width = sprite.height = SPRITE_SIZE;
      const ctx = sprite.getContext('2d')!;
      ctx.font = `${SPRITE_SIZE}px "Material Icons"`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.iconsService.getIcon(`${type}-graph-icon`), SPRITE_SIZE / 2, SPRITE_SIZE / 2);
      this.sprites.set(key, sprite);
    }
    return sprite;
  }

  /**
   * Translucent while zoomed out, where links pile up, opaque once they can be told apart. Faded
   * when they do not belong to the hovered neighbourhood.
   */
  private getLinkColor(link: Link): string {
    const inHovered = this.hovered === null || (this.hovered.has(endId(link.source)) && this.hovered.has(endId(link.target)));
    const alpha = !inHovered
      ? FADED_ALPHA
      : this.hovered !== null ? 1 : Math.min(1, Math.max(0.15, NODE_SIZE * this.scale / 40));
    // Rounded so that the cache stays small and the canvas batches links of the same color.
    const rounded = Math.round(alpha * 20) / 20;
    const key = `${link.type}|${rounded}`;
    let color = this.linkColorCache.get(key);
    if (!color) {
      color = withAlpha(this.colorMap[link.type], rounded);
      this.linkColorCache.set(key, color);
    }
    return color;
  }
}

/** The renderer replaces the ends of a link, given as ids, with the node objects. */
function endId(end: Link['source']): string {
  return typeof end === 'object' ? (end as Node).id : String(end);
}

/** `#rgb`, `#rrggbb` or `#rrggbbaa`, its own alpha multiplied by `alpha`. Other colors are kept. */
function withAlpha(color: string, alpha: number): string {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
    return color;
  }
  let value = color.slice(1);
  if (value.length === 3) {
    value = value.split('').map(char => char + char).join('');
  }
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  const a = value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1;
  return `rgba(${r}, ${g}, ${b}, ${a * alpha})`;
}

function push(map: Map<string, string[]>, key: string, value: string): void {
  const list = map.get(key);
  if (list) {
    list.push(value);
  } else {
    map.set(key, [value]);
  }
}

/** The y of the existing row closest to `y`, if one is within `tolerance`: layouts space rows unevenly. */
function snap(y: number, rows: Map<number, unknown>, tolerance: number): number {
  let best = y;
  let distance = tolerance;
  for (const row of rows.keys()) {
    if (Math.abs(row - y) < distance) {
      best = row;
      distance = Math.abs(row - y);
    }
  }
  return best;
}

/**
 * The spans taken on a row of the graph, sorted and disjoint, to find where a new node fits. Spans
 * closer than `gap` are merged, since no node fits between them: siblings placed side by side form
 * a single span, crossed in one step instead of one step per sibling.
 */
class Row {
  private readonly starts: number[] = [];
  private readonly ends: number[] = [];

  constructor(private readonly gap: number) {}

  add(start: number, end: number): void {
    const first = this.firstEndingAfter(start - this.gap);
    let last = first;
    while (last < this.starts.length && this.starts[last] <= end + this.gap) {
      start = Math.min(start, this.starts[last]);
      end = Math.max(end, this.ends[last]);
      last++;
    }
    this.starts.splice(first, last - first, start);
    this.ends.splice(first, last - first, end);
  }

  /** The x closest to `x` where a node of `width` fits, `gap` away from its neighbours. */
  nearestFree(x: number, width: number): number {
    const clearance = width / 2 + this.gap;
    let right = x;
    for (let index = this.firstEndingAfter(right - clearance); index < this.starts.length && this.starts[index] < right + clearance; index++) {
      right = this.ends[index] + clearance;
    }
    let left = x;
    for (let index = this.lastStartingBefore(left + clearance); index >= 0 && this.ends[index] > left - clearance; index--) {
      left = this.starts[index] - clearance;
    }
    return right - x <= x - left ? right : left;
  }

  /** Index of the first span ending after `value`. */
  private firstEndingAfter(value: number): number {
    let low = 0;
    let high = this.ends.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (this.ends[middle] <= value) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }
    return low;
  }

  /** Index of the last span starting before `value`, -1 when there is none. */
  private lastStartingBefore(value: number): number {
    let low = 0;
    let high = this.starts.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (this.starts[middle] < value) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }
    return low - 1;
  }
}
