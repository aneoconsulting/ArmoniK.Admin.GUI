import { ExternalService } from '@app/types/external-service';
import { FormExternalServiceComponent } from './form-external-service.component';

describe('', () => {
  const component = new FormExternalServiceComponent();

  const externalService = {
    name: 'service',
    url: 'url',
    icon: 'heart' as string | null
  };

  beforeEach(() => {
    component.externalService = externalService as ExternalService;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should patch service form', () => {
      expect(component.serviceForm.value).toEqual({
        name: externalService.name,
        url: externalService.url
      });
    });

    it('should set icon', () => {
      expect(component.icon).toEqual(externalService.icon);
    });

    it('should not have an icon if there is none', () => {
      const nullExternalService = {
        name: 'service',
        url: 'url',
        icon: null
      };
      component.externalService = nullExternalService as unknown as ExternalService;
      component.ngOnInit();
      expect(component.icon).toEqual('');
    });
  });

  it('should emit on submit', () => {
    const spy = jest.spyOn(component.submitChange, 'emit');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith(externalService);
  });

  it('should emit on cancel', () => {
    const spy = jest.spyOn(component.cancelChange, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });
});