import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { ClrFormsModule, ClrModalModule, ClrSelectModule } from "@clr/angular";
import { FormsModule } from "@angular/forms";
import { Color } from "../../types/color.type";
import { Group } from "../../types/group.type";
import { Item } from "../../types/item.type";


@Component({
  standalone: true,
  selector: "armonik-admin-gui-dashboard-create-new-group",
  templateUrl: "./create-new-group.component.html",
  styleUrls: ["./create-new-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrModalModule, ClrFormsModule, FormsModule, ClrSelectModule]
})
export class CreateNewGroupComponent {
  @Output() public createNewGroup = new EventEmitter<Group>();

  public open = false;

  public newGroupName = '';
  public newGroupColor: Color | null = null;
  public newGroupItems: Item[] = [];

  public openModal(): void {
    this.open = true;
  }

  public closeModal(): void {
    this.open = false
    this.newGroupColor = null;
    this.newGroupName = '';
    this.newGroupItems = [];
  }

  public createGroup(): void {
    this.createNewGroup.emit({
      color: this.newGroupColor ?? 'grey',
      name: this.newGroupName,
      items: this.newGroupItems
    });
    this.closeModal();
  }

  public onSelectColor(event: Event): void {
    const color = (event.target as HTMLSelectElement)?.value;
    this.newGroupColor = color as Color;
  }
}
