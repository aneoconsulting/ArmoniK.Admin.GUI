import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusService } from '@app/types/status';

@Injectable()
export class ResultsStatusesService extends StatusService<ResultStatus> {
  constructor() {
    super('results');
  }
}
