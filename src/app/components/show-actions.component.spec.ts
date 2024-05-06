import { SimpleChanges } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShowActionButton } from '@app/types/components/show';
import { IconsService } from '@services/icons.service';
import { ShowActionsComponent } from './show-actions.component';

describe('ShowActionComponent', () => {
  let component: ShowActionsComponent;

  const actionButtons: ShowActionButton[] = [
    {
      id: 'tasks',
      name: $localize`See tasks`,
    },
    {
      id: 'results',
      name: $localize`See results`,
    },
    {
      id: 'partitions',
      name: $localize`See partitions`,
    },
    {
      id: 'session',
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
        id: 'tasks',
        name: $localize`See tasks`,
      },
      {
        id: 'results',
        name: $localize`See results`,
      },
      {
        id: 'partitions',
        name: $localize`See partitions`,
      },
    ]);
    expect(component.rightActions).toEqual([
      {
        id: 'session',
        name: $localize`Cancel Session`,
        area: 'right'
      }
    ]);
  });

  it('should split applications on changes', () => {
    const changes = {'actionsButton': ''} as unknown as SimpleChanges;
    component.rightActions = [];
    component.ngOnChanges(changes);
    expect(component.rightActions).toEqual(actionButtons.filter(action => action.area === 'right'));
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