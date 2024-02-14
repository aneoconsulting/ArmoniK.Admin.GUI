import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
export class ShowActionsComponent implements OnInit {
  @Input({ required: true }) actionsButton: ShowActionButton[];
  @Input({ required: true }) data: DataRaw = {} as DataRaw;
  @Input() id: string | null = null;
  @Output() refresh = new EventEmitter<never>();

  rightActions: ShowActionButton[];
  leftActions: ShowActionButton[];

  _iconsService = inject(IconsService);

  ngOnInit(): void {
    this.leftActions = this.actionsButton.filter(action => action.area !== 'right');
    this.rightActions = this.actionsButton.filter(action => action.area === 'right');
  }

  onRefreshClick() {
    this.refresh.emit();
  }

  getRefreshIcon() {
    return this._iconsService.getIcon('refresh');
  }
}