import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-refresh-button',
  template: `
<button mat-flat-button color="primary" (click)="onClick()" [matTooltip]="tooltip">
  <mat-icon aria-hidden="true" [fontIcon]="getIcon('refresh')"></mat-icon>
  <span i18n>Refresh</span>
</button>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule
  ]
})
export class RefreshButtonComponent {
  #iconsService = inject(IconsService);

  @Input() tooltip = '';

  @Output() refreshChange: EventEmitter<void> = new EventEmitter<void>();

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  emit(): void {
    this.refreshChange.emit();
  }

  onClick() {
    this.emit();
  }
}
