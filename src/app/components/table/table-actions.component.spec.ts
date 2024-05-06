import { TestBed } from '@angular/core/testing';
import { ApplicationData } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { TableActionsComponent } from './table-actions.component';

describe('TableActionsComponent', () => {
  let component: TableActionsComponent<ApplicationData>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableActionsComponent,
        IconsService
      ]
    }).inject(TableActionsComponent<ApplicationData>);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('icon')).toEqual('palette');
  });
});