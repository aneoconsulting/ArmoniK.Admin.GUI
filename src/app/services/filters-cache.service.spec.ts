import { FilterStringOperator, SessionRawEnumField, SessionTaskOptionEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Scope } from '@app/types/config';
import { FiltersOr } from '@app/types/filters';
import { FiltersCacheService } from './filters-cache.service';

describe('FiltersCacheService', () => {
  const service = new FiltersCacheService();

  const taskScope: Scope = 'tasks';
  const tasksFilters: FiltersOr<TaskSummaryEnumField, TaskOptionEnumField> = [
    [
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_BY,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'faust'
      }
    ]
  ];

  const sessionsScope: Scope = 'sessions';
  const sessionsFilters: FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField> = [
    [
      {
        field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE,
        for: 'options',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
        value: 'htcmock'
      }
    ]
  ];

  beforeEach(() => {
    service.set(taskScope, tasksFilters);
    service.set(sessionsScope, sessionsFilters);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getting', () => {
    let fetchedFilter: unknown;

    beforeEach(() => {
      fetchedFilter = service.get(taskScope);
    });

    it('should get the value from the specified scope', () => {
      expect(fetchedFilter).toEqual(tasksFilters);
    });

    it('should delete the cached value', () => {
      expect(service.get(taskScope)).toBeUndefined();
    });

    it('should set the "isCachedData" property to true (still one filter left)', () => {
      expect(service.isDataCached).toBeTruthy();
    });

    it('should set the "isCachedData" property to false (no filter left)', () => {
      service.get(sessionsScope);
      expect(service.isDataCached).toBeFalsy();
    });
  });

  describe('deleting', () => {
    beforeEach(() => {
      service.delete(sessionsScope);
    });

    it('should properly delete the specified scope', () => {
      expect(service.get(sessionsScope)).toBeUndefined();
    });

    it('should set the "isCachedData" property to true (still one filter left)', () => {
      expect(service.isDataCached).toBeTruthy();
    });

    it('should set the "isCachedData" property to false (no filter left)', () => {
      service.delete(taskScope);
      expect(service.isDataCached).toBeFalsy();
    });
  });

  describe('clearing', () => {
    beforeEach(() => {
      service.clear();
    });

    it('should empty all scopes', () => {
      expect(service.get(taskScope)).toBeUndefined();
      expect(service.get(sessionsScope)).toBeUndefined();
    });

    it('should set the isDataCached variable to false', () => {
      expect(service.isDataCached).toBeFalsy();
    });
  });
});