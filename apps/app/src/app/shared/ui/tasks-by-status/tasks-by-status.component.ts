import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus } from '@armonik.admin.gui/shared/data-access';
import { ClrIconModule, ClrInputModule, ClrModalModule } from '@clr/angular';
import { RenameGroupComponent } from '../../../dashboard/ui/rename-goup/rename-group.component';
import { Group, Item, StoredGroup, StoredRemovedItem } from '../../../dashboard/utils/types';
import { ViewRemovedItemsComponent } from '../../../dashboard/ui/view-removed-items/view-removed-items.component';
import { GroupActionsButtonComponent } from '../../../dashboard/ui/group-actions-button/group-actions-button.component';
import { CreateNewGroupComponent } from '../../../dashboard/ui/create-new-group/create-new-group.component';

type StatusItem = {
  className: string;
  group: number;
  name: string;
  value: number;
};

@Component({
  standalone: true,
  selector: 'app-tasks-by-status',
  templateUrl: './tasks-by-status.component.html',
  styleUrls: ['./tasks-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, AsyncPipe, PercentPipe, DragDropModule, ClrIconModule, ClrModalModule, FormsModule, ClrInputModule, RenameGroupComponent, ViewRemovedItemsComponent, GroupActionsButtonComponent, CreateNewGroupComponent],
})
export class TasksByStatusComponent implements OnInit, OnChanges {
  @Input() data: { status: number; count: number }[] | null;

  // Storage
  public groupsStorageKey = 'task-status-groups';
  public removedItemsStorageKey = 'task-status-removed-items';

  // Items
  public removedItems: Item[] = [];
  public groups: Group[] = [];

  // Modals
  public isModalViewRemovedItemsOpened = false;
  public isModalAddGroupOpened = false;
  public isModalRenameGroupOpened = false;

  public groupToRename: Group | null = null;
  public groupNewName = '';


  public ngOnInit() {
    const { groups, removedItems } = this._load();

    const parsedGroups = this._parseLoadedGroups(groups) ?? this._defaultGroups;
    const parsedRemovedItems = this._parseLoadedRemovedItems(removedItems) ?? [];

    const { filteredGroups, newItems } = this._filterGroups(parsedGroups, this._defaultGroups);


    const filteredRemovedItems = this._filterRemovedItems(parsedRemovedItems, newItems);

    this.groups = filteredGroups;
    this.removedItems = filteredRemovedItems;

    this._updateData()
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this._updateData()
    }
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


  public trackByItems(_: number, groups: Group) {
    return groups.items.map((i) => i.id).join('-');
  }

  public trackByItem(_: number, item: Item) {
    return item.id;
  }

  public createNewGroup() {
    this.groups.push({
      name: 'New group',
      color: 'orange',
      items: [],
    });
  }

  public onNewGroup(group: Group) {
    // We need to create a new group in order to avoid the same reference
    this.groups.push({
      name: group.name,
      color: group.color,
      items: [],
    });
    this._save();
  }

  public deleteGroup(group: Group) {
    this.groups = this.groups.filter((g) => g !== group)
    // Set items to removed items
    this.removedItems = [...this.removedItems, ...group.items];

    this._save();
  }


  public openModalViewRemovedItems() {
    this.isModalViewRemovedItemsOpened = true;
  }

  public onRemovedItemsChange() {
    this._updateData()
    this._save()
  }


  public openModalAddGroup() {
    this.isModalAddGroupOpened = true;
  }

  public openModalRenameGroup(group: Group) {
    this.isModalRenameGroupOpened = true;
    this.groupToRename = group;
  }

  public onGroupNameChange() {
    this._save();
  }

  public onRenameGroup(name: string) {
    const group = this.groupToRename;

    if (group && name) {
      group.name = name;
    }

    this._save();
  }


  drop(event: CdkDragDrop<Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this._save();
  }

  public onRemove(item: Item) {
    this.removedItems.push(item);

    this._removeItemFromGroups(item);

    this._save();
  }

  private _statusMap = new Map<number, StatusItem>([
    [
      TaskStatus.TASK_STATUS_UNSPECIFIED,
      {
        className: 'unspecified',
        group: 1,
        name: $localize`Unspecified`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_CREATING,
      {
        className: 'creating',
        group: 2,
        name: $localize`Creating`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_SUBMITTED,
      {
        className: 'submitted',
        group: 2,
        name: $localize`Submitted`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_DISPATCHED,
      {
        className: 'dispatched',
        group: 2,
        name: $localize`Dispatched`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_PROCESSING,
      {
        className: 'processing',
        group: 3,
        name: $localize`Processing`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_PROCESSED,
      {
        className: 'processed',
        group: 3,
        name: $localize`Processed`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_COMPLETED,
      {
        className: 'completed',
        group: 4,
        name: $localize`Completed`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_CANCELLING,
      {
        className: 'cancelling',
        group: 6,
        name: $localize`Cancelling`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_CANCELLED,
      {
        className: 'cancelled',
        group: 6,
        name: $localize`Cancelled`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_TIMEOUT,
      {
        className: 'timeout',
        group: 5,
        name: $localize`Timeout`,
        value: 0,
      },
    ],
    [
      TaskStatus.TASK_STATUS_ERROR,
      {
        className: 'error',
        group: 5,
        name: $localize`Error`,
        value: 0,
      },
    ],
  ]);

  public formattedData() {
    // Reset all values
    for (const [key, value] of this._statusMap) {
      value.value = 0;
      this._statusMap.set(key, value);
    }

    if (this.data) {
      // Update values
      this.data.forEach(({ status, count }) => {
        const item = this._statusMap.get(status);
        if (item) {
          item.value = count;
          this._statusMap.set(status, item);
        }
      });
    }

    const groups = new Map<number, any>();
    for (const [_, value] of this._statusMap) {
      if (groups.has(value.group)) {
        groups.set(value.group, [...groups.get(value.group), value]);
      } else {
        groups.set(value.group, [value]);
      }
    }

    return Array.from(groups, ([key, value]) => ({ key, value }));
  }

  public total() {
    if (!this.data) {
      return 0;
    }

    return this.data.reduce((acc, item) => acc + item.count, 0);
  }

  public trackGroup(_: number, group: { key: number }) {
    return group.key;
  }

  public trackStatus(_: number, status: StatusItem) {
    return status.name;
  }

  private _save() {
    const groupsData: StoredGroup[] = this.groups.map((group) => ({
      name: group.name,
      color: group.color,
      items: group.items.map((item) => (item.id)),
    }));
    const removedItemsData: StoredRemovedItem[] = this.removedItems.map((item) => (item.id));

    localStorage.setItem(this.groupsStorageKey, JSON.stringify(groupsData));
    localStorage.setItem(this.removedItemsStorageKey, JSON.stringify(removedItemsData));
  }

  private _load(): { groups: StoredGroup[] | null, removedItems: StoredRemovedItem[] | null } {
    const groups = localStorage.getItem(this.groupsStorageKey);
    const removedItems = localStorage.getItem(this.removedItemsStorageKey);

    return {
      groups: groups ? JSON.parse(groups) : null,
      removedItems: removedItems ? JSON.parse(removedItems) : null,
    };
  }

  private _filterGroups(groups: Group[], defaultGroups: Group[]): { filteredGroups: Group[], newItems: Item[] } {
    const defaultItems = defaultGroups.reduce((acc, group) => [...acc, ...group.items], [] as Item[]);

    // Check if an item is in a group but not in the default group. If so, remove it completely
    const filteredGroups: Group[] = groups.map((group) => {
      const filteredItems = group.items.filter((item) => defaultItems.find((defaultItem) => defaultItem.id === item.id));

      return {
        ...group,
        items: filteredItems,
      };
    });

    // Check if an item is not in a group but in the default group. If so, we return it as a new item
    const newItems: Item[] = defaultItems.filter((item) => !filteredGroups.find((group) => group.items.find((groupItem) => groupItem.id === item.id)));


    return {
      filteredGroups,
      newItems,
    }
  }

  private _filterRemovedItems(removedItems: Item[], items: Item[]): Item[] {

    const mergedItems = [...removedItems, ...items];

    const filteredRemovedItems = mergedItems.filter((item, index) => {
      const firstIndex = mergedItems.findIndex((mergedItem) => mergedItem.id === item.id);
      // Remove the current item if another item with the same id is found before it
      return firstIndex === index;
    });


    return filteredRemovedItems;
  }
  private _parseLoadedGroups(groups: StoredGroup[] | null): Group[] | null {
    if (!groups) {
      return null;
    }

    const parsedGroups: Group[] = groups.map((group) => ({
      name: group.name,
      color: group.color,
      items: group.items.map((item) => ({
        value: 0,
        id: item,
        name: this._taskStatusIdToName(item),
      })),
    }));

    return parsedGroups;
  }
  private _parseLoadedRemovedItems(removedItems: StoredRemovedItem[] | null): Item[] | null {
    if (!removedItems) {
      return null;
    }

    const parsedItems: Item[] = removedItems.map((item) => ({
      value: 0,
      id: item,
      name: this._taskStatusIdToName(item),
    }));

    return parsedItems;
  }

  // TODO: Add this to a shared service about task (utils)
  private _taskStatusIdToName(id: TaskStatus): string {
    const taskStatusIds = Object.keys(TaskStatus).filter((key) => isNaN(Number(key))) as Array<keyof typeof TaskStatus>;

    const name = taskStatusIds.find((key) => TaskStatus[key] === id);

    return name ? name.replace('TASK_STATUS_', '').toLowerCase() : '';
  }

  private _removeItemFromGroups(item: Item) {
    this.groups.forEach((group) => {
      group.items = group.items.filter((groupItem) => groupItem.id !== item.id);
    });
  }

  private _defaultGroups: Group[] = [
    {
      name: 'Unspecified',
      color: 'grey',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_UNSPECIFIED,
          name: 'unspecified',
        },
      ],
    },
    {
      name: 'In progress',
      color: 'orange',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_CREATING,
          name: 'creating',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_SUBMITTED,
          name: 'submitted',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_DISPATCHED,
          name: 'dispatched',
        },
      ],
    },
    {
      name: 'Running',
      color: 'yellow',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_PROCESSING,
          name: 'processing',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_PROCESSED,
          name: 'processed',
        },
      ],
    },
    {
      name: 'Completed',
      color: 'green',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_COMPLETED,
          name: 'completed',
        },
      ],
    },
    {
      name: 'Cancelled',
      color: 'amber',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_CANCELLING,
          name: 'cancelling',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_CANCELLED,
          name: 'cancelled',
        },
      ],
    },
    {
      name: 'Failed',
      color: 'red',
      items: [
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_TIMEOUT,
          name: 'timeout',
        },
        {
          value: 0,
          id: TaskStatus.TASK_STATUS_ERROR,
          name: 'error',
        },
      ],
    }
  ]
}
