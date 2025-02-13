import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { GroupConditions } from '@app/types/groups';
import { FiltersDialogOrComponent } from '@components/filters/filters-dialog-or.component';
import { IconsService } from '@services/icons.service';

/**
 * Data required by the ManageTableGroupsDialog component in order to manage groups correctly.
 * - groups: Array of GroupConditions, all currently created groups.
 * - selected: string, represent a name of a group to focus when the dialog opens.
 */
export type ManageGroupsTableDialogInput<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> = {
  groups: GroupConditions<F, FO>[];
  selected?: string;
}

/**
 * Data returned by the ManageTableGroupsDialog component in order to modify groups in the simpliest way possible.
 * - addedGroups: Array of GroupConditions, Groups to add once the dialog is closed.
 * - editedGroups: Record according a string to GroupCondition.
 * - deletedGroups: Array of string, names of groups to delete once the dialog is closed.
 */
export type ManageGroupsTableDialogResult<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> = {
  addedGroups: GroupConditions<F, FO>[];
  editedGroups: Record<string, GroupConditions<F, FO>>;
  deletedGroups: string[];
}

/**
 * Dialog made to manage (create, edit and delete) group conditions for a specific table.
 */
@Component({
  selector: 'app-manage-groups-dialog',
  templateUrl: 'manage-groups-dialog.component.html',
  styleUrl: 'manage-groups-dialog.component.css',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FiltersDialogOrComponent,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ManageTableGroupsDialogComponent<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
  private readonly dialogRef: MatDialogRef<ManageTableGroupsDialogComponent<F, FO>, ManageGroupsTableDialogResult<F, FO>> = inject(MatDialogRef);
  private readonly iconsService = inject(IconsService);

  groups: GroupConditions<F, FO>[];

  private readonly addedGroups: GroupConditions<F, FO>[] = [];
  private readonly editedGroups: Record<string, GroupConditions<F, FO>> = {};
  private readonly deletedGroups: string[] = [];

  selectedGroup: GroupConditions<F, FO> | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) dialogData: ManageGroupsTableDialogInput<F, FO>) {
    this.groups = structuredClone(dialogData.groups);
    if (dialogData.selected !== undefined) {
      const group = this.groups.find(group => group.name === dialogData.selected);
      if (group) {
        this.selectGroup(group, true);
      }
    }
  }

  /**
   * Set a group as selected.
   * - If the previously selected group has a name that is already existing in the **groups** array,
   * updates its with the number of duplicates.
   * 
   * @param group GroupCondition. group to select.
   * @param setAsEdited boolean. If set to true, will add the selectedGroup in the editedArray.
   */
  selectGroup(group: GroupConditions<F, FO>, setAsEdited: boolean = false) {
    if (this.selectedGroup) {
      const duplicates = this.groups.filter((group) => group.name.includes(this.selectedGroup!.name)).length;
      if (duplicates > 1) {
        this.selectedGroup.name += ` ${duplicates-1}`;
      }
    }
    this.selectedGroup = group;
    if (setAsEdited) {
      const groupName = `${group.name}`;
      this.editedGroups[groupName] = group;
    }
  }

  /**
   * Add a group with the name "New Group" and an empty filter.
   * If a group with the same name already exists, will add a number at the end of the name. 
   */
  addGroup() {
    const name = $localize`New Group`;
    const duplicates = this.groups.filter((group) => group.name.includes(name)).length;
    const group: GroupConditions<F, FO> = {
      name: name + (duplicates !== 0 ? ` ${duplicates}` : ''),
      conditions: [[{
        field: null,
        for: null,
        operator: null,
        value: null,
      }]]
    };
    this.groups.push(group);
    this.selectGroup(group);
    this.addedGroups.push(group);
  }

  /**
   * Remove a group at the specified index.
   * @param index number.
   */
  removeGroup(index: number) {
    const deletedGroup = this.groups.splice(index, 1)[0];
    if (deletedGroup) {
      if (this.selectedGroup?.name === deletedGroup?.name) {
        this.selectedGroup = undefined;
      }
      const addedIndex = this.addedGroups.findIndex((group) => group.name === deletedGroup.name);
      if (addedIndex !== -1) {
        this.addedGroups.splice(addedIndex, 1);
      } else {
        this.deletedGroups.push(deletedGroup.name);
        delete this.editedGroups[deletedGroup.name];
      }
    }
  }

  /**
   * Update the group name on user input.
   * Will compute the number of duplicates of this name.
   * @param event Event
   */
  updateName(event: Event) {
    if (this.selectedGroup) {
      const name = (event.target as HTMLInputElement).value;
      this.selectedGroup.name = name;
    }
  }

  /**
   * Add an FiltersAnd to the selectedGroup condition.
   */
  addOrFilter() {
    if (this.selectedGroup) {
      this.selectedGroup.conditions.push([{
        field: null,
        for: null,
        operator: null,
        value: null,
      }]);
    }
  }

  /**
   * Remove the FiltersAnd from the selectedGroup condition at the specified index.
   * @param index number.
   */
  removeOrFilter(index: number) {
    if (this.selectedGroup) {
      this.selectedGroup.conditions.splice(index, 1);
      if (this.selectedGroup.conditions.length === 0) {
        this.addOrFilter();
      }
    }
  }

  /**
   * Retrieves an icon.
   * @param name icon name
   * @returns Material icon name
   */
  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  /**
   * Close the dialog on confirm.
   */
  confirmClose() {
    this.dialogRef.close({
      addedGroups: this.addedGroups,
      deletedGroups: this.deletedGroups,
      editedGroups: this.editedGroups
    });
  }

  /**
   * Close the dialog on cancel.
   */
  close() {
    this.dialogRef.close();
  }
}