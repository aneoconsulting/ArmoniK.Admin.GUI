import { ResultRaw } from '@app/results/types';
import { ShowCardComponent } from './show-card.component';

describe('ShowCardComponent', () => {
  const data: ResultRaw = {} as ResultRaw;
  const component = new ShowCardComponent<ResultRaw>();

  component.data = data;

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});