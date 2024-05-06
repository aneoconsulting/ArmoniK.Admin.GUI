import { Subject } from 'rxjs';
import { ResultRaw } from '@app/results/types';
import { ShowCardComponent } from './show-card.component';

describe('ShowCardComponent', () => {

  let component: ShowCardComponent<ResultRaw>;

  const subject = new Subject<ResultRaw>();

  beforeEach(() => {
    component = new ShowCardComponent();
    component.data$ = subject;
    component.statuses = { 1: 'status' };
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to data$', () => {
    expect(subject.observed).toBeTruthy();
  });

  it('should update data', () => {
    const result = { name: 'result' } as ResultRaw;
    subject.next(result);
    expect(component.data).toEqual(result);
  });

});