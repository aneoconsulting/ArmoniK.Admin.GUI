import { TestBed } from '@angular/core/testing';
import { ShowActionButton } from '@app/types/components/show';
import { IconsService } from '@services/icons.service';
import { ShowActionsComponent } from './show-actions.component';

describe('ShowActionComponent', () => {
  let component: ShowActionsComponent;

  const actionButtons: ShowActionButton[] = [
    {
      name: $localize`See tasks`,
    },
    {
      name: $localize`See results`,
    },
    {
      name: $localize`See partitions`,
    },
    {
      name: $localize`Cancel Session`,
      area: 'right'
    }
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowActionsComponent,
        IconsService
      ]
    }).inject(ShowActionsComponent);
    component.actionsButton = actionButtons;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init properly', () => {
    component.ngOnInit();
    expect(component.leftActions).toEqual([
      {
        name: $localize`See tasks`,
      },
      {
        name: $localize`See results`,
      },
      {
        name: $localize`See partitions`,
      },
    ]);
    expect(component.rightActions).toEqual([
      {
        name: $localize`Cancel Session`,
        area: 'right'
      }
    ]);
  });

  it('should get refresh icon', () => {
    expect(component.getRefreshIcon()).toBe('refresh');
  });

  it('should emit on refresh', () => {
    const spy = jest.spyOn(component.refresh, 'emit');
    component.onRefreshClick();
    expect(spy).toHaveBeenCalled();
  });
});