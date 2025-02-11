import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Filter, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { GroupConditions } from '@app/types/groups';
import { FiltersDialogOrComponent } from '@components/filters/filters-dialog-or.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';

export type ManageGroupsDialogInput<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> = {
  groups: GroupConditions<F, FO>[];
  selected?: string;
}

export type ManageGroupsDialogResult<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> = {
  addedGroups: GroupConditions<F, FO>[];
  editedGroups: Record<string, GroupConditions<F, FO>>;
  deletedGroups: string[];
}

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
  providers: [
    FiltersService
  ]
})
export class ManageGroupsDialogComponent<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
  private readonly dialogRef: MatDialogRef<ManageGroupsDialogComponent<F, FO>, ManageGroupsDialogResult<F, FO>> = inject(MatDialogRef);
  constructor(@Inject(MAT_DIALOG_DATA) private readonly dialogData: ManageGroupsDialogInput<F, FO>) {
    this.groups = [...dialogData.groups];
    if (dialogData.selected !== undefined) {
      this.selectedGroup = this.groups.find(group => group.name === dialogData.selected);
    }
  }

  private readonly iconsService = inject(IconsService);

  groups: GroupConditions<F, FO>[];

  addedGroups: GroupConditions<F, FO>[];
  editedGroups: Record<string, GroupConditions<F, FO>>;
  deletedGroups: string[];

  selectedGroup: GroupConditions<F, FO> | undefined;

  selectGroup(group: GroupConditions<F, FO>, setAsEdited: boolean = false) {
    this.selectedGroup = group;
    if (setAsEdited) {
      const groupName = `${group.name}`;
      this.editedGroups[groupName] = group;
    }
  }

  addGroup() {
    const group: GroupConditions<F, FO> = {
      name: $localize`New Group`,
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

  removeGroup(index: number) {
    const deletedGroup = this.groups.splice(index, 1)[0];
    if (this.selectedGroup === deletedGroup) {
      this.selectedGroup = undefined;
    }
    if (this.addedGroups.includes(deletedGroup)) {
      const index = this.addedGroups.indexOf(deletedGroup);
      this.addedGroups.splice(index, 1);
    } else {
      this.deletedGroups.push(deletedGroup.name);
    }
  }

  updateName(event: Event) {
    if (this.selectedGroup) {
      const name = (event.target as HTMLInputElement).value;
      this.selectedGroup.name = name;
    }
  }

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

  removeOrFilter(filter: Filter<F, FO>[]) {
    if (this.selectedGroup) {
      const index = this.selectedGroup.conditions.indexOf(filter);
      if (index !== -1) {
        this.selectedGroup.conditions.splice(index, 1);
      }
      if (this.selectedGroup.conditions.length === 0) {
        this.addOrFilter();
      }
    }
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  confirmClose() {
    this.dialogRef.close({
      addedGroups: this.addedGroups,
      deletedGroups: this.deletedGroups,
      editedGroups: this.editedGroups
    });
  }
}