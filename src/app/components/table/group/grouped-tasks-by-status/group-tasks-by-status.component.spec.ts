import { FilterStringOperator, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions, TaskSummaryFilters } from '@app/tasks/types';
import { SessionData } from '@app/types/data';
import { GroupTasksByStatusComponent } from './group-tasks-by-status.component';

describe('GroupTasksByStatusComponent', () => {
  const component = new GroupTasksByStatusComponent<SessionRaw, TaskOptions>();

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

  const statusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Validated',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED],
      color: 'green',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR, TaskStatus.TASK_STATUS_RETRIED],
      color: 'red',
    }
  ];

  beforeEach(() => {
    component.groupData = data;
    component.statusesGroups = statusesGroups;
  });

  describe('initialisation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should set filters', () => {
      expect(component.filters).toEqual(data.reduce((acc: TaskSummaryFilters, current) => [...acc, ...current.filters], []));
    });
  
    it('should set queryParams', () => {
      expect(component.queryParams).toEqual({
        '0-root-1-0': 'session-1',
        '1-root-1-0': 'session-2'
      });
    });
  
    it('should set queryParamsLength', () => {
      expect(component.queryParamsLength).toEqual(2);
    });
  });
});