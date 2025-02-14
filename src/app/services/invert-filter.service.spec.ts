import { FilterDateOperator, FilterStringOperator, SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
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
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
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
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
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
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '40000'
      },
    ],
    [
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
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
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
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
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '20000',
      },
      {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
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
      case SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT:
        return 'date';
      default:
        return 'string';
      }
    })
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
});