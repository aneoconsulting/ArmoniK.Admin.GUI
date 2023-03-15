import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import { map, switchMap, tap, timer } from 'rxjs';
import { ShowTasksByStatusComponent } from '../../ui/show-tasks-by-status/show-tasks-by-status.component';
import { CreateNewGroupComponent } from '../../ui/create-new-group/create-new-group.component';
import { Group } from '../../types/group.type';
import { ManageRemovedItemsComponent } from '../../ui/manage-removed-items/manage-removed-items.component';
import { DashboardTasksService } from '../../data-access/dashboard-tasks.service';
import { DashboardDefaultGroupService } from '../../data-access/dashboard-default-group.service';
import { Item } from '../../types/item.type';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard-tasks-grouped-by-status',
  templateUrl: './tasks-grouped-by-status.component.html',
  styleUrls: ['./tasks-grouped-by-status.component.scss'],
  imports: [
    ManageRemovedItemsComponent,
    ShowTasksByStatusComponent,
    CreateNewGroupComponent,
    NgIf,
    AsyncPipe,
  ],
  providers: [
    GrpcTasksService,
    GrpcParamsService,
    DashboardTasksService,
    DashboardDefaultGroupService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksGroupedByStatusComponent implements OnInit {
  public removedItems: Item[] = [];
  public groups: Group[] = [];

  public total: number | null = null;

  public loadTasks$ = timer(0, 2000).pipe(
    switchMap(() => this._grpcTasksService.countTasksByStatus$()),
    map((data) => {
      return data.status ?? [];
    }),
    tap((status) => {
      this.total = this._calculateTotal(status);
    })
  );

  constructor(
    private _grpcTasksService: GrpcTasksService,
    private _dashboardTasksService: DashboardTasksService
  ) {}

  public ngOnInit(): void {
    const { groups, removedItems } = this._dashboardTasksService.load();
    this.groups = groups;
    this.removedItems = removedItems;
  }

  /**
   * This method is called when the user have moved an item. The behavior is handled by the component itself.
   */
  public onMoveItem(): void {
    this._save();
  }

  /**
   * This method is called when the user want to hide an item.
   *
   * @param itemId The id of the item to hide.
   *
   * @returns void
   */
  public onHideItem(itemId: Item['id']): void {
    const item = this.groups.reduce((acc, group) => {
      const item = group.items.find((item) => item.id === itemId);

      if (item) {
        group.items.splice(group.items.indexOf(item), 1);
        acc = item;
      }

      return acc;
    }, null as Item | null);

    if (!item) {
      return;
    }

    this.removedItems.push(item);

    this._save();
  }

  /**
   * This method is called when the user want to rename an existing group.
   *
   * @param data An object containing the old name and the new name.
   *
   * @returns void
   */
  public onRenameGroup({
    oldName,
    newName,
  }: {
    oldName: string;
    newName: string;
  }): void {
    const group = this.groups.find((group) => group.name === oldName);

    if (!group) {
      return;
    }

    group.name = newName;

    this._save();
  }

  /**
   * This method is called when the user want to delete a group.
   *
   * @param groupName The name of the group to delete.
   *
   * @returns void
   */
  public onDeleteGroup(groupName: string): void {
    const group = this.groups.find((group) => group.name === groupName);

    if (!group) {
      return;
    }

    this.removedItems.push(...group.items);
    this.groups.splice(this.groups.indexOf(group), 1);

    this._save();
  }

  /**
   * This method is called when the user want to map a removed item to a group.
   *
   * @param pairing A map of item id and group.
   *
   * @returns void
   */
  public onUpdateRemovedItems(pairing: Map<Item['id'], Group>): void {
    this.removedItems.forEach((item) => {
      const group = pairing.get(item.id);

      console.log(group);

      if (!group) {
        return;
      }

      group.items.push(item);
      this.removedItems.splice(this.removedItems.indexOf(item), 1);
    });

    this._save();
  }

  /**
   * This method is called when the user creates a new group and create a new empty group in the list.
   *
   * @param group The new group.
   * @returns void
   */
  public onCreatedNewGroup(group: Group): void {
    // We need to create a new group in order to avoid the same reference
    this.groups.push({
      name: group.name,
      color: group.color,
      items: [],
    });

    this._save();
  }

  private _save(): void {
    this._dashboardTasksService.save({
      groups: this.groups,
      removedItems: this.removedItems,
    });
  }

  private _calculateTotal(data: { count: number }[]): number {
    return data.reduce((acc, item) => acc + item.count, 0);
  }
}
