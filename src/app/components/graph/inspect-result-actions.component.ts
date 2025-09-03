import { ResultRaw } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ResultsGrpcService } from '@app/results/services/results-grpc.service';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-graph-inspect-result-actions',
  templateUrl: 'inspect-result-actions.component.html',
  styleUrl: 'inspect-node.component.css',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardActions
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectResultActionsComponent<N extends ArmoniKGraphNode> implements OnDestroy {
  private readonly grpcService = inject(ResultsGrpcService);
  private readonly router = inject(Router);

  private readonly subscriptions = new Subscription();

  result = signal<ResultRaw | null>(null);

  @Input({ required: true }) set node(entry: N) {
    const getSubscription = this.grpcService.get$(entry.id)
      .subscribe(result => {
        if (result.result) {
          this.result.set(result.result);
        }
      });

    this.subscriptions.add(getSubscription);
  };

  seeResult(result: ResultRaw) {
    this.router.navigate(['/results', result.resultId]);
  }

  seeSession(result: ResultRaw) {
    this.router.navigate(['/sessions', result.sessionId]);
  }

  seeOwnerTask(result: ResultRaw) {
    this.router.navigate(['/tasks', result.ownerTaskId]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}