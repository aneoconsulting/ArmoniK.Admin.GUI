import { FormNameLineComponent } from './form-name-line.component';

describe('FormNameLineComponent', () => {
  const component = new FormNameLineComponent();
  component.line = 'line';
  component.type = 'Applications';
  component.ngOnInit();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.lineForm.value.name).toEqual('line');
    expect(component.lineForm.value.type).toEqual('Applications');
  });

  describe('onSubmit', () => {

    const spySubmit = jest.spyOn(component.submitChange, 'emit');

    it('should submit if there is a value', () => {
      component.lineForm.value.name = 'line';
      component.lineForm.value.type = 'Applications';
      component.onSubmit();
      expect(spySubmit).toHaveBeenCalledWith({name: 'line', type: 'Applications'});
    });
  
    it('should submit empty if there no value', () => {
      component.lineForm.value.name = null;
      component.lineForm.value.type = null;
      component.onSubmit();
      expect(spySubmit).toHaveBeenCalledWith({name:'', type: ''});
    });
  });

  it('should cancel', () => {
    const spyCancel = jest.spyOn(component.cancelChange, 'emit');
    component.onCancel();
    expect(spyCancel).toHaveBeenCalled();
  });

  it('should track by status', () => {
    expect(component.trackByStatus(0, {value: 'value', name: 'name'})).toEqual('value');
  });
});