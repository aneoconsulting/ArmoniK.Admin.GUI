import { AfterViewInit, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ArmoniKGraphNode, GraphLink } from '@app/types/graph.types';
import { IconsService } from '@services/icons.service';
import { forceLink, forceManyBody } from 'd3';
import ForceGraph from 'force-graph';
import { Observable, Subject, switchMap } from 'rxjs';
import { AutoCompleteComponent } from './auto-complete.component';

@Component({
  selector: 'app-graph',
  templateUrl: 'graph.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    AutoCompleteComponent,
    MatCheckboxModule,
  ],
  providers: [],
})
export class GraphComponent<N extends ArmoniKGraphNode, L extends GraphLink<N>> implements AfterViewInit {
  @Input({ required: true }) grpcObservable: Observable<{nodes: N[], links: L[]}>;

  @ViewChild('graph', { static: false }) readonly graphRef: ElementRef | null = null;

  graph!: ForceGraph<N, L>;
  canvasWidth: number = window.innerWidth;
  canvasHeight: number = window.innerHeight;

  @Input() taskToFind: string = '';
  nodesToHighlight: Set<string> = new Set();
  
  colorMap: Map<string, string> = new Map<string, string>([
    ['taskResultLink', '#f7b657'],
    ['parentLink', '#8A427AAA'],
    ['dependencyLink', '#878adeDD'],
  ]);

  private readonly iconsService = inject(IconsService);
  private readonly refreshGraph$ = new Subject<void>();

  ngAfterViewInit(): void {
    if (this.graphRef) {
      this.graph = new ForceGraph<N, L>(this.graphRef.nativeElement);

      this.graph
        .d3Force('charge', forceManyBody().strength(-1000))
        .d3Force('link', forceLink().distance(50).iterations(10))
        .dagMode('td')
        .dagLevelDistance(100)
        .nodeCanvasObject((node: N, ctx: CanvasRenderingContext2D) =>
          this.drawNode(node, 'red', ctx)
        )
        .linkColor((link: L) => {
          return this.getLinkColor(link);
        })
        .linkWidth(4)
        .nodeLabel('id')
        .onNodeClick((node: N) => {
          // this.setPanelData(node.id, node.type);
          this.graph.centerAt(node.x, node.y);
          this.graph.zoom(4, 2000);
        });

      this.refreshGraph$
        .pipe(switchMap(() => this.grpcObservable))
        .subscribe((result) => this.graph.graphData({ nodes: result.nodes, links: result.links }));
    }
  }

  refresh() {
    this.refreshGraph$.next();
  }

  drawNode(node: N, color: string, ctx: CanvasRenderingContext2D) {
    if (node.x && node.y) {
      ctx.font = '50px Material Icons';
      ctx.fillStyle = color;
      ctx.fillText(this.iconsService.getIcon(node.type), node.x, node.y);
    }
  }

  setParticles(checked: boolean) {
    this.graph.linkDirectionalParticles(checked ? 1 : 0);
  }

  getLinkColor(link: L): string {
    switch (link.type) {
    case 'parent':
      return this.colorMap.get('parentLink')!;
    case 'dependency':
      return this.colorMap.get('dependencyLink')!;
    default:
      return this.colorMap.get('taskResultLink')!;
    }
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  /**
   * Hightlight nodes with names included the searched value
   * @param searchedValue 
   */
  highlightNodes(searchedValue: string) {
    this.taskToFind = searchedValue;
    this.nodesToHighlight.clear();
    this.graphdataService.nodes.forEach((node: TaskResultNode) => {
      if (
        searchedValue !== '' &&
        node.id.includes(searchedValue)
      ) {
        this.nodesToHighlight.add(node.id);
      }
    });
    this.graph.nodeCanvasObject((node: N, ctx: CanvasRenderingContext2D) =>
      this.drawNode(node, 'red', ctx)
    );
  }

  onResize(event: UIEvent) {
    const w = event.target as Window;
    this.canvasWidth = w.innerWidth;
    this.canvasHeight = w.innerHeight;
    this.graph.width(this.canvasWidth);
    this.graph.height(this.canvasHeight);
  }
}