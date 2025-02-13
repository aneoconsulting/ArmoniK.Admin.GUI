import { FilterDateOperator, FilterStringOperator, SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupConditions } from '@app/types/groups';
import { IconsService } from '@services/icons.service';
import { ManageGroupsTableDialogInput, ManageTableGroupsDialogComponent } from './manage-groups-dialog.component';

describe('ManageTableGroupsDialogComponent', () => {
  let component: ManageTableGroupsDialogComponent<SessionRawEnumField, TaskOptionEnumField>;

  const groupConditions: GroupConditions<SessionRawEnumField, TaskOptionEnumField>[] = [
    {
      name: 'Group 1',
      conditions: [[
        {
          field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
          value: 'some'
        }
      ]]
    },
    {
      name: 'ToBeDeleted',
      conditions: [[
        {
          field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DELETED_AT,
          for: 'root',
          operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
          value: '17345800',
        }
      ]]
    }
  ];

  const dialogData: ManageGroupsTableDialogInput<SessionRawEnumField, TaskOptionEnumField> = {
    selected: 'Group 1',
    groups: groupConditions
  };

  const dialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ManageTableGroupsDialogComponent,
        IconsService,
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: dialogRef },
      ]
    }).inject(ManageTableGroupsDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should create groups', () => {
      expect(component.groups).toEqual(groupConditions);
    });

    it('should select a group', () => {
      expect(component.selectedGroup).toEqual(groupConditions[0]);
    });
  });

  describe('selectGroup', () => {
    const fakeSelectedGroup: GroupConditions<SessionRawEnumField, TaskOptionEnumField> = {
      name: 'Fake selected',
      conditions: [],
    };

    beforeEach(() => {
      component.groups.push(groupConditions[0]);
      component.selectGroup(fakeSelectedGroup, true);
    });

    it('should select the fakeSelectedGroup', () => {
      expect(component.selectedGroup).toBe(fakeSelectedGroup);
    });

    it('should set the newly selected group as "edited"', () => {
      expect(component['editedGroups'][fakeSelectedGroup.name]).toEqual(fakeSelectedGroup);
    });

    it('should edit the name of the last selected group', () => {
      expect(component.groups[0].name).toEqual(`Group 1 ${1}`);
    });
  });

  describe('addGroup', () => {
    beforeEach(() => {
      component.addGroup();
    });

    it('should add a group', () => {
      expect(component.groups.at(-1)).toEqual({
        name: 'New Group',
        conditions: [[{
          field: null,
          for: null,
          operator: null,
          value: null,
        }]],
      });
    });

    it('should select the newly added group', () => {
      expect(component.selectedGroup).toEqual(component.groups.at(-1));
    });

    it('should add the group to the "addedGroups" array', () => {
      expect(component['addedGroups']).toEqual([{
        name: 'New Group',
        conditions: [[{
          field: null,
          for: null,
          operator: null,
          value: null,
        }]],
      }]);
    });

    it('should avoid duplicate names', () => {
      component.addGroup();
      expect(component.groups.at(-1)!.name).toEqual('New Group 1');
    });
  });

  describe('removeGroup', () => {
    const index = groupConditions.findIndex((group) => group.name === 'ToBeDeleted');
    const deletedGroup = groupConditions.find((group) => group.name === 'ToBeDeleted') as GroupConditions<SessionRawEnumField, TaskOptionEnumField>;

    describe('if not included in the "addedGroup" array', () => {
      beforeEach(() => {
        component.selectedGroup = deletedGroup;
        component['editedGroups'][deletedGroup.name] = deletedGroup;
        component.removeGroup(index);
      });
  
      it('should remove the group at the correct index', () => {
        expect(component.groups).not.toContain(deletedGroup);
      });
  
      it('should add the group to the "deletedGroup" array', () => {
        expect(component['deletedGroups']).toEqual([deletedGroup.name]);
      });
  
      it('should unselect the selected group if it is the one deleted', () => {
        expect(component.selectedGroup).toBeUndefined();
      });
  
      it('should remove the group from the "editedGroups" record', () => {
        expect(component['editedGroups'][deletedGroup.name]).toBeUndefined();
      });
    });

    describe('if included in the "addedGroup" array', () => {
      beforeEach(() => {
        component['addedGroups'].push(deletedGroup);
        component.removeGroup(index);
      });
      
      it('should remove the group from the "addedGroups" array', () => {
        expect(component['addedGroups']).toEqual([]);
      });

      it('should not add the group to the "deletedGroup" array if included in the "addedGroups" first', () => {
        expect(component['deletedGroups']).not.toContain(deletedGroup);
      });
    });

    describe('updateName', () => {
      const event = {target: {value: 'New Name'}} as unknown as Event;
      
      beforeEach(() => {
        component.groups.push({name: 'New Name', conditions: []});
        component.updateName(event);
      });

      it('should update the name of the selectedGroup', () => {
        expect(component.selectedGroup?.name).toEqual((event.target as HTMLInputElement).value);
      });
    });
  });

  describe('addOrFilter', () => {
    beforeEach(() => {
      component.addOrFilter();
    });

    it('should add an empty filter', () => {
      expect(component.selectedGroup?.conditions.at(-1)).toEqual([{
        field: null,
        for: null,
        operator: null,
        value: null,
      }]);
    });
  });

  describe('removeOrFilter', () => {
    beforeEach(() => {
      component.selectedGroup?.conditions.push([{
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
        for: 'options',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'application'
      }]);
      component.removeOrFilter(1);
    });

    it('should remove the filter from the selected group', () => {
      expect(component.selectedGroup?.conditions[1]).toBeUndefined();
    });

    it('should add an empty filter if the conditions array is empty', () => {
      component.removeOrFilter(0);
      expect(component.selectedGroup?.conditions).toEqual([[{
        field: null,
        for: null,
        operator: null,
        value: null,
      }]]);
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should close with all required data on confirm', () => {
    component.confirmClose();
    expect(dialogRef.close).toHaveBeenCalledWith({
      addedGroups: component['addedGroups'],
      editedGroups: component['editedGroups'],
      deletedGroups: component['deletedGroups'],
    });
  });

  it('should close with nothing', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});