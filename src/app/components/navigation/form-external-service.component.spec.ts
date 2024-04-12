import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormExternalServiceComponent } from './form-external-service.component';

describe('', () => {
  let component: FormExternalServiceComponent;
  let fixture: ComponentFixture<FormExternalServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      providers: [
        FormExternalServiceComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExternalServiceComponent);
    component = fixture.componentInstance;
    component.externalService = {
      name: 'service',
      url: 'url',
      icon: 'main'
    };
    fixture.detectChanges();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect({
      ...component.serviceForm.value,
      icon: component.icon
    }).toEqual(component.externalService);
  });

  it('should emit on submit', () => {
    const spy = jest.spyOn(component.submitChange, 'emit');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith(component.externalService);
  });

  it('should emit on cancel', () => {
    const spy = jest.spyOn(component.cancelChange, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });
});