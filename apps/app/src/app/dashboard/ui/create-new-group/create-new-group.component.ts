import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { ClrFormsModule, ClrModalModule, ClrSelectModule } from "@clr/angular";
import { Color, Group, Item } from "../../utils/types";
import { FormsModule } from "@angular/forms";


@Component({
  standalone: true,
  selector: "app-dashboard-create-new-group",
  templateUrl: "./create-new-group.component.html",
  styleUrls: ["./create-new-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrModalModule, ClrFormsModule, FormsModule, ClrSelectModule]
})
export class CreateNewGroupComponent {
  @Output() public newGroup = new EventEmitter<Group>();

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
    this.newGroup.emit({
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
