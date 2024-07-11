import { Component, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subject } from 'rxjs';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-inspection-toolbar',
  templateUrl: 'inspection-toolbar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    IconsService
  ],
  styles: [`
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%
  }
  
  mat-toolbar {
    justify-content: center;
    gap: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  mat-toolbar-row {
    height: fit-content;
  }  
  `]
})
export class InspectionToolbarComponent {
  private readonly iconsService = inject(IconsService);
  readonly refreshIcon = this.iconsService.getIcon('refresh');

  @Output() refresh = new Subject<void>();
}