import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditNameLineData, EditNameLineResult, ReorganizeLinesDialogData, ReorganizeLinesDialogResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { EditNameLineDialogComponent } from './edit-name-line-dialog.component';
import { Line } from '../types';

@Component({
  selector: 'app-dashboard-reorganize-lines-dialog',
  template: `
<h2 mat-dialog-title i18n="Dialog title">Reorganize lines</h2>

<mat-dialog-content>
  <p i18n="Dialog description">Drag and drop lines to update the order</p>

  <div class="lines" cdkDropList (cdkDropListDropped)="drop($event)">
    <div class="line" *ngFor="let line of lines; let index = index" cdkDrag>
      <div class="line-name">
        <mat-icon mat-icon aria-hidden="true" i18n-aria-label aria-label="Drag status" [fontIcon]="getIcon('drag')"></mat-icon>
        <span class="line-name">{{ line.name }}</span>
      </div>
      <div clas="line-actions">
        <button mat-icon-button (click)="onEditNameLine(line, index)" i18n-matTooltip matTooltip="Edit Line">
          <mat-icon aria-hidden="true"  [fontIcon]="getIcon('edit')"></mat-icon>
        </button>
        <button mat-icon-button (click)="onDeleteLine(line)" i18n-matTooltip matTooltip="Delete Line">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('delete')"></mat-icon>
        </button>
      </div>
    </div>
  </div>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onNoClick()" i18n="Dialog action"> Cancel </button>
  <button mat-flat-button [mat-dialog-close]="{ lines }" color="primary" i18n="Dialog action"> Confirm </button>
</mat-dialog-actions>
  `,
  styles: [`
.lines {
  display: flex;
  flex-direction: column;
}

.line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.line-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.line-actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.cdk-drag-preview {
  color: rgba(0, 0, 0, 0.6);
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.lines.cdk-drop-list-dragging .line:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
  `],
  standalone: true,
  providers: [
    IconsService,
  ],
  imports: [
    NgFor,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
  ]
})
export class ReorganizeLinesDialogComponent implements OnInit {
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  readonly #dialogRef = inject(MatDialogRef<ReorganizeLinesDialogData, ReorganizeLinesDialogResult>);
  readonly #iconsService = inject(IconsService);
  readonly #dialog = inject(MatDialog);

  lines: Line[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReorganizeLinesDialogData,
  ) {}

  ngOnInit(): void {
    this.lines = this.data.lines;
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  onNoClick(): void {
    this.#dialogRef.close();
  }

  drop(event: CdkDragDrop<Line[]>) {
    moveItemInArray(this.lines, event.previousIndex, event.currentIndex);
  }

  onDeleteLine( line: Line) {
    const index = this.lines.indexOf(line);
    if (index > -1) {
      this.lines.splice(index, 1);
    }
  }

  onEditNameLine(line: Line, index: number) {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult> = this.#dialog.open<EditNameLineDialogComponent, EditNameLineData, EditNameLineResult>(EditNameLineDialogComponent, {
      data: {
        name: line.name
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const selectedLine = this.lines[index];
      const changeSelectedNameLine = (line: Line, newName: string): void => {
        if(line.name === newName) {
          line.name = result.name;
        }
      };
      this.lines.map(line => changeSelectedNameLine(line, selectedLine.name));
    });

  }
  trackByLine(index: number, line: Line): string {
    return line.name + index;
  }
}
