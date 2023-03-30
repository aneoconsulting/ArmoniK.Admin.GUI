import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { ClrDropdownModule, ClrIconModule } from "@clr/angular";

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-actions-dropdown',
  templateUrl: './actions-dropdown.component.html',
  styleUrls: ['./actions-dropdown.component.scss'],
  imports: [
    ClrIconModule,
    ClrDropdownModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsDropdownComponent {
  @Output() clearSort = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();

  public onClearSorting() {
    this.clearSort.emit();
  }

  public onClearFilters() {
    this.clearFilters.emit();
  }
}
