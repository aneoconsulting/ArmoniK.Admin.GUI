import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ShowActionButton } from '@app/types/components/show';
import { DataRaw } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { ShowActionAreaComponent } from './show-action-area.component';

@Component({
  selector: 'app-show-actions',
  templateUrl: './show-actions.component.html',
  styles: [`
  .spacer {
    flex: 1 1 auto;
  }
  .smallSpace {
    margin-left: 5px;
    margin-right: 5px;
  }
  `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatToolbarModule,
    ShowActionAreaComponent
  ],
  providers: [
    IconsService
  ]
})
export class ShowActionsComponent implements OnInit, OnChanges {
  @Input({ required: true }) actionsButton: ShowActionButton[];
  @Input({ required: true }) data: DataRaw = {} as DataRaw;
  @Input() id: string | null = null;
  @Output() refresh = new EventEmitter<never>();

  rightActions: ShowActionButton[];
  leftActions: ShowActionButton[];

  _iconsService = inject(IconsService);

  ngOnInit(): void {
    this.#splitActions();
  }

  /** Observe actions button to split them. Actions button can change when another one is clicked. */
  ngOnChanges(changes: SimpleChanges): void {
    if( 'actionsButton' in changes ) {
      this.#splitActions();
    }

  }

  onRefreshClick() {
    this.refresh.emit();
  }

  getRefreshIcon() {
    return this._iconsService.getIcon('refresh');
  }

  #splitActions(): void {
    this.leftActions = this.actionsButton.filter(action => action.area !== 'right');
    this.rightActions = this.actionsButton.filter(action => action.area === 'right');
  }
}
