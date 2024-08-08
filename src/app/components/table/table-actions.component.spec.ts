import { ApplicationRaw } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { TableActionsComponent } from './table-actions.component';

describe('TableActionsComponent', () => {
  let component: TableActionsComponent<ApplicationRaw>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableActionsComponent,
        IconsService
      ]
    }).inject(TableActionsComponent<ApplicationRaw>);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('icon')).toEqual('palette');
  });
});