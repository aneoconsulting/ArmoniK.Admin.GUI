import { FilterStringOperator, SessionStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { SessionData } from '@app/types/data';
import { Group } from '@app/types/groups';
import { IconsService } from '@services/icons.service';
import { Subject, of } from 'rxjs';
import { TableGroupComponent } from './group.component';

describe('TableGroupComponent', () => {
  let component: TableGroupComponent<SessionRaw, SessionStatus, TaskOptions>;

  const data: SessionData[] = [
    {
      raw: {} as SessionRaw,
      filters: [[
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'session-1'
        }
      ]],
      queryTasksParams: {
        '0-root-1-0': 'session-1'
      },
      resultsQueryParams: {},
    },
    {
      raw: {} as SessionRaw,
      filters: [[
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'session-2'
        }
      ]],
      queryTasksParams: {
        '0-root-1-0': 'session-2'
      },
      resultsQueryParams: {},
    },
  ];

  const group: Group<SessionRaw, TaskOptions> = {
    name: signal('Goup 1'),
    page: 0,
    opened: false,
    total: 2,
    refresh$: new Subject<void>(),
    emptyCondition: false,
    data: of(data),
  };

  const columns: TableColumn<SessionRaw, TaskOptions>[] = [
    {
      key: 'sessionId',
      name: 'Session Id',
      sortable: true,
      link: '/sessions',
      type: 'link'
    },
    {
      key: 'actions',
      name: 'Actions',
      sortable: false,
    },
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableGroupComponent,
        IconsService,
      ]
    }).inject(TableGroupComponent<SessionRaw, SessionStatus, TaskOptions>);
    component.group = group;
    component.columns = columns;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the group', () => {
      expect(component.group).toBe(group);
    });

    it('should set columnsKeys', () => {
      expect(component.columnsKeys).toEqual(columns.map((col) => col.key));
    });

    it('should set displayedColumns', () => {
      expect(component.displayedColumns).toEqual(columns);
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should switch the view of the group', () => {
    component.switchView();
    expect(component.group.opened).toBeTruthy();
  });

  describe('pageChange', () => {
    let pageSpy: jest.SpyInstance;
    const newPage = 1;

    beforeEach(() => {
      pageSpy = jest.spyOn(component.page, 'emit');
      component.pageChange({
        length: 100,
        pageIndex: newPage,
        pageSize: 100,
        previousPageIndex: 0
      });
    });

    it('should emit on page change', () => {
      expect(pageSpy).toHaveBeenCalled();
    });

    it('should update group page', () => {
      expect(group.page).toEqual(newPage);
    });
  });

  describe('groupSettingsEmit', () => {
    let groupSettingsSpy: jest.SpyInstance;

    beforeEach(() => {
      groupSettingsSpy = jest.spyOn(component.groupSettings, 'emit');
      component.groupSettingsEmit();
    });

    it('should emit the group name', () => {
      expect(groupSettingsSpy).toHaveBeenCalledWith(group.name());
    });
  });

  it('should track the index of data by default', () => {
    expect(component.trackBy(1, data[0])).toEqual(1);
  });
});