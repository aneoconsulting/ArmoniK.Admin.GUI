import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExternalService, ManageExternalServicesDialogData } from '@app/types/external-service';
import { IconsService } from '@services/icons.service';
import { ResponsiveService } from '@services/responsive.service';
import { FormExternalServiceComponent } from './form-external-service.component';

@Component({
  selector: 'app-manage-external-services',
  templateUrl: './manage-external-services-dialog.component.html',
  styleUrl: 'external-services.css',
  standalone: true,
  providers: [],
  imports: [
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormExternalServiceComponent,
  ],
})
export class ManageExternalServicesDialogComponent implements OnInit {
  private readonly iconsService = inject(IconsService);
  private readonly responsiveService = inject(ResponsiveService);
  
  externalServices: ExternalService[] = [];
  editedService: ExternalService | undefined = undefined;

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
    return this.iconsService.getIcon(name);
  }

  editExternalService(externalService: ExternalService): void {
    this.editedService = externalService;
  }

  onEditExternalService(externalService: ExternalService): void {
    if (this.editedService) {
      const index = this.externalServices.indexOf(this.editedService);
      this.externalServices[index] = externalService;
      this.editedService = undefined;
    }
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

  onNewService(service: ExternalService) {
    this.externalServices.push(service);
  }
}
