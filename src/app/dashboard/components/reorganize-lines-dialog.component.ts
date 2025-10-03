import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Inject, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditNameLineData, ReorganizeLinesDialogData, ReorganizeLinesDialogResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { EditNameLineDialogComponent } from './edit-name-line-dialog.component';
import { Line } from '../types';

@Component({
  selector: 'app-dashboard-reorganize-lines-dialog',
  templateUrl: 'reorganize-lines-dialog.component.html',
  styleUrl: 'reorganize-lines-dialog.component.css',
  providers: [
    IconsService,
  ],
  imports: [
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

  private readonly dialogRef = inject(MatDialogRef<ReorganizeLinesDialogData, ReorganizeLinesDialogResult>);
  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);

  lines: Line[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReorganizeLinesDialogData,
  ) {}

  ngOnInit(): void {
    this.lines = this.data.lines;
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDrop(event: CdkDragDrop<Line[]>) {
    moveItemInArray(this.lines, event.previousIndex, event.currentIndex);
  }

  onDeleteLine(line: Line) {
    const index = this.lines.indexOf(line);
    if (index > -1) {
      this.lines.splice(index, 1);
    }
  }

  onEditNameLine(line: Line, index: number) {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, string> = this.dialog.open<EditNameLineDialogComponent, EditNameLineData, string>(EditNameLineDialogComponent, {
      data: {
        name: line.name
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedLine = this.lines[index];
        const changeSelectedNameLine = (line: Line, oldName: string): void => {
          if(line.name === oldName) {
            line.name = result;
          }
        };
        for (const line of this.lines) {
          changeSelectedNameLine(line, selectedLine.name);
        }
      }
    });
  }
}
