import { TestBed } from '@angular/core/testing';
import { ExternalService } from '@app/types/external-service';
import { IconsService } from '@services/icons.service';
import { FormExternalServiceComponent } from './form-external-service.component';

describe('', () => {
  let component: FormExternalServiceComponent;

  const externalService = {
    name: 'service',
    url: 'url',
    icon: 'heart' as string | null
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FormExternalServiceComponent,
        IconsService
      ]
    }).inject(FormExternalServiceComponent);
    component.externalService = externalService as ExternalService;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should patch service form', () => {
      expect(component.externalServiceForm.value).toEqual({
        name: externalService.name,
        url: externalService.url,
        icon: externalService.icon
      });
    });
  });

  it('should emit on submit', () => {
    const spy = jest.spyOn(component.submitChange, 'emit');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith(externalService);
  });

  it('should get icons', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should change the icon of the form', () => {
    const icon = 'add';
    component.onIconChange(icon);
    expect(component.externalServiceForm.value.icon).toEqual(icon);
  });
});