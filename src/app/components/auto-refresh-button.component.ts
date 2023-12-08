import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AutoRefreshDialogComponent } from '@components/auto-refresh-dialog.component';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-auto-refresh-button',
  template: `
<button mat-stroked-button [class]="isDisabled() ? 'auto-refresh-disabled' : ''" (click)="openAutoRefreshDialog()">
  <mat-icon aria-hidden="true" [fontIcon]="getIcon('auto-refresh')"></mat-icon>
  <span i18n="Open a dialog on click">Set up Auto Refresh - {{intervalDisplay}}</span>
</button>
  `,
  styles: [`
    .auto-refresh-disabled {
      border: 0px;
      color: #8A8A8A;
      background-color: #D7D7D7;   
    }
  `],
  standalone: true,
  imports: [
    AutoRefreshButtonComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AutoRefreshButtonComponent implements OnInit{
  #iconsService = inject(IconsService);
  intervalDisplay: string;
  @Input({ required: true }) intervalValue: number;

  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.intervalDisplay = this.intervalValue == 0 ? 'Disabled' : (this.intervalValue + ' seconds');
  }
  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }
  
  emit(value: number): void {
    this.intervalValueChange.emit(value);
  }
  
  openAutoRefreshDialog(): void {
    // Get value from the storage
    const dialogRef = this._dialog.open(AutoRefreshDialogComponent, {
      data: {
        value: this.intervalValue
      }
    });
    
    dialogRef.afterClosed().subscribe(value => {
      if (value === undefined) {
        return;
      }   
      this.emit(value);
      this.intervalDisplay = value == 0 ? 'Disabled' : (value + ' seconds');
    });  
  }

  isDisabled(): boolean {
    return this.intervalValue === 0;
  }
}
