import { KeyValue } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { GenericColumn } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterInputOutput } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { FiltersDialogFilterFieldComponent } from './filters-dialog-filter-field.component';

describe('FiltersDialogFilterFieldComponent', () => {
  let component: FiltersDialogFilterFieldComponent<number, number>;

  const mockDataFiltersService = {
    retrieveFiltersDefinitions: jest.fn(() => {
      return filterDefinitions;
    }),
    retrieveLabel: jest.fn()
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
      statuses: [
        {key: 'status1', value: '2'},
        {key: 'status2', value: '2'}
      ]
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
    }
  ];

  const genericList: GenericColumn[] = ['generic.test', 'generic.fastCompute', 'generic.column'];

  beforeEach(async () => {
    component = TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
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
    component.first = true;
    component.genericColumns = genericList;
    component.ngOnInit();
  });


  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('filteredProperties', () => {
      it('should filter properly', () => {
        component.filteredGenerics.subscribe(value => {
          expect(value).toEqual(['generic.test', 'generic.fastCompute']);
        });
        component.genericFormControl.setValue('te');
        component.genericFormControl.updateValueAndValidity({emitEvent: true});
      });

      it('should return all the list in case of null value', () => {
        component.filteredGenerics.subscribe(value => {
          expect(value).toEqual(Object.values(genericList));
        });
        component.genericFormControl.setValue(null);
        component.genericFormControl.updateValueAndValidity({emitEvent: true});
      });
    });
  });

  //TODO: security type check
  it('should retrieve the label', () => {
    component.retrieveLabel(filterDefinitions[0]);
    expect(mockDataFiltersService.retrieveLabel).toHaveBeenCalledWith(
      filterDefinitions[0].for,
      filterDefinitions[0].field
    );
  });

  //TODO: security type check
  it('should change the component filter on field change', () => {
    component.onFieldChange('options-2');
    expect(component.filter).toEqual({
      field: 2,
      for: 'options',
      operator: 0,
      value: 'someValue'
    });
  });

  //TODO: security type check
  it('should change the operator of the filter', () => {
    component.onOperatorChange('3');
    expect(component.filter.operator).toEqual(3);
  });

  //TODO: security type check
  describe('onInputChange', () => {
    it('should change the filter value on string input', () => {
      const inputEvent = {
        type: 'string',
        value: 'someStringValue'
      } as unknown as FilterInputOutput;
      component.onInputChange(inputEvent);
      expect(component.filter.value).toEqual('someStringValue');
    });

    it('should change the filter value on number input', () => {
      const inputEvent = {
        type: 'number',
        value: '4'
      } as unknown as FilterInputOutput;
      component.onInputChange(inputEvent);
      expect(component.filter.value).toEqual(4);
    });

    it('should change the filter value to null if the number input is incorrect', () => {
      const inputEvent = {
        type: 'number',
        value: 'someNotNumberValue'
      } as unknown as FilterInputOutput;
      component.onInputChange(inputEvent);
      expect(component.filter.value).toBeNull();
    });

    it('should change the filter value to date if one is passed', () => {
      const inputEvent = {
        type: 'date',
        value: 95603
      } as unknown as FilterInputOutput;
      component.onInputChange(inputEvent);
      expect(component.filter.value).toEqual(95603);
    });

    it('should change the filter value to a duration if one is passed', () => {
      const inputEvent = {
        type: 'duration',
        value: 94350
      } as unknown as FilterInputOutput;
      component.onInputChange(inputEvent);
      expect(component.filter.value).toEqual(94350);
    });
  });

  describe('findInput', () => {
    describe('input filter of type number', () => {
      it('should return a number filterinput', () => {
        const numberFilter: Filter<number, number> = {
          field: 4,
          for: 'root',
          operator: 1,
          value: 1
        };

        expect(component.findInput(numberFilter)).toEqual({
          type: 'number',
          value: 1
        });
      });
  
      it('should return a filterInput with a null value in case of a string value', () => {
        const numberFilter: Filter<number, number> = {
          field: 4,
          for: 'root',
          operator: 1,
          value: 'someNaN'
        };

        expect(component.findInput(numberFilter)).toEqual({
          type: 'number',
          value: null
        });
      });
    });

    describe('input filter of type string', () => {
      it('should return a string filterinput', () => {
        const stringFilter: Filter<number, number> = {
          field: 2,
          for: 'options',
          operator: 1,
          value: 'myStringValue'
        };

        expect(component.findInput(stringFilter)).toEqual({
          type: 'string',
          value: 'myStringValue'
        });
      });
  
      it('should return a filterInput with a null value in case of any falsy filter value', () => {
        const stringFilter: Filter<number, number> = {
          field: 2,
          for: 'options',
          operator: 1,
          value: null
        };

        expect(component.findInput(stringFilter)).toEqual({
          type: 'string',
          value: null
        });
      });
    });

    describe('input filter of type array', () => {
      it('should return a string filterinput', () => {
        const arrayFilter: Filter<number, number> = {
          field: 3,
          for: 'root',
          operator: 1,
          value: 'myStringValue'
        };

        expect(component.findInput(arrayFilter)).toEqual({
          type: 'string',
          value: 'myStringValue'
        });
      });
  
      it('should return a filterInput with a null value in case of any falsy filter value', () => {
        const arrayFilter: Filter<number, number> = {
          field: 3,
          for: 'root',
          operator: 1,
          value: null
        };

        expect(component.findInput(arrayFilter)).toEqual({
          type: 'string',
          value: null
        });
      });
    });

    describe('input filter of type status', () => {
      it('should return a status filterinput', () => {
        const statusFilter: Filter<number, number> = {
          field: 1,
          for: 'root',
          operator: 1,
          value: 'myStatus'
        };

        expect(component.findInput(statusFilter)).toEqual({
          type: 'status',
          value: 'myStatus',
          statuses: [
            {key: 'status1', value: '2'},
            {key: 'status2', value: '2'}
          ]
        });
      });
  
      it('should return a filterInput with a null value in case of any falsy filter value', () => {
        const statusFilter: Filter<number, number> = {
          field: 1,
          for: 'root',
          operator: 1,
          value: null
        };

        expect(component.findInput(statusFilter)).toEqual({
          type: 'status',
          value: null,
          statuses: [
            {key: 'status1', value: '2'},
            {key: 'status2', value: '2'}
          ]
        });
      });
    });

    it('should throw an error in case of an unknown type', () => {
      const unknownFilter: Filter<number, number> = {
        field: 5,
        for: 'root',
        operator: 1,
        value: 1
      };
      expect(() => {component.findInput(unknownFilter);}).toThrowError(
        'Unknown type unknownType'
      );
    });

    describe('input filter of type date', () => {
      it('should return a date', () => {
        const dateFilter: Filter<number, number> = {
          for: 'root',
          field: 7,
          operator: 1,
          value: 1703085190
        };
        expect(component.findInput(dateFilter)).toEqual({
          type: 'date',
          value: new Date(1703085190000)
        });
      });

      it('should return null if there is no date', () => {
        const dateFilter: Filter<number, number> = {
          for: 'root',
          field: 7,
          operator: 1,
          value: null
        };
        expect(component.findInput(dateFilter)).toEqual({
          type: 'date',
          value: null
        });
      });
    });

    describe('input filter of type duration', () => {
      it('should return a filterinput with a duration in seconds', () => {
        const durationFilter: Filter<number, number> = {
          field: 6,
          for: 'options',
          operator: 1,
          value: 94350
        };
        expect(component.findInput(durationFilter)).toEqual({
          type: 'duration',
          value: 94350
        });
      });
    });

    it('should return a null filterInput if the duration is not existing', () => {
      const durationFilter: Filter<number, number> = {
        field: 6,
        for: 'options',
        operator: 1,
        value: null
      };
      expect(component.findInput(durationFilter)).toEqual({
        type: 'duration',
        value: null
      });
    });

    it('should return a filter of type string for a generic', () => {
      const genericFilter: Filter<number, number> = {
        field: 'fastCompute',
        for: 'generic',
        operator: 0,
        value: null
      };
      expect(component.findInput(genericFilter)).toEqual({
        type: 'string',
        value: null
      });
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
      expect(component.findType(filter)).toEqual('number');
    });

    it('should return type string if the field is null', () => {
      const filter: Filter<number, number> = {
        field: null,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      expect(component.findType(filter)).toEqual('string');
    });

    it('should return type string if the definition does not exists', () => {
      const filter: Filter<number, number> = {
        field: 6,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      expect(component.findType(filter)).toEqual('string');
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
      expect(component.findStatuses(statusFilter)).toEqual([
        {key: 'status1', value: '2'},
        {key: 'status2', value: '2'}
      ]);
    });

    it('should return an empty status list if the filter has no field', () => {
      const statusFilter: Filter<number, number> = {
        field: null,
        for: 'root',
        operator: 1,
        value: 'myStatus'
      };
      expect(component.findStatuses(statusFilter)).toEqual([]);
    });

    it('should return an empty status list if the filter definition does not exists', () => {
      const statusFilter: Filter<number, number> = {
        field: 6,
        for: 'root',
        operator: 1,
        value: 'myStatus'
      };
      expect(component.findStatuses(statusFilter)).toEqual([]);
    });

    it('should return an empty status list if the filter is not of type status', () => {
      const notAStatusFilter: Filter<number, number> = {
        field: 3,
        for: 'root',
        operator: 1,
        value: 'someValue'
      };
      expect(component.findStatuses(notAStatusFilter)).toEqual([]);
    });
  });

  it('should retrieve all operators of a type', () => {
    const filter: Filter<number, number> = {
      field: 4,
      for: 'root',
      operator: 1,
      value: 'myStatus'
    };
    expect(component.findOperator(filter)).toEqual(new FiltersService()['filterNumberOperators']);
  });

  it('should track by field', () => {
    expect(component.trackByField(0, filterDefinitions[0])).toEqual('root4');
  });

  it('should track by operator', () => {
    const operator: KeyValue<string, string> = {
      key: 'greater than',
      value: '0'
    };

    expect(component.trackByOperator(0, operator)).toBe(operator.key);
  });

  it('should change generic filters', () => {
    component.genericFormControl.setValue('column');
    component.onGenericFieldChange();
    expect(component.filter.field).toEqual('column');
  });
});