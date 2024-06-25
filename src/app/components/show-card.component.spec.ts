import { ResultRaw } from '@app/results/types';
import { ShowCardComponent } from './show-card.component';

describe('ShowCardComponent', () => {

  const statuses = { 1: 'status' };
  const data: ResultRaw = {} as ResultRaw;
  const component = new ShowCardComponent<ResultRaw>();

  component.data = data;
  component.statuses = statuses;

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});