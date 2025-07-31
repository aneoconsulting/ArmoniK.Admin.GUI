import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ArmoniKGraphNode } from '@app/types/graph.types';

@Component({
  selector: 'app-graph-selected-node',
  templateUrl: 'graph-selected-node.component.html',
  imports: [
    MatCardContent,
    RouterModule,
    MatButtonModule,
  ],
})
export class GraphSelectedNodeComponent<N extends ArmoniKGraphNode> {
  @Input({ required: true }) node: N | null = null;
}