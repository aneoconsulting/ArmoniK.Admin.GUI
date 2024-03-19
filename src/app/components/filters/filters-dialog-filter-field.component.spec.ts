import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { GenericColumn } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterInputOutput, FilterValueOptions } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { FiltersDialogFilterFieldComponent } from './filters-dialog-filter-field.component';

describe('FiltersDialogFilterFieldComponent', () => {
  let component: FiltersDialogFilterFieldComponent<number, number>;

  const mockDataFiltersService = {
    retrieveFiltersDefinitions: jest.fn(() => {
      return filterDefinitions;
    }),
    retrieveLabel: jest.fn((value: string) => {
      const labels = Object.values(propertiesLabel);
      return labels.map(label => label.toLowerCase() === value.toLowerCase());
    }),
    retrieveField: jest.fn((value: string) => {
      const values = Object.values(propertiesLabel);
      const index = values.findIndex(label => label.toLowerCase() === value.toLowerCase());
      return { for: 'root', index: index };
    })
  };
  const allStatuses = [
    {key: 0, value: 'Creation'},
    {key: 1, value: 'Submitted'},
    {key: 2, value: 'Ended'}
  ];

  const propertiesLabel: {[key: number]: string} = {
    0: 'undefined',
    1:'status',
    2:'task id',
    3:'children',
    4:'size',
    5:'-',
    6:'Start to End duration',
    7:'Created at',
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
        component.filteredProperties.subscribe(value => {
          expect(value).toEqual(['status', 'Start to End duration', 'Created at']);
        });
        component.propertyFormControl.setValue('at');
        component.propertyFormControl.updateValueAndValidity({emitEvent: true});
      });

      it('should return all the list in case of null value', () => {
        component.filteredProperties.subscribe(value => {
          expect(value).toEqual(Object.values(propertiesLabel));
        });
        component.propertyFormControl.setValue(null);
        component.propertyFormControl.updateValueAndValidity({emitEvent: true});
      });
    });

    describe('filteredOperators', () => {
      it('should filter properly', () => {
        component.filteredOperators.subscribe(value => {
          expect(value).toEqual(['equal', 'not equal']);
        });
        component.propertyFormControl.setValue('equal');
        component.propertyFormControl.updateValueAndValidity({emitEvent: true});
      });

      it('should return all the list in case of null value', () => {
        component.filteredOperators.subscribe(value => {
          expect(value).toEqual(['equal', 'not equal']);
        });
        component.propertyFormControl.setValue(null);
        component.propertyFormControl.updateValueAndValidity({emitEvent: true});
      });
    });

    describe('filteredStatuses', () => {
      it('should filter properly', () => {
        component.filteredStatuses.subscribe(value => {
          expect(value).toEqual(['sumbitted', 'Ended']);
        });
        component.propertyFormControl.setValue('ed');
        component.propertyFormControl.updateValueAndValidity({emitEvent: true});
      });

      it('should return all the list in case of null value', () => {
        component.filteredStatuses.subscribe(value => {
          expect(value).toEqual(Object.values(allStatuses));
        });
        component.propertyFormControl.setValue(null);
        component.propertyFormControl.updateValueAndValidity({emitEvent: true});
      });
    });
  });

  describe('retrieveStatusKey', () => {
    it('should retrieve the key of the status', () => {
      expect(component.retrieveStatusKey(allStatuses[0].value)).toEqual(0);
    });

    it('should return null if no label is provided', () => {
      expect(component.retrieveStatusKey(null)).toEqual(null);
    });

    it('should return null if the label does not exists', () => {
      expect(component.retrieveStatusKey('Unexisting')).toEqual(null);
    });
  });

  describe('retrieveStatusLabel', () => {
    it('should retrieve status label', () => {
      expect(component.retrieveStatusLabel(1)).toEqual('Submitted');
    });
    it('should retrieve empty status label when no status is found', () => {
      expect(component.retrieveStatusLabel(null)).toEqual('');
    });
    it('should return empty string if allStatus is undefined', () => {
      component.allStatuses = undefined as unknown as FilterValueOptions;
      expect(component.retrieveStatusLabel(1)).toEqual('');
    });
  });

  describe('onPropertyChange', () => {
    it('should update filter', () => {
      component.propertyFormControl.setValue('Created at');
      component.onPropertyChange();
      expect(component.filter).toEqual({
        for: 'root',
        field: 7,
        operator: null,
        value: null
      });
    });

    it('should not update anything if the field does not exists', () => {
      component.propertyFormControl.setValue('Unexisting');
      component.onPropertyChange();
      expect(component.filter).toEqual({
        field: 1,
        for: 'root',
        operator: 0,
        value: 'someValue'
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
  it('should change the operator of the filter', () => {
    component.operatorFormControl.setValue('Equal');
    component.onOperatorChange();
    expect(component.filter.operator).toEqual(0);
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

    it('should change the filter value to status if one status is passed', () => {
      const inputEvent: FilterInputOutput = {
        type: 'status',
        value: 'Submitted'
      };
      component.onInputChange(inputEvent);
      expect(component.filter.value).toEqual(1);
    });

    it('should change the filter value to boolean if one boolean is passed', () => {
      const inputEvent: FilterInputOutput = {
        type: 'boolean',
        value: true
      };
      component.onInputChange(inputEvent);
      expect(component.filter.value).toEqual(true);
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

      it('should return a boolean filteValue', () => {
        const booleanFilter: Filter<number, number> = {
          field: 8,
          for: 'root',
          operator: 1,
          value: true
        };

        expect(component.findInput(booleanFilter)).toEqual({
          type: 'boolean',
          value: true
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
          statuses: allStatuses
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
          statuses: allStatuses
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
      expect(component.findStatuses(statusFilter)).toEqual(allStatuses);
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

  describe('hasOneOperator', () => {
    it('should be false if the filter has more than one operator', () => {
      component.allOperators = {
        0: 'equal',
        1: 'not equal'
      };
      expect(component.hasOneOperator).toBeFalsy();
    });

    it('should be true if the filter has only one operator', () => {
      component.allOperators = {
        0: 'is'
      };
      expect(component.hasOneOperator).toBeTruthy();
    });
  });

  describe('disableOperator', () => {
    it('should set the first filter operator as the operator', () => {
      component.allOperators = {
        0: 'equal',
        1: 'not equal'
      };
      component.disableOperator();
      expect(component.filter.operator).toEqual(0);
    });

    it('should disable operator form control', () => {
      component.disableOperator();
      expect(component.operatorFormControl.disabled).toBeTruthy();
    });
  });

  describe('enableOperator', () => {
    it('should enable operator form control', () => {
      component.enableOperator();
      expect(component.operatorFormControl.enabled).toBeTruthy();
    });

    it('should set filter operator to null if it is not kept', () => {
      component.enableOperator();
      expect(component.filter.operator).toBeNull();
    });

    it('should does not modify the filter operator if it is kept', () => {
      component.filter.operator = 1;
      component.enableOperator(true);
      expect(component.filter.operator).toEqual(1);
    });
  });

  describe('handleOperatorState', () => {
    it('should enable operator if there is more than one operator', () => {
      const spy = jest.spyOn(component, 'enableOperator');
      component.allOperators = {
        0: 'equal',
        1: 'not equal'
      };
      component.handleOperatorState(false);
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should disable operator if there is only one operator', () => {
      const spy = jest.spyOn(component, 'disableOperator');
      component.allOperators = {
        0: 'equal',
      };
      component.handleOperatorState();
      expect(spy).toHaveBeenCalled();
    });

    it('should set the label of the selected operator', () => {
      component.allOperators = {
        0: 'equal',
        1: 'not equal'
      };
      component.filter.operator = 0;
      component.handleOperatorState(true);
      expect(component.operatorFormControl.value).toEqual('equal');
    });
  });
});