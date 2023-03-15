import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ClrInputModule, ClrModalModule } from "@clr/angular";
import { FormsModule } from "@angular/forms";
import { Group } from "../../types/group.type";
import { GroupActionsButtonComponent } from "../group-actions-button/group-actions-button.component";

@Component({
  standalone: true,
  selector: "armonik-admin-gui-dashboard-rename-group",
  templateUrl: "./rename-group.component.html",
  styleUrls: ["./rename-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrModalModule, ClrInputModule, FormsModule, GroupActionsButtonComponent]
})
export class RenameGroupComponent {
  @Input() public group: Group;
  @Output() public groupChange = new EventEmitter<{ oldName: string, newName: string }>();

  public open = false;
  public newGroupName = '';

  public openModal(): void {
    this.open = true;
  }

  public closeModal(): void {
    this.newGroupName = '';
    this.open = false
  }

  public rename(): void {
    this.groupChange.emit({ oldName: this.group.name, newName: this.newGroupName });
    this.closeModal();
  }
}
