import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ArmoniKGraphNode, GraphData, GraphLink, LinkType } from '@app/types/graph.types';
import { StatusLabelColor } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { forceLink, forceManyBody } from 'd3';
import ForceGraph from 'force-graph';
import { Observable, Subject, Subscription, switchMap } from 'rxjs';
import { AutoCompleteComponent } from './auto-complete.component';
import { GraphLegendComponent } from './graph-legend.component';

@Component({
  selector: 'app-graph',
  templateUrl: 'graph.component.html',
  styleUrl: 'graph.component.css',
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
    AutoCompleteComponent
  ],
  providers: [
    SessionsStatusesService,
    TasksStatusesService,
    ResultsStatusesService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent<N extends ArmoniKGraphNode, L extends GraphLink<N>> implements OnInit, AfterViewInit {
  @Input({ required: true }) grpcObservable: Observable<GraphData<N, L>>;
  @Input({ required: true }) sessionId: string;

  @ViewChild('graph', { static: false }) private graphRef: ElementRef | null = null;

  private graph: ForceGraph<N, L>;
  private canvasWidth: number = window.innerWidth;
  private canvasHeight: number = window.innerHeight;

  private readonly nodesToHighlight: Set<string> = new Set();
  highlightParentNodes = false;
  highlightChildrenNodes = false;
  private nodeToHighlight: string | null;
  
  colorMap: Record<LinkType, string>;

  private readonly iconsService = inject(IconsService);
  private readonly sessionsStatusesService = inject(SessionsStatusesService);
  private readonly tasksStatusesService = inject(TasksStatusesService);
  private readonly resultsStatusesService = inject(ResultsStatusesService);
  private readonly storageService = inject(StorageService);
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly clipboard = inject(Clipboard);

  private readonly redrawGraph$ = new Subject<void>();

  private readonly subscription = new Subscription();

  private nodes: N[] = [];
  private links: L[] = [];

  nodesIds: string[] = [];
  readonly highlightLabel = $localize`Highlight a task`;

  ngOnInit(): void {
    const storedColorMap = this.storageService.getItem<Record<LinkType, string>>('graph-links-colors', true) as Record<LinkType, string> | null;
    this.colorMap = storedColorMap ?? this.defaultConfigService.defaultGraphLinksColors;
    
    const storedHighlightParents = this.storageService.getItem<boolean>('graph-highlight-parents', true) as boolean;
    this.highlightParentNodes = storedHighlightParents ?? this.defaultConfigService.defaultGraphHighlightParents;

    const storedHighlightChildren = this.storageService.getItem<boolean>('graph-highlight-children', true) as boolean;
    this.highlightChildrenNodes = storedHighlightChildren ?? this.defaultConfigService.defaultGraphHighlightChildren;
  }

  ngAfterViewInit(): void {
    if (this.graphRef) {
      this.graph = new ForceGraph<N, L>(this.graphRef.nativeElement);

      this.graph
        .d3Force('charge', forceManyBody().strength(-1000))
        .d3Force('link', forceLink().distance(50).iterations(10))
        .dagMode('td')
        .dagLevelDistance(100)
        .nodeCanvasObject((node: N, ctx: CanvasRenderingContext2D) =>
          this.drawNode(node, ctx)
        )
        .linkColor((link: L) => {
          return this.getLinkColor(link);
        })
        .linkDirectionalParticleWidth(15)
        .linkWidth(4)
        .nodeLabel('id')
        .onNodeClick((node: N) => {
          this.graph.centerAt(node.x, node.y);
          this.graph.zoom(4, 2000);
        });

      this.subscription.add(this.grpcObservable.subscribe((result) => this.subscribeToData(result)));

      this.subscription.add(this.redrawGraph$
        .pipe(switchMap(() => this.grpcObservable))
        .subscribe((result) => this.subscribeToData(result)));
    }
  }

  /**
   * Redraw the graph by refreshing the graph data.
   */
  redraw(): void {
    this.redrawGraph$.next();
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
   * 
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
    const colorDec = parseInt(colorHex, 16);
    let complementaryHex = ((1 << 4 * colorHex.length) - 1 - colorDec).toString(16);

    while (complementaryHex.length < colorHex.length) {
      complementaryHex = '0' + complementaryHex;
    }
    return '#' + complementaryHex;
  }

  /**
   * Hightlight nodes with names included the searched value.
   * If there is only one node, will display all its parents and children
   * @param searchedValue 
   */
  highlightNodes(searchedValue: string) {
    this.nodesToHighlight.clear();
    this.nodeToHighlight = searchedValue;
    this.nodes.forEach((node: ArmoniKGraphNode) => {
      if (
        searchedValue !== '' &&
        node.id.includes(searchedValue)
      ) {
        this.nodesToHighlight.add(node.id);
      }
    });
    if (this.nodesToHighlight.size === 1) {
      const nodeId = [...(this.nodesToHighlight).values()][0];
      const node = this.nodes.find(node => node.id === nodeId) as ArmoniKGraphNode;
      this.graph.centerAt(node.x, node.y, 500);
      if (this.highlightParentNodes) {
        this.getParentNodes(nodeId).forEach(id => this.nodesToHighlight.add(id));
      }
      if (this.highlightChildrenNodes) {
        this.getChildrenNodes(nodeId).forEach(id => this.nodesToHighlight.add(id));
      }
    }

    this.graph.nodeCanvasObject((node: N, ctx: CanvasRenderingContext2D) =>
      this.drawNode(node, ctx)
    );
  }

  /**
   * Retrieves all parent nodes of the provided node.
   * @param nodeId string
   * @returns string[]
   */
  private getParentNodes(nodeId: string): string[] {
    const parentIds: string[] = [];
    const links = this.getLinksByTargetId(nodeId);
    const idBuffer: L[] = [...links];
    while (idBuffer.length !== 0) {
      const link = idBuffer.pop();
      if (link) {
        const parentId = (link.source as N)?.id ?? link.source;
        parentIds.push(parentId);
        idBuffer.push(...this.getLinksByTargetId(parentId));
      }
    }
    return parentIds;
  }

  /**
   * Retrieves all children nodes of the provided node.
   * @param nodeId string
   * @returns string[]
   */
  private getChildrenNodes(nodeId: string): string[] {
    const childrenIds: string[] = [];
    const links = this.getLinksBySourceId(nodeId);
    const idBuffer: L[] = [...links];
    while (idBuffer.length !== 0) {
      const link = idBuffer.pop();
      if (link) {
        const childrenId = (link.target as N)?.id ?? link.target;
        childrenIds.push(childrenId);
        idBuffer.push(...this.getLinksBySourceId(childrenId));
      }
    }
    return childrenIds;
  }

  /**
   * Retrieves the source link from the provided nodeId.
   * @param nodeId string
   * @returns L[]
   */
  private getLinksBySourceId(nodeId: string): L[] {
    return this.links.filter(link => link.source === nodeId || (link.source as N).id === nodeId);
  }

  /**
   * Retrieves the target link from the provided nodeId
   * @param nodeId string
   * @returns L[]
   */
  private getLinksByTargetId(nodeId: string): L[] {
    return this.links.filter(link => link.target === nodeId || (link.target as N).id === nodeId);
  }

  /**
   * Handles the resize event (zoom in or out)
   */
  onResize(event: UIEvent): void {
    const newCanvasDimension = event.target as Window;
    this.canvasWidth = newCanvasDimension.innerWidth;
    this.canvasHeight = newCanvasDimension.innerHeight;
    this.graph.width(this.canvasWidth);
    this.graph.height(this.canvasHeight);
  }
  
  /**
   * Displays particles on the graph
   * @param checked boolean
   */
  setParticles(checked: boolean): void {
    this.graph.linkDirectionalParticles(checked ? 1 : 0);
  }

  /**
   * Subscription of the data observable.
   * Draws the graph and refreshes the nodes array.
   * @param result 
   */
  private subscribeToData(result: GraphData<N, L>) {
    this.nodes = result.nodes;
    this.links = result.links;
    this.nodesIds = result.nodes.map((node) => node.id);
    this.graph.graphData({ nodes: result.nodes, links: result.links });
  }

  /**
   * Draws a node in the canvas
   * @param node N, must have valid x and y coordinates.
   * @param ctx CanvasRenderingContext2D
   */
  private drawNode(node: N, ctx: CanvasRenderingContext2D) {
    if (node.x !== undefined && node.y !== undefined) {
      const label = this.getNodeStatusData(node);
      if (this.nodesToHighlight.has(node.id)) {
        ctx.font = '70px Material Icons';
        const complementary = this.getComplementaryColor(label.color);
        ctx.fillStyle = complementary;
        ctx.fillText(this.iconsService.getIcon(`${node.type}-graph-icon`), node.x - 35, node.y + 35);
      }
      ctx.font = '50px Material Icons';
      ctx.fillStyle = label.color;
      ctx.fillText(this.iconsService.getIcon(`${node.type}-graph-icon`), node.x - 25, node.y + 25);
    }
  }

  /**
   * Get the data associated to the node status.
   * @param node N
   * @returns StatusLabelColor, contains label, color and icon.
   */
  private getNodeStatusData(node: N): StatusLabelColor {
    switch (node.type) {
    case 'session':
      return this.sessionsStatusesService.statusToLabel(node.status as SessionStatus);
    case 'task':
      return this.tasksStatusesService.statusToLabel(node.status as TaskStatus);
    case 'result':
      return this.resultsStatusesService.statusToLabel(node.status as ResultStatus);
    default:
      return {
        label: $localize`Unknown`,
        color: 'grey',
      };
    }
  }

  /**
   * Returns the associated link color.
   * @param link L
   * @returns string
   */
  private getLinkColor(link: L): string {
    return this.colorMap[link.type];
  }
}