import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExternalService } from '@app/types/external-service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { ManageExternalServicesDialogComponent } from './manage-external-services-dialog.component';

@Component({
  selector: 'app-external-services',
  templateUrl: 'external-services.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  providers: [
    IconsService,
    NavigationService
  ],
  styleUrl: 'external-services.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalServicesComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);

  private readonly _externalServices = signal<ExternalService[]>([]);

  set externalServices(entries: ExternalService[] | undefined) {
    if (entries) {
      this._externalServices.set(entries);
    }
  }

  get externalServices(): ExternalService[] {
    return this._externalServices();
  }

  ngOnInit(): void {
    this.externalServices = this.navigationService.restoreExternalServices();
  }

  getIcon(name: string | undefined) {
    return this.iconsService.getIcon(name);
  }

  manageExternalServices() {
    const dialogRef = this.dialog.open(ManageExternalServicesDialogComponent, {
      data: {
        externalServices: this.externalServices,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.externalServices = result;
        this.saveServices();
      }
    });
  }

  saveServices() {
    this.navigationService.saveExternalServices(this.externalServices);
  }
}