import { FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { FiltersDialogOperatorComponent } from './filters-dialog-operator.component';

describe('FiltersDialogOperatorComponent', () => {
  const component = new FiltersDialogOperatorComponent();

  const operators: Record<number, string> = {
    [FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL]: 'equal',
    [FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS]: 'contain'
  };

  const registeredOnChange = jest.fn((val: number | null) => val);
  const registeredOnTouche = jest.fn((val: number | null) => val);

  beforeEach(() => {
    component.operators = operators;
    component.registerOnChange(registeredOnChange);
    component.registerOnTouched(registeredOnTouche);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('writeValue', () => {
    describe('With existing value', () => {
      const value = 'equal';

      beforeEach(() => {
        component.writeValue(value);
      });

      it('should write the value', () => {
        expect(component.value).toEqual(value);
      });

      it('should registered the key on changed', () => {
        expect(registeredOnChange).toHaveBeenCalledWith(FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL);
      });
    
      it('should registered the key on touched', () => {
        expect(registeredOnTouche).toHaveBeenCalledWith(FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL);
      });
    });

    describe('With non existing value', () => {
      const value = 'not existing';

      beforeEach(() => {
        component.writeValue(value);
      });

      it('should write the value', () => {
        expect(component.value).toEqual(value);
      });

      it('should registered the key on changed', () => {
        expect(registeredOnChange).toHaveBeenCalledWith(null);
      });
    
      it('should registered the key on touched', () => {
        expect(registeredOnTouche).toHaveBeenCalledWith(null);
      });
    });
  });
});