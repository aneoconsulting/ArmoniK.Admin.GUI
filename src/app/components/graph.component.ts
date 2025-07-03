import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
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
import { ArmoniKGraphNode, GraphData, GraphLink } from '@app/types/graph.types';
import { StatusLabelColor } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { forceLink, forceManyBody } from 'd3';
import ForceGraph from 'force-graph';
import { Observable, Subject, Subscription, switchMap } from 'rxjs';
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
  ],
  providers: [
    SessionsStatusesService,
    TasksStatusesService,
    ResultsStatusesService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent<N extends ArmoniKGraphNode, L extends GraphLink<N>> implements AfterViewInit {
  @Input({ required: true }) grpcObservable: Observable<GraphData<N, L>>;
  @Input({ required: true }) sessionId: string;

  @ViewChild('graph', { static: false }) private graphRef: ElementRef | null = null;

  private graph: ForceGraph<N, L>;
  private canvasWidth: number = window.innerWidth;
  private canvasHeight: number = window.innerHeight;

  private taskToFind: string = '';
  private readonly nodesToHighlight: Set<string> = new Set();
  
  private readonly colorMap: Map<string, string> = new Map<string, string>([
    ['taskResultLink', '#f7b657'],
    ['parentLink', '#8A427AAA'],
    ['dependencyLink', '#878adeDD'],
  ]);

  private readonly iconsService = inject(IconsService);
  private readonly sessionsStatusesService = inject(SessionsStatusesService);
  private readonly tasksStatusesService = inject(TasksStatusesService);
  private readonly resultsStatusesService = inject(ResultsStatusesService);

  private readonly redrawGraph$ = new Subject<void>();

  private readonly subscription = new Subscription();

  private nodes: N[];

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
   * Hightlight nodes with names included the searched value
   * @param searchedValue 
   */
  highlightNodes(searchedValue: Event): void {
    this.taskToFind = (searchedValue.target as HTMLInputElement).value;
    this.nodesToHighlight.clear();
    this.nodes.forEach((node: N) => {
      if (this.taskToFind !== '' &&
        node.id.includes(this.taskToFind)
      ) {
        this.nodesToHighlight.add(node.id);
      }
    });
    this.graph.nodeCanvasObject((node: N, ctx: CanvasRenderingContext2D) =>
      this.drawNode(node, ctx)
    );
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
    switch (link.type) {
    case 'parent':
      return this.colorMap.get('parentLink')!;
    case 'dependency':
      return this.colorMap.get('dependencyLink')!;
    default:
      return this.colorMap.get('taskResultLink')!;
    }
  }
}