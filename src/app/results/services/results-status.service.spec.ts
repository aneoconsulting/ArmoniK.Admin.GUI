import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ResultsStatusesService } from './results-statuses.service';

describe('ResultsStatusService', () => {
  const service = new ResultsStatusesService();

  it('should return the correct status label', () => {
    expect(service.statusToLabel(ResultStatus.RESULT_STATUS_COMPLETED)).toEqual('Completed');
  });
});