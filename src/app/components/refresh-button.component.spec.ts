import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { RefreshButtonComponent } from './refresh-button.component';

describe('RefreshButtonComponent', () => {

  let component: RefreshButtonComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers:[
        RefreshButtonComponent,
        IconsService
      ]
    }).inject(RefreshButtonComponent);
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('Should emit on click', () => {
    const spyEmit: jest.SpyInstance = jest.spyOn(component, 'emit');
    component.onClick();
    expect(spyEmit).toHaveBeenCalled();
  });
});