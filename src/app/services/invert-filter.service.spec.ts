import { FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, SessionRawEnumField, SessionStatus, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { Filter, FiltersOr } from '@app/types/filters';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { InvertFilterService } from './invert-filter.service';

describe('InvertFilterService', () => {
  let service: InvertFilterService<SessionRawEnumField, TaskOptionEnumField>;

  const filters: FiltersOr<SessionRawEnumField, TaskOptionEnumField> = [
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '10000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '20000',
      }
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'sessionId',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '30000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '40000'
      },
    ]
  ];

  const invertedFilters: FiltersOr<SessionRawEnumField, TaskOptionEnumField> = [
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '10000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
        value: 'sessionId',
      },
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '10000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '30000',
      },
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '10000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '40000'
      },
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '20000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
        value: 'sessionId',
      },
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '20000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
        value: '30000',
      },
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '20000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '40000'
      },
    ],
  ];

  const mockedDataFilterService = {
    getType: jest.fn((filter: Filter<SessionRawEnumField, TaskOptionEnumField>) => {
      switch (filter.field) {
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT:
        return 'date';
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLIENT_SUBMISSION:
        return 'boolean';
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS:
        return 'status';
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS:
        return 'array';
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION:
        return 'duration';
      case TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION:
        return 'number';
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID:
        return 'string';
      default:
        return null;
      }
    })
  };

  const emptyFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
    field: null,
    for: null,
    operator: null,
    value: null,
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        InvertFilterService,
        { provide: DataFilterService, useValue: mockedDataFilterService },
      ]
    }).inject(InvertFilterService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should invert filters properly', () => {
    expect(service.invert(filters)).toEqual(invertedFilters);
  });

  describe('string', () => {
    const stringFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
      for: 'root',
      value: 'sessionId',
      operator: null
    };

    it('should turn a EQUAL to NOT_EQUAL', () => {
      stringFilter.operator = FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL;
      expect(service.invert([[stringFilter]])).toEqual([[{
        ...stringFilter,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL
      }]]);
    });

    it('should turn a NOT_EQUAL to EQUAL', () => {
      stringFilter.operator = FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL;
      expect(service.invert([[stringFilter]])).toEqual([[{
        ...stringFilter,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
      }]]);
    });

    it('should turn a CONTAINS to NOT_CONTAINS', () => {
      stringFilter.operator = FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS;
      expect(service.invert([[stringFilter]])).toEqual([[{
        ...stringFilter,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS
      }]]);
    });

    it('should turn a NOT_CONTAINS to CONTAINS', () => {
      stringFilter.operator = FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS;
      expect(service.invert([[stringFilter]])).toEqual([[{
        ...stringFilter,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS
      }]]);
    });

    it('should turn a START_WITH to an empty filter', () => {
      stringFilter.operator = FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH;
      expect(service.invert([[stringFilter]])).toEqual([[emptyFilter]]);
    });

    it('should turn a END_WITH to an empty filter', () => {
      stringFilter.operator = FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH;
      expect(service.invert([[stringFilter]])).toEqual([[emptyFilter]]);
    });

    it('should turn a null to an empty filter', () => {
      stringFilter.operator = null;
      expect(service.invert([[stringFilter]])).toEqual([[emptyFilter]]);
    });
  });

  describe('number filter', () => {
    const numberFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
      for: 'root',
      value: 5,
      operator: null
    };

    it('should turn a EQUAL to a NOT_EQUAL', () => {
      numberFilter.operator = FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL;
      expect(service.invert([[numberFilter]])).toEqual([[{
        ...numberFilter,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_NOT_EQUAL
      }]]);
    });

    it('should turn a NOT_EQUAL to a EQUAL', () => {
      numberFilter.operator = FilterNumberOperator.FILTER_NUMBER_OPERATOR_NOT_EQUAL;
      expect(service.invert([[numberFilter]])).toEqual([[{
        ...numberFilter,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL
      }]]);
    });

    it('should turn a GREATER to a LESS OR EQUAL', () => {
      numberFilter.operator = FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN;
      expect(service.invert([[numberFilter]])).toEqual([[{
        ...numberFilter,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL
      }]]);
    });

    it('should turn a LESS to a GREATER OR EQUAL', () => {
      numberFilter.operator = FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN;
      expect(service.invert([[numberFilter]])).toEqual([[{
        ...numberFilter,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL
      }]]);
    });

    it('should turn a GREATER OR EQUAL to a LESS', () => {
      numberFilter.operator = FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL;
      expect(service.invert([[numberFilter]])).toEqual([[{
        ...numberFilter,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN
      }]]);
    });

    it('should turn a LESS OR EQUAL to a GREATER', () => {
      numberFilter.operator = FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL;
      expect(service.invert([[numberFilter]])).toEqual([[{
        ...numberFilter,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN
      }]]);
    });

    it('should turn a null to an empty filter', () => {
      numberFilter.operator = null;
      expect(service.invert([[numberFilter]])).toEqual([[emptyFilter]]);
    });
  });

  describe('date', () => {
    const dateFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
      for: 'root',
      value: '1243900',
      operator: null,
    };

    it('should turn EQUAL to NOT_EQUAL', () => {
      dateFilter.operator = FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL;
      expect(service.invert([[dateFilter]])).toEqual([[{
        ...dateFilter,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_NOT_EQUAL,
      }]]);
    });

    it('should turn NOT_EQUAL to EQUAL', () => {
      dateFilter.operator = FilterDateOperator.FILTER_DATE_OPERATOR_NOT_EQUAL;
      expect(service.invert([[dateFilter]])).toEqual([[{
        ...dateFilter,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL,
      }]]);
    });

    it('should turn AFTER to BEFORE OR EQUAL', () => {
      dateFilter.operator = FilterDateOperator.FILTER_DATE_OPERATOR_AFTER;
      expect(service.invert([[dateFilter]])).toEqual([[{
        ...dateFilter,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL,
      }]]);
    });

    it('should turn BEFORE to AFTER OR EQUAL', () => {
      dateFilter.operator = FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE;
      expect(service.invert([[dateFilter]])).toEqual([[{
        ...dateFilter,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
      }]]);
    });

    it('should turn AFTER OR EQUAL to BEFORE', () => {
      dateFilter.operator = FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL;
      expect(service.invert([[dateFilter]])).toEqual([[{
        ...dateFilter,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
      }]]);
    });

    it('should turn BEFORE OR EQUAL to AFTER', () => {
      dateFilter.operator = FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL;
      expect(service.invert([[dateFilter]])).toEqual([[{
        ...dateFilter,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER,
      }]]);
    });

    it('should turn a null to an empty filter', () => {
      dateFilter.operator = null;
      expect(service.invert([[dateFilter]])).toEqual([[emptyFilter]]);
    });
  });

  describe('array', () => {
    const arrayFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
      for: 'root',
      value: 'partition-Id',
      operator: null,
    };

    it('should turn CONTAINS to NOT_CONTAINS', () => {
      arrayFilter.operator = FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS;
      expect(service.invert([[arrayFilter]])).toEqual([[{
        ...arrayFilter,
        operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS,
      }]]);
    });

    it('should turn NOT_CONTAINS to CONTAINS', () => {
      arrayFilter.operator = FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS;
      expect(service.invert([[arrayFilter]])).toEqual([[{
        ...arrayFilter,
        operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
      }]]);
    });

    it('should turn a null to an empty filter', () => {
      arrayFilter.operator = null;
      expect(service.invert([[arrayFilter]])).toEqual([[emptyFilter]]);
    });
  });

  describe('status', () => {
    const statusFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
      for: 'root',
      value: SessionStatus.SESSION_STATUS_RUNNING,
      operator: null
    };

    it('should turn EQUAL to NOT_EQUAL', () => {
      statusFilter.operator = FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL;
      expect(service.invert([[statusFilter]])).toEqual([[{
        ...statusFilter,
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL
      }]]);
    });

    it('should turn NOT_EQUAL to EQUAL', () => {
      statusFilter.operator = FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL;
      expect(service.invert([[statusFilter]])).toEqual([[{
        ...statusFilter,
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL
      }]]);
    });

    it('should turn a null to an empty filter', () => {
      statusFilter.operator = null;
      expect(service.invert([[statusFilter]])).toEqual([[emptyFilter]]);
    });
  });

  describe('boolean', () => {
    const booleanFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLIENT_SUBMISSION,
      for: 'root',
      operator: FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS,
      value: true,
    };

    it('should invert the value', () => {
      expect(service.invert([[booleanFilter]])).toEqual([[{
        ...booleanFilter,
        value: false,
      }]]);
    });
  });

  describe('duration', () => {
    const durationFilter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION,
      for: 'root',
      value: '12345689',
      operator: null,
    };

    it('should turn EQUAL to NOT_EQUAL', () => {
      durationFilter.operator = FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL;
      expect(service.invert([[durationFilter]])).toEqual([[{
        ...durationFilter,
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_NOT_EQUAL,
      }]]);
    });

    it('should turn NOT_EQUAL to EQUAL', () => {
      durationFilter.operator = FilterDurationOperator.FILTER_DURATION_OPERATOR_NOT_EQUAL;
      expect(service.invert([[durationFilter]])).toEqual([[{
        ...durationFilter,
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL,
      }]]);
    });

    it('should turn LONGER to SHORTER OR EQUAL', () => {
      durationFilter.operator = FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN;
      expect(service.invert([[durationFilter]])).toEqual([[{
        ...durationFilter,
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN_OR_EQUAL,
      }]]);
    });

    it('should turn SHORTER to LONGER OR EQUAL', () => {
      durationFilter.operator = FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN;
      expect(service.invert([[durationFilter]])).toEqual([[{
        ...durationFilter,
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL,
      }]]);
    });

    it('should turn LONGER OR EQUAL to SHORTER', () => {
      durationFilter.operator = FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL;
      expect(service.invert([[durationFilter]])).toEqual([[{
        ...durationFilter,
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN,
      }]]);
    });

    it('should turn SHORTER OR EQUAL to LONGER', () => {
      durationFilter.operator = FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN_OR_EQUAL;
      expect(service.invert([[durationFilter]])).toEqual([[{
        ...durationFilter,
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN,
      }]]);
    });

    it('should turn null to empty filter', () => {
      durationFilter.operator = null;
      expect(service.invert([[durationFilter]])).toEqual([[emptyFilter]]);
    });
  });

  describe('Unrecognized field', () => {
    it('should return empty filter', () => {
      expect(service.invert([[{
        field: -1 as SessionRawEnumField,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'sessionId'
      }]])).toEqual([[emptyFilter]]);
    });
  });
});