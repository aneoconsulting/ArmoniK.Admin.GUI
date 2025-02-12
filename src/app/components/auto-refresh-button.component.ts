import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoRefreshButtonComponent implements OnInit{
  private readonly iconsService = inject(IconsService);
  intervalDisplay: string;

  private readonly _intervalValue = signal<number>(-1);
  private readonly _isDisabled = computed(() => this._intervalValue() === 0);

  @Input({ required: true }) set intervalValue(value: number) {
    this._intervalValue.set(value);
  }

  get isDisabled(): boolean {
    return this._isDisabled();
  }

  get intervalValue() {
    return this._intervalValue();
  }

  @Output() intervalValueChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private readonly _dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.intervalDisplay = this.isDisabled ? $localize`:Button disabled@@autoRefreshButton:Disabled` : (this.intervalValue + $localize` seconds`);
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
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
        this.intervalDisplay = this.isDisabled ? $localize`:Button disabled@@autoRefreshButton:Disabled` : (this.intervalValue + $localize` seconds`);
        this.emit(value);
      }
    });  
  }
}
