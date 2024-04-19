import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusesServiceI } from '@app/types/services';

@Injectable()
export class ResultsStatusesService implements StatusesServiceI<ResultStatus> {
  readonly statuses: Record<ResultStatus, string> = {
    [ResultStatus.RESULT_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [ResultStatus.RESULT_STATUS_CREATED]: $localize`Created`,
    [ResultStatus.RESULT_STATUS_COMPLETED]: $localize`Completed`,
    [ResultStatus.RESULT_STATUS_ABORTED]: $localize`Aborted`,
    [ResultStatus.RESULT_STATUS_DELETED]: $localize`Deleted`,
    [ResultStatus.RESULT_STATUS_NOTFOUND]: $localize`Not found`,
  };

  statusToLabel(status: ResultStatus): string {
    return this.statuses[status];
  }
}
