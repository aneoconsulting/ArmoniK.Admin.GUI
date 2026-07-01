import { ShowActionButton } from '@app/types/components/show';
import { Subject } from 'rxjs';
import { ShowActionAreaComponent } from './show-action-area.component';

describe('ShowActionAreaComponent', () => {
  let component: ShowActionAreaComponent;

  const disableCancel = new Subject<boolean>();
  const disableClose = new Subject<boolean>();

  const actions: ShowActionButton[] = [
    {
      id: 'tasks',
      name: 'See tasks',
      icon: 'tasks',
      link: '/tasks',
      queryParams: {},
    },
    {
      id: 'results',
      name: 'See results',
      icon: 'results',
      link: '/results',
      queryParams: {},
    },
    {
      id: 'partitions',
      name: 'See partitions',
      icon: 'partitions',
      link: '/partitions',
      queryParams: {},
    },
    {
      id: 'cancel',
      name: 'Cancel Session',
      icon: 'cancel',
      action$: new Subject(),
      disabled: disableCancel,
      color: 'accent',
      area: 'right'
    },
    {
      id: 'close',
      name: 'Close Session',
      icon: 'close',
      action$: new Subject(),
      disabled: disableClose,
      color: 'accent',
      area: 'right'
    },
    {
      id: 'delete',
      name: 'Delete Session',
      icon: 'delete',
      action$: new Subject(),
      color: 'accent',
      area: 'right'
    }
  ];

  beforeEach(() => {
    component = new ShowActionAreaComponent();
    component.actions = actions;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set actions', () => {
    expect(component.actions).toEqual(actions);
  });

  it('should set isDisabled', () => {
    disableCancel.next(true);
    expect(component.isDisabled).toEqual({
      cancel: true,
      close: false
    });
  });

});