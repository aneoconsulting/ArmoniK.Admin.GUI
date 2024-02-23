import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArmonikData, DataRaw } from '@app/types/data';
import { ActionTable } from '@app/types/table';

@Component({
  selector: 'app-table-actions',
  standalone: true,
  templateUrl: './table-actions.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgIf,
    NgFor,
    MatMenuModule
  ]
})
export class TableActionsComponent<T extends ArmonikData<DataRaw>> {
  @Input() actions: ActionTable<T>[] = [];
  @Input() element: T;
}