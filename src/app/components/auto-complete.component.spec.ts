import { AutoCompleteComponent } from './auto-complete.component';

describe('AutoCompleteComponent', () => {
  const component = new AutoCompleteComponent();

  const options: string[] = ['sessions', 'applications', 'tasks'];

  const value: string = 'applications';

  const emitSpy = jest.spyOn(component.valueChange, 'emit');

  beforeEach(() => {
    component.options = options;
    component.value = value;
    component.ngOnInit();
  });

  it('should create',() => {
    expect(component).toBeDefined();
  });

  describe('setting options', () => {
    it('should init filteredOptions', () => {
      expect(component.filteredOptions()).toEqual(options);
    });

    it('should init hasOneOption', () => {
      expect(component.hasOneOption).toBeFalsy();
    });
  });

  describe('setting value', () => {
    it('should update formControl value', () => {
      component.value = null;
      expect(component.formControl.value).toEqual('');
    });
  });

  describe('initialisation', () => {
    it('should set formControl value', () => {
      expect(component.formControl.value).toEqual(value);
    });
  });

  describe('onInputChange', () => {
    const filter = 'ions';
    beforeEach(() => {
      component.formControl.setValue(filter);
      component.onInputChange();
    });

    it('should update filteredOptions', () => {
      expect(component.filteredOptions()).toEqual(options.filter(option => option.includes(filter)));
    });

    it('should emit', () => {
      expect(emitSpy).toHaveBeenCalledWith(filter);
    });
  });

  describe('setting a size one options list', () => {
    const lonelyOption = ['sessions'];
    beforeEach(() => {
      component.options = lonelyOption;
    });

    it('should set hasOneOption', () => {
      expect(component.hasOneOption).toBeTruthy();
    });

    it('should update formControl status', () => {
      expect(component.formControl.disabled).toBeTruthy();
    });

    it('should update the value', () => {
      expect(component.formControl.value).toEqual(lonelyOption[0]);
    });
  });

  test('checkOptions should update value', () => {
    component.hasOneOption = true;
    component.checkOptions();
    expect(component.formControl.value).toEqual(options[0]);
  });

  describe('formControlStatus', () => {
    it('should disable the form if there is only one option', () => {
      component.hasOneOption = true;
      component.formControlStatus();
      expect(component.formControl.disabled).toBeTruthy();
    });

    it('should set first option if there is only one option', () => {
      component.hasOneOption = true;
      component.formControlStatus();
      expect(component.formControl.value).toEqual(options[0]);
    });

    it('should enable the form if there is not only one option', () => {
      component.hasOneOption = false;
      component.formControlStatus();
      expect(component.formControl.enabled).toBeTruthy();
    });
  });
});