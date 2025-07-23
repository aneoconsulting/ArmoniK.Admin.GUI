import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { LinkType } from '@app/types/graph.types';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-graph-legend',
  templateUrl: 'graph-legend.component.html',
  styleUrl: 'graph-legend.component.css',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    PrettyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphLegendComponent {
  private readonly iconsService = inject(IconsService);
  readonly sessionsStatusesService = inject(SessionsStatusesService);
  readonly tasksStatusesService = inject(TasksStatusesService);
  readonly resultsStatusesService = inject(ResultsStatusesService);

  @Input({ required: true }) set links(entry: Record<LinkType, string>) {
    this.linksDescription = Object.keys(entry).map(key => ({
      label: key,
      color: entry[key as LinkType],
    }));
  }

  linksDescription: { label: string, color: string }[];

  getIcon(name: string | undefined) {
    return this.iconsService.getIcon(name);
  }
}