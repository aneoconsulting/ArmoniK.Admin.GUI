import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExternalService, ManageExternalServicesDialogData } from '@app/types/external-service';
import { ActionsToolbarGroupComponent } from '@components/actions-toolbar-group.component';
import { ActionsToolbarComponent } from '@components/actions-toolbar.component';
import { IconsService } from '@services/icons.service';
import { AddExternalServiceDialogComponent } from './add-external-service-dialog.component';
import { EditExternalServiceDialogComponent } from './edit-external-service-dialog.component';

@Component({
  selector: 'app-manage-external-services',
  template: `
<h2 mat-dialog-title i18n="Dialog title"> Manage External Services </h2>

<mat-dialog-content>
  <mat-toolbar>
    <app-actions-toolbar>
      <app-actions-toolbar-group>
        <button mat-stroked-button (click)="addExternalService()">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('add')"></mat-icon>
          <span i18n="Add an external service">Add a service</span>
        </button>
      </app-actions-toolbar-group>
    </app-actions-toolbar>
  </mat-toolbar>

  <ul class="external-services" cdkDropList (cdkDropListDropped)="onDrop($event)">
    <li *ngFor="let externalService of externalServices; trackBy:trackByService" cdkDrag>
      <mat-icon aria-hidden="true" [fontIcon]="getIcon('drag')" cdkDragHandle></mat-icon>
      <a mat-flat-button [href]="externalService.url" target="_blank" rel="noopener noreferrer" [matTooltip]="externalService.url" class="name">
          <mat-icon *ngIf="externalService.icon" aria-hidden="true" [fontIcon]="externalService.icon"></mat-icon>
          <span>{{ externalService.name }}</span>
      </a>
      <div class="actions">
        <button mat-icon-button (click)="editExternalService(externalService)" [attr.aria-label]="'Edit the external service ' + externalService.name" [matTooltip]="'Edit ' + externalService.name">
          <mat-icon [fontIcon]="getIcon('edit')"></mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="deleteExternalService(externalService)" [attr.aria-label]="'Delete the external service ' + externalService.name" [matTooltip]="'Delete ' + externalService.name">
          <mat-icon [fontIcon]="getIcon('delete')"></mat-icon>
        </button>
      </div>
    </li>
  </ul>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onNoClick()" i18n="Dialog action"> Cancel </button>
  <button mat-flat-button [mat-dialog-close]="externalServices" color="primary" i18n="Dialog action"> Confirm </button>
</mat-dialog-actions>
  `,
  styles: [`
.external-services {
  margin-top: 1rem;

  list-style: none;
  padding: 0;
}

.external-services li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.external-services li .name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.external-services li .actions {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  padding-left: 1rem;
}

[cdkDragHandle] {
  cursor: move;
}

.cdk-drag-preview {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  align-items: center;
  gap: 1rem;

  color: rgba(255, 255, 255, 0.6);
}

.cdk-drag-preview .name {
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cdk-drag-preview .actions {
  display: none;
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.cdk-drop-list-dragging li:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
  `],
  standalone: true,
  providers: [],
  imports: [
    NgFor,
    NgIf,
    ActionsToolbarComponent,
    ActionsToolbarGroupComponent,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule
  ],
})
export class ManageExternalServicesDialogComponent implements OnInit {
  externalServices: ExternalService[] = [];

  #dialog = inject(MatDialog);
  #iconsService = inject(IconsService);

  constructor(
    public dialogRef: MatDialogRef<ManageExternalServicesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ManageExternalServicesDialogData
  ) {}

  ngOnInit(): void {
    this.externalServices = [
      ...this.data.externalServices.map((externalService) => ({ ...externalService })),
    ];
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  addExternalService(): void {
    const dialogRef = this.#dialog.open(AddExternalServiceDialogComponent, {});

    dialogRef.afterClosed().subscribe((externalService: ExternalService) => {
      if (externalService) {
        this.externalServices.push(externalService);
      }
    });
  }

  editExternalService(externalService: ExternalService): void {
    const dialogRef = this.#dialog.open(EditExternalServiceDialogComponent, {
      data: {
        externalService
      },
    });

    dialogRef.afterClosed().subscribe((editedExternalService: ExternalService) => {
      if (editedExternalService) {
        externalService.name = editedExternalService.name;
        externalService.url = editedExternalService.url;
        externalService.icon = editedExternalService.icon;
      }
    });
  }

  deleteExternalService(externalService: ExternalService): void {
    const index = this.externalServices.indexOf(externalService);

    if (index >= 0) {
      this.externalServices.splice(index, 1);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.externalServices, event.previousIndex, event.currentIndex);
  }

  trackByService(_: number, externalService: ExternalService): string {
    return externalService.name + externalService.url;
  }
}
