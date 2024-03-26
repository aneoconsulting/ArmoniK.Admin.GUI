import { Subject } from 'rxjs';
import { ResultRaw } from '@app/results/types';
import { ShowCardComponent } from './show-card.component';

describe('ShowCardComponent', () => {

  let component: ShowCardComponent<ResultRaw>;

  const spy = {
    subscribe: jest.fn()
  } as unknown as Subject<ResultRaw>;

  beforeEach(() => {
    component = new ShowCardComponent();
    component.data$ = spy;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to data$', () => {
    expect(spy.subscribe).toHaveBeenCalled();
  });

});