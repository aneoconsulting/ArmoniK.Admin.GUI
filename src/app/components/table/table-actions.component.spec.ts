import { ApplicationRaw } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { TableActionsComponent } from './table-actions.component';

describe('TableActionsComponent', () => {
  let component: TableActionsComponent<ApplicationRaw>;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableActionsComponent,
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(TableActionsComponent<ApplicationRaw>);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    const iconName = 'icon';
    component.getIcon(iconName);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(iconName);
  });
});