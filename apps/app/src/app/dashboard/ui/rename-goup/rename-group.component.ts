import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Group } from "../../utils/types";
import { ClrInputModule, ClrModalModule } from "@clr/angular";
import { FormsModule } from "@angular/forms";
import { GroupActionsButtonComponent } from "../group-actions-button/group-actions-button.component";

@Component({
  standalone: true,
  selector: "app-dashboard-rename-group",
  templateUrl: "./rename-group.component.html",
  styleUrls: ["./rename-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrModalModule, ClrInputModule, FormsModule, GroupActionsButtonComponent]
})
export class RenameGroupComponent {
  @Input() public group: Group;
  @Output() public groupChange = new EventEmitter<Group>();


  public open = false;
  public newGroupName = '';

  public openModal(): void {
    this.open = true;
  }

  public closeModal(): void {
    this.open = false
  }

  public rename(): void {
    this.group.name = this.newGroupName;
    this.groupChange.emit(this.group);
    this.closeModal();
  }
}
