import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { CustomColumn } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterType } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { FiltersDialogFilterFieldComponent } from './filters-dialog-filter-field.component';

describe('FiltersDialogFilterFieldComponent', () => {
  let component: FiltersDialogFilterFieldComponent<number, number>;

  const mockDataFiltersService = {
    retrieveFiltersDefinitions: jest.fn(() => {
      return filterDefinitions;
    }),
    retrieveLabel: jest.fn((for_: string, value: number) => {
      return propertiesLabel[value];
    }),
    retrieveField: jest.fn((value: string) => {
      const values = Object.values(propertiesLabel);
      const index = values.findIndex(label => label.toLowerCase() === value.toLowerCase());
      const key = index !== -1 ? Number(Object.keys(propertiesLabel).at(index)) : index;
      const for_ = filterDefinitions.find(def => def.field === key)?.for ?? -1;
      return { for: for_ ?? 'custom', index: key };
    })
  };

  const allStatuses = [
    { key: 0, value: 'Creation' },
    { key: 1, value: 'Submitted' },
    { key: 2, value: 'Ended' }
  ];

  const propertiesLabel: { [key: number]: string } = {
    1: 'status',
    2: 'task id',
    3: 'children',
    4: 'size',
    5: '-',
    6: 'Start to End duration',
    7: 'Created at',
    8: 'Client Submission'
  };

  const filterDefinitions: FilterDefinition<number, number>[] = [
    {
      field: 4,
      type: 'number',
      for: 'root'
    },
    {
      field: 1,
      type: 'status',
      for: 'root',
      statuses: allStatuses
    },
    {
      field: 2,
      type: 'string',
      for: 'options'
    },
    {
      field: 3,
      type: 'array',
      for: 'root'
    },
    ({
      field: 5,
      type: 'unknownType',
      for: 'root'
    } as unknown as FilterDefinition<number, number>),
    {
      field: 6,
      type: 'duration',
      for: 'options'
    },
    {
      field: 7,
      type: 'date',
      for: 'root'
    },
    {
      field: 8,
      type: 'boolean',
      for: 'root'
    }
  ];

  const customList: CustomColumn[] = ['options.options.test', 'options.options.fastCompute', 'options.options.column'];

  const defaultFilter: Filter<number, number> = {
    field: 1,
    for: 'root',
    operator: 0,
    value: 'someValue'
  };

  beforeEach(async () => {
    component = TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogFilterFieldComponent,
        FiltersService,
        { provide: DATA_FILTERS_SERVICE, useValue: mockDataFiltersService }
      ]
    }).inject(FiltersDialogFilterFieldComponent);

    component.filter = {
      field: 1,
      for: 'root',
      operator: 0,
      value: 'someValue'
    };
    component.filter = defaultFilter;
    component.first = true;
    component.customColumns = customList;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('columnValue', () => {
    it('should return the label of the column', () => {
      expect(component.columnValue).toEqual('status');
    });

    it('should return the label of the custom column', () => {
      const customColumn = 'fastCompute';
      component.filter = {
        for: 'custom',
        field: customColumn,
        operator: null,
        value: null
      };
      expect(component.columnValue).toEqual(customColumn);
    });

    it('should return an empty string if there is no for nor field', () => {
      component.filter = {
        for: null,
        field: null,
        operator: null,
        value: null
      };
      expect(component.columnValue).toEqual('');
    });
  });

  it('should retrieve the filter definitions', () => {
    expect(component.filtersDefinitions).toEqual(filterDefinitions);
  });

  describe('onPropertyChange', () => {
    it('should update filter', () => {
      component.onPropertyChange('Created at');
      expect(component.filter).toEqual({
        for: 'root',
        field: 7,
        operator: null,
        value: null
      });
    });

    it('should not update anything if the field does not exists', () => {
      component.onPropertyChange('Unexisting');
      expect(component.filter).toEqual(defaultFilter);
    });

    it('should handle custom fields', () => {
      component.onPropertyChange('test');
      expect(component.filter).toEqual({
        for: 'custom',
        field: 'test',
        operator: null,
        value: null
      });
    });
  });

  describe('retrieveStatusKey', () => {
    beforeEach(() => {
      component.allStatuses = allStatuses;
    });

    it('should retrieve the key of the status', () => {
      expect(component.retrieveStatusKey(allStatuses[1].value)).toEqual(1);
    });

    it('should return null if the label does not exists', () => {
      expect(component.retrieveStatusKey('Unexisting')).toEqual(null);
    });
  });

  describe('on operator change', () => {
    it('should change the operator of the filter', () => {
      component.onOperatorChange('Equal');
      expect(component.filter.operator).toEqual(0);
    });

    it('should set the operator to null if the key does not exists', () => {
      component.onOperatorChange('Unexisting');
      expect(component.filter.operator).toBeNull();
    });
  });

  describe('onInputChange', () => {
    it('should change the filter value on string input', () => {
      component.onPropertyChange(propertiesLabel[2]);
      const value = 'someStringValue';
      component.onInputChange(value);
      expect(component.filter.value).toEqual(value);
    });

    it('should change the filter value on number input', () => {
      component.onPropertyChange(propertiesLabel[4]);
      const value = 4;
      component.onInputChange(value.toString());
      expect(component.filter.value).toEqual(value);
    });

    it('should set the filter value to null in case of NaN number value', () => {
      component.onInputChange(propertiesLabel[4]);
      const value = 'NaN';
      component.onInputChange(value);
      expect(component.filter.value).toBeNull();
    });
  
    it('should change the filter value to date if one is passed', () => {
      component.onPropertyChange(propertiesLabel[7]);
      const value = '95603';
      component.onInputChange(value);
      expect(component.filter.value).toEqual(value);
    });

    it('should change the filter value to a duration if one is passed', () => {
      component.onPropertyChange(propertiesLabel[6]);
      const value = 94350;
      component.onInputChange(value.toString());
      expect(component.filter.value).toEqual(value);
    });

    it('should change the filter value to status if one status is passed', () => {
      component.onPropertyChange(propertiesLabel[1]);
      const status = 'Submitted';
      component.onInputChange(status);
      expect(component.filter.value).toEqual(1);
    });

    it('should change the filter value to boolean if one boolean is passed', () => {
      component.onPropertyChange(propertiesLabel[8]);
      const value = 'true';
      component.onInputChange(value);
      expect(component.filter.value).toEqual(value);
    });
  });

  describe('findType', () => {
    it('should return the type of a filter', () => {
      const filter: Filter<number, number> = {
        field: 4,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      component.filter = filter;
      expect(component.findType()).toEqual('number');
    });

    it('should return type string if the field is null', () => {
      const filter: Filter<number, number> = {
        field: null,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      component.filter = filter;
      expect(component.findType()).toEqual('string');
    });

    it('should return type string if the definition does not exists', () => {
      const filter: Filter<number, number> = {
        field: 6,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      component.filter = filter;
      expect(component.findType()).toEqual('string');
    });
  });

  describe('findStatuses', () => {
    it('should return the statuses of a filter', () => {
      const statusFilter: Filter<number, number> = {
        field: 1,
        for: 'root',
        operator: 1,
        value: 'myStatus'
      };
      component.filter = statusFilter;
      expect(component.findStatuses()).toEqual(allStatuses);
    });

    it('should return an empty status list if the filter has no field', () => {
      const statusFilter: Filter<number, number> = {
        field: null,
        for: 'root',
        operator: 1,
        value: 'myStatus'
      };
      component.filter = statusFilter;
      expect(component.findStatuses()).toEqual([]);
    });

    it('should return an empty status list if the filter definition does not exists', () => {
      const statusFilter: Filter<number, number> = {
        field: 6,
        for: 'root',
        operator: 1,
        value: 'myStatus'
      };
      component.filter = statusFilter;
      expect(component.findStatuses()).toEqual([]);
    });

    it('should return an empty status list if the filter is not of type status', () => {
      const notAStatusFilter: Filter<number, number> = {
        field: 3,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      component.filter = notAStatusFilter;
      expect(component.findStatuses()).toEqual([]);
    });
  });

  describe('findOperator', () => {
    it('should retrieve all number operators', () => {
      const filter: Filter<number, number> = {
        field: 4,
        for: 'root',
        operator: 1,
        value: 'myStatus'
      };
      component.filter = filter;
      expect(component.findOperators()).toEqual(new FiltersService()['filterNumberOperators']);
    });
  });

  describe('setInput', () => {
    const filter: Filter<number, number> = {
      for: 'root',
      field: 0,
      operator: 1,
      value: '1'
    };

    beforeEach(() => {
      component.filter = filter;
    });

    it('should handle strings', () => {
      component.type = 'string';
      component.setInput();
      expect(component.input).toEqual({
        type: 'string',
        value: filter.value
      });
    });

    it('should handle numbers', () => {
      component.type = 'number';
      component.setInput();
      expect(component.input).toEqual({
        type: 'number',
        value: Number(filter.value)
      });
    });

    it('should handle arrays', () => {
      component.type = 'array';
      component.setInput();
      expect(component.input).toEqual({
        type: 'array',
        value: filter.value
      });
    });

    it('should handle statuses', () => {
      component.allStatuses = allStatuses;
      component.type = 'status';
      component.setInput();
      expect(component.input).toEqual({
        type: 'status',
        value: 'Submitted'
      });
    });

    it('should handle dates', () => {
      component.type = 'date';
      component.setInput();
      expect(component.input).toEqual({
        type: 'date',
        value: new Date(Number(filter.value) * 1000)
      });
    });

    it('should handle durations', () => {
      component.type = 'duration';
      component.setInput();
      expect(component.input).toEqual({
        type: 'duration',
        value: filter.value
      });
    });

    it('should handle booleans', () => {
      component.type = 'boolean';
      component.setInput();
      expect(component.input).toEqual({
        type: 'boolean',
        value: filter.value
      });
    });

    it('should throw an error in case of unknown type', () => {
      const type = 'unknown' as FilterType;
      component.type = type;
      expect(() => component.setInput()).toThrow(`Unknown type ${type}`);
    });
  });
});