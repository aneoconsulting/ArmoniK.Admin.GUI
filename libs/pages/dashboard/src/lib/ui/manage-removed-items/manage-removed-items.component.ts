import { AsyncPipe, NgFor } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrInputModule, ClrModalModule } from '@clr/angular';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../../types/group.type';
import { Item } from '../../types/item.type';
import { GroupActionsButtonComponent } from '../group-actions-button/group-actions-button.component';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard-manage-removed-items',
  templateUrl: './manage-removed-items.component.html',
  styleUrls: ['./manage-removed-items.component.scss'],
  // Document more about this in order to understand why sometimes it doesn't work
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ClrModalModule,
    ClrInputModule,
    FormsModule,
    NgFor,
    GroupActionsButtonComponent,
    ClrFormsModule,
    AsyncPipe
  ],
})
export class ManageRemovedItemsComponent {
  @Output() public updateRemovedItems = new EventEmitter<
    Map<Item['id'], Group>
  >();

  @Input() public items: Item[] = [];
  @Input() public groups: Group[] = [];

  private _items$ = new BehaviorSubject<Item[]>(this.items);

  public open = false;
  private _pairing = new Map<Item['id'], Group>();

  public openModal(): void {
    this.open = true;
  }

  public closeModal(): void {
    this.open = false;
  }

  public updateItems(): void {
    this.updateRemovedItems.emit(this._pairing);
    this.closeModal();
  }

  /**
   * Assign a group to an item using the user selection
   *
   * @param item The item to assign a group to
   * @param event The event that triggered the function
   *
   * @returns void
   */
  public onSelectGroup(item: Item, event: Event): void {
    const groupName = (event.target as HTMLSelectElement)?.value;
    const group = this.groups.find((group) => group.name === groupName);

    if (!group) {
      return;
    }

    this._pairing.set(item.id, group);
  }
}
