import { FilterDateOperator, FilterStringOperator, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskSummaryFilters } from '@app/tasks/types';
import { FiltersService } from '@services/filters.service';
import { StatusesGroupCardComponent } from './statuses-group-card.component';

describe('StatusesGroupCardComponent', () => {
  let component: StatusesGroupCardComponent;

  const filters: TaskSummaryFilters = [
    [
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: 123456789
      },
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'someFilterValue'
      }
    ],
    [
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'someOtherFilterValue'
      },
      {
        field: null,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'shouldNotAppear'
      }
    ]
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        StatusesGroupCardComponent,
        TasksStatusesService,
        FiltersService
      ]
    }).inject(StatusesGroupCardComponent);
    component.group = { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]};
    component.hideGroupHeaders = false;
    component.data = [{status: TaskStatus.TASK_STATUS_COMPLETED, count: 143}, {status: TaskStatus.TASK_STATUS_PROCESSED, count: 153}];
    component.filters = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get labels', () => {
    expect(component.statusToLabel(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
      label: 'Completed',
      color: '#006400',
      icon: 'success',
    });
  });

  it('should update counter', () => {
    expect(component.updateCounter(TaskStatus.TASK_STATUS_COMPLETED)).toEqual(143);
  });

  it('should not update counter of not specified task', () => {
    expect(component.updateCounter(TaskStatus.TASK_STATUS_CANCELLING)).toEqual(0);
  });

  it('should return the number of every concerned tasks', () => {
    expect(component.sumStatusCount([TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_CANCELLED]))
      .toEqual(143);
  });

  describe('createQueryParam', () => {
    it('should just create taskStatus param if there is no filters', () => {
      component.filters = [];
      expect(component.createQueryParam(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
        '1-root-2-0': TaskStatus.TASK_STATUS_COMPLETED
      });
    });

    it('should create query params with all applied filters', () => {
      component.filters = filters;
      expect(component.createQueryParam(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
        '0-root-2-0': 4,
        '0-root-15-2': 123456789,
        '0-root-1-2': 'someFilterValue',
        '1-root-2-0': 4,
        '1-root-1-2': 'someOtherFilterValue',
      });
    });
  });

  describe('createQueryParamManyStatuses', () => {
    it('should create query params for every statuses', () => {
      expect(component.createQueryParamManyStatuses()).toEqual({
        '0-root-2-0': 4,
        '1-root-2-0': 10
      });
    });

    it('should create query params for every statuses and applied filters', () => {
      component.filters = filters;
      expect(component.createQueryParamManyStatuses()).toEqual({
        '0-root-2-0': 4,
        '0-root-15-2': 123456789,
        '0-root-1-2': 'someFilterValue',
        '1-root-2-0': 4,
        '1-root-1-2': 'someOtherFilterValue',
        '2-root-2-0': 10,
        '2-root-15-2': 123456789,
        '2-root-1-2': 'someFilterValue',
        '3-root-2-0': 10,
        '3-root-1-2': 'someOtherFilterValue'
      });
    });
  });
});