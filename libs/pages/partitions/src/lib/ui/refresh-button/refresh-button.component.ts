import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { ClrIconModule } from "@clr/angular";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss'],
  imports: [
    ClrIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefreshButtonComponent {
  @Output() refresh = new EventEmitter<void>();

  public onClick() {
    this.refresh.emit();
  }
}
