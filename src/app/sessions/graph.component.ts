import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArmoniKGraphNode, GraphData, GraphLink } from '@app/types/graph.types';
import { GraphComponent } from '@components/graph.component';
import { GraphDataService } from '@services/graph-data.service';
import { GrpcEventsService } from '@services/grpc-events.service';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'app-session-graph',
  templateUrl: 'graph.component.html',
  standalone: true,
  imports: [
    GraphComponent,
  ],
  providers: [
    GrpcEventsService,
    GraphDataService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionGraphComponent implements OnInit {
  id: string;

  grpcObservable: Observable<GraphData<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>>>;

  private readonly route = inject(ActivatedRoute);
  private readonly graphDataService = inject(GraphDataService);

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    const routeSubscription = this.route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.graphDataService.sessionId = id;
    });
    this.grpcObservable = this.graphDataService.listenToEvents();

    this.subscriptions.add(routeSubscription);
  }
}