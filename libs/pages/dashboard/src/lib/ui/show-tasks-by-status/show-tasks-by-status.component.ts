import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrIconModule, ClrInputModule, ClrModalModule } from '@clr/angular';
import { Group } from '../../types/group.type';
import { Item } from '../../types/item.type';
import { CreateNewGroupComponent } from '../create-new-group/create-new-group.component';
import { GroupActionsButtonComponent } from '../group-actions-button/group-actions-button.component';
import { ManageRemovedItemsComponent } from '../manage-removed-items/manage-removed-items.component';
import { RenameGroupComponent } from '../rename-goup/rename-group.component';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard-show-tasks-by-status',
  templateUrl: './show-tasks-by-status.component.html',
  styleUrls: ['./show-tasks-by-status.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // Performance issue
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    PercentPipe,
    DragDropModule,
    ClrIconModule,
    ClrModalModule,
    FormsModule,
    ClrInputModule,
    RenameGroupComponent,
    ManageRemovedItemsComponent,
    GroupActionsButtonComponent,
    CreateNewGroupComponent,
  ],
})
export class ShowTasksByStatusComponent implements OnChanges {
  // Settings
  @Input() enableMoveItem = false;
  @Input() enableRemoveItem = false;
  @Input() enableRenameGroup = false;
  @Input() enableDeleteGroup = false;

  // Data
  @Input() data: { status: number; count: number }[] | null;
  @Input() groups: Group[] = [];

  @Output() public moveItem = new EventEmitter<void>();
  @Output() public hideItem = new EventEmitter<Item['id']>();
  @Output() public renameGroup = new EventEmitter<{
    oldName: string;
    newName: string;
  }>();
  @Output() public deleteGroup = new EventEmitter<Group['name']>();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this._updateData();
    }
  }

  public onRenameGroup({
    oldName,
    newName,
  }: {
    oldName: string;
    newName: string;
  }) {
    this.renameGroup.emit({ oldName, newName });
  }

  public onDeleteGroup(group: Group) {
    this.deleteGroup.emit(group.name);
  }

  public onHideItem(item: Item) {
    this.hideItem.emit(item.id);
  }

  public drop(event: CdkDragDrop<Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.moveItem.emit();
  }

  public total() {
    if (!this.data) {
      return 0;
    }

    return this.data.reduce((acc, item) => acc + item.count, 0);
  }

  public trackByItems(_: number, groups: Group) {
    return groups.items.map((i) => i.id).join('-');
  }

  public trackByItem(_: number, item: Item) {
    return item.id;
  }

  private _updateData() {
    // Reset values
    this.groups.forEach((group) => {
      group.items.forEach((item) => {
        item.value = 0;
      });
    });
    // Update values
    this.data?.forEach((item) => {
      this.groups.forEach((group) => {
        group.items.forEach((groupItem) => {
          if (item.status === groupItem.id) {
            groupItem.value = item.count;
          }
        });
      });
    });
  }
}
