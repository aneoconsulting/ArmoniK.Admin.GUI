import { SessionRawEnumField, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { DateHandlerService } from './date-handler.service';
import { Filter } from '../types/filters';

describe('date-handler', () => {

  const dateHandlerService = new DateHandlerService();

  const filter: Filter<SessionRawEnumField, SessionTaskOptionEnumField> = {
    for: 'root',
    field: 1,
    value: 1,
    operator: 0
  };

  it('should return a the filter number in case of a non modifier operation', () => {
    expect(dateHandlerService.setSecondsByDateOperator(filter));
  });

  it('should return a modified number in case of a modifier operation', () => {
    filter.operator = 5;
    expect(dateHandlerService.setSecondsByDateOperator(filter));
  });

  it('should return 0 if the value is null', () => {
    filter.value = null;
    expect(dateHandlerService.setSecondsByDateOperator(filter));
  });
});