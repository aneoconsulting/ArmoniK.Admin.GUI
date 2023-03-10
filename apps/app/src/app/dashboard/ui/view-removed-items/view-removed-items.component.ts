import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClrFormsModule, ClrInputModule, ClrModalModule } from "@clr/angular";
import { Group, Item } from "../../utils/types";
import { NgFor } from "@angular/common";
import { GroupActionsButtonComponent } from "../group-actions-button/group-actions-button.component";

@Component({
  standalone: true,
  selector: "app-dashboard-view-removed-items",
  templateUrl: "./view-removed-items.component.html",
  styleUrls: ["./view-removed-items.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrModalModule, ClrInputModule, FormsModule, NgFor, GroupActionsButtonComponent, ClrFormsModule]
})
export class ViewRemovedItemsComponent {
  @Output() public applyChange = new EventEmitter<boolean>();

  @Input() public items: Item[] = [];
  @Input() public groups: Group[] = [];

  public open = false;
  private _pairing = new Map<Item['id'], Group>();

  public openModal(): void {
    this.open = true;
  }

  public closeModal(): void {
    this.open = false
  }

  public updateItems(): void {
    this._pairRemovedItems();
    this.closeModal();
    this.applyChange.emit(true);
  }

  public onSelectGroup(item: Item, event: Event): void {
    const groupName = (event.target as HTMLSelectElement)?.value;
    const group = this.groups.find(group => group.name === groupName);

    if (!group) {
      return;
    }

    this._pairing.set(item.id, group);
  }

  private _pairRemovedItems(): void {
    this.items.forEach(item => {
      const group = this._pairing.get(item.id);

      console.log(group);

      if (!group) {
        return;
      }

      group.items.push(item);
      this.items.splice(this.items.indexOf(item), 1);
    });

    this._pairing.clear();
  }
}
