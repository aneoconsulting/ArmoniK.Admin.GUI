import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconButton,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
  ],
  providers: [
    IconsService,
    NavigationService
  ],
  standalone: true,
  styleUrl: 'external-services.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalServicesComponent implements OnInit {
  readonly navigationService = inject(NavigationService);
  readonly iconsService = inject(IconsService);
  readonly dialog = inject(MatDialog);

  hasService = false;
  private _externalServices  = signal<ExternalService[]>([]);

  set externalServices(entries: ExternalService[] | undefined) {
    if (entries) {
      this._externalServices.set(entries);
      this.hasService = entries.length > 0;
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

  navigate(url: string) {
    window.open(url, '_blank');
  }
}