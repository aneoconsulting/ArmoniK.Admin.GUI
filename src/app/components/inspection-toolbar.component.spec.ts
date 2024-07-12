import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { InspectionToolbarComponent } from './inspection-toolbar.component';

describe('InspectionToolbar', () => {
  let component: InspectionToolbarComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectionToolbarComponent,
        IconsService
      ]
    }).inject(InspectionToolbarComponent);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined refresh', () => {
    expect(component.refresh).toBeDefined();
  });

  it('should have a defined refreshIcon', () => {
    expect(component.refreshIcon).toBeDefined();
  });
});