import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'app-refresh-button',
  template: `
    <button mat-flat-button color="primary" (click)="onClick()" [matTooltip]="tooltip">
      <mat-icon aria-hidden="true" fontIcon="refresh"></mat-icon>
      <span>Refresh</span>
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
  @Input() tooltip: string = "";

  @Output() refreshChange: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.refreshChange.emit();
  }
}
