import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { ArmonikData, DataRaw } from '@app/types/data';

export type ActionTable<T extends ArmonikData<DataRaw>> = {
  icon: string;
  label: string;
  action$: Subject<T>;
  condition?: (element: T) => boolean;
};

@Component({
  selector: 'app-table-actions',
  standalone: true,
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu"
      aria-label="Actions" i18n-aria-label>
      <mat-icon fontIcon="more_vert" />
    </button>
    <mat-menu #menu="matMenu">
      <ng-container *ngFor="let action of actions">
        <button mat-menu-item
          *ngIf="action.condition ? action.condition(element) : true"   
          (click)="action.action$.next(element)"
        >
          <mat-icon>{{ action.icon }}</mat-icon>
          <p>{{ action.label }}</p>
        </button>
      </ng-container>
    </mat-menu>
  `,
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