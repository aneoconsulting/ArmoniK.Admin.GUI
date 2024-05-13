import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AutoRefreshDialogComponent } from '@components/auto-refresh-dialog.component';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-auto-refresh-button',
  templateUrl:'./auto-refresh-button.component.html',
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

  private _isDisabled = false;
  
  ngOnInit(): void {
    this.intervalDisplay = this.intervalValue === 0 ? $localize`:Button disabled@@autoRefreshButton:Disabled` : (this.intervalValue + $localize` seconds`);
    this.setDisabled();
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  setDisabled() {
    this._isDisabled = this.intervalValue === 0;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }
  
  emit(value: number): void {
    this.intervalValueChange.emit(value);
  }
  
  openAutoRefreshDialog(): void {
    const dialogRef = this._dialog.open(AutoRefreshDialogComponent, {
      data: {
        value: this.intervalValue
      }
    });
    
    dialogRef.afterClosed().subscribe(value => {
      if (value !== undefined) {
        this.intervalValue = value;
        this.setDisabled();
        this.intervalDisplay = this.isDisabled ? $localize`:Button disabled@@autoRefreshButton:Disabled` : (this.intervalValue + $localize` seconds`);
        this.emit(value);
      }
    });  
  }
}
