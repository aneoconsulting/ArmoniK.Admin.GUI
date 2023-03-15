import { Injectable } from "@angular/core";
import { StoredGroup } from "../types/stored-group.item";
import { StoredRemovedItem } from "../types/stored-removed-item.type";
import { Group } from "../types/group.type";
import { Item } from "../types/item.type";
import { TaskStatus } from "@armonik.admin.gui/shared/data-access";
import { DashboardDefaultGroupService } from "./dashboard-default-group.service";

@Injectable()
export class DashboardTasksService {
  // Storage
  public groupsStorageKey = 'task-status-groups';
  public removedItemsStorageKey = 'task-status-removed-items';

  // Items
  private _removedItems: Item[] = [];
  private _groups: Group[] = [];

  constructor(public readonly dashboardDefaultGroupService: DashboardDefaultGroupService) {
    // Get raw data from storage
    const { groups, removedItems } = this._loadFromStorage();

    // Parse raw data
    const parsedGroups = this._parseLoadedGroups(groups) ?? this.dashboardDefaultGroupService.defaultGroups;
    const parsedRemovedItems = this._parseLoadedRemovedItems(removedItems) ?? [];

    // Filter data in order to update it if needed (change in task statuses)
    const { filteredGroups, newItems } = this._filterGroups(parsedGroups, this.dashboardDefaultGroupService.defaultGroups);


    const filteredRemovedItems = this._filterRemovedItems(parsedRemovedItems, newItems);

    this._groups = filteredGroups;
    this._removedItems = filteredRemovedItems;
  }

  public load(): { groups: Group[], removedItems: Item[] } {
    return {
      groups: this._groups,
      removedItems: this._removedItems,
    };
  }

  public save({ groups, removedItems }: { groups: Group[], removedItems: Item[] }): void {
    this._saveGroups(groups);
    this._saveItems(removedItems);
  }

  private _saveGroups(groups: Group[]) {
    const groupsData: StoredGroup[] = groups.map((group) => ({
      name: group.name,
      color: group.color,
      items: group.items.map((item) => (item.id)),
    }));

    localStorage.setItem(this.groupsStorageKey, JSON.stringify(groupsData));
  }

  private _saveItems(items: Item[]) {
    const removedItemsData: StoredRemovedItem[] = items.map((item) => (item.id));

    localStorage.setItem(this.removedItemsStorageKey, JSON.stringify(removedItemsData));
  }

  private _loadFromStorage(): { groups: StoredGroup[] | null, removedItems: StoredRemovedItem[] | null } {
    const groups = localStorage.getItem(this.groupsStorageKey);
    const removedItems = localStorage.getItem(this.removedItemsStorageKey);

    return {
      groups: groups ? JSON.parse(groups) : null,
      removedItems: removedItems ? JSON.parse(removedItems) : null,
    };
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


  private _filterRemovedItems(removedItems: Item[], items: Item[]): Item[] {

    const mergedItems = [...removedItems, ...items];

    const filteredRemovedItems = mergedItems.filter((item, index) => {
      const firstIndex = mergedItems.findIndex((mergedItem) => mergedItem.id === item.id);
      // Remove the current item if another item with the same id is found before it
      return firstIndex === index;
    });

    return filteredRemovedItems;
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

  private _taskStatusIdToName(id: TaskStatus): string {
    const taskStatusIds = Object.keys(TaskStatus).filter((key) => isNaN(Number(key))) as Array<keyof typeof TaskStatus>;

    const name = taskStatusIds.find((key) => TaskStatus[key] === id);

    return name ? name.replace('TASK_STATUS_', '').toLowerCase() : '';
  }
}
