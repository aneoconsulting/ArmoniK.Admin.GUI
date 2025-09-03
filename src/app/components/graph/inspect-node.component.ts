import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { StatusChipComponent } from '@components/status-chip.component';
import { IconsService } from '@services/icons.service';
import { delay, Subject, Subscription } from 'rxjs';
import { InspectResultActionsComponent } from './inspect-result-actions.component';
import { InspectTaskActionsComponent } from './inspect-task-actions.component';
import { NodeStatusService } from './services/node-status.service';

@Component({
  selector: 'app-graph-inspect-node',
  templateUrl: 'inspect-node.component.html',
  styleUrl: 'inspect-node.component.css',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent,
    InspectTaskActionsComponent,
    InspectResultActionsComponent,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectNodeComponent<N extends ArmoniKGraphNode> implements OnInit, OnDestroy {
  readonly nodeStatusService = inject(NodeStatusService);
  private readonly iconsService = inject(IconsService);
  private readonly clipboard = inject(Clipboard);

  @Input({ required: true }) node: N;

  @Output() readonly closePanel = new EventEmitter<void>();

  copyIcon = signal('copy');
  private readonly copySubject = new Subject<void>();
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    const copySubscription = this.copySubject
      .pipe(delay(2000))
      .subscribe(() => (this.copyIcon.set('copy')));
    this.subscriptions.add(copySubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  copy() {
    this.clipboard.copy(this.node.id);
    this.copyIcon.set('success');
    this.copySubject.next();
  }

  onClose() {
    this.closePanel.emit();
  }
}