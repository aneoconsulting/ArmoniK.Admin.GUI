import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusService } from '@app/types/status';

@Injectable()
export class ResultsStatusesService extends StatusService<ResultStatus> {
  readonly statuses: Record<ResultStatus, string> = {
    [ResultStatus.RESULT_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [ResultStatus.RESULT_STATUS_CREATED]: $localize`Created`,
    [ResultStatus.RESULT_STATUS_COMPLETED]: $localize`Completed`,
    [ResultStatus.RESULT_STATUS_ABORTED]: $localize`Aborted`,
    [ResultStatus.RESULT_STATUS_DELETED]: $localize`Deleted`,
    [ResultStatus.RESULT_STATUS_NOTFOUND]: $localize`Not found`,
  };
}
