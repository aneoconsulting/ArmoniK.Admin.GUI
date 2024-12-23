import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusLabelColor, StatusService } from '@app/types/status';

@Injectable()
export class ResultsStatusesService extends StatusService<ResultStatus> {
  readonly statuses: Record<ResultStatus, StatusLabelColor> = {
    [ResultStatus.RESULT_STATUS_UNSPECIFIED]: {
      label: $localize`Unspecified`,
      color: 'grey',
    },
    [ResultStatus.RESULT_STATUS_CREATED]: {
      label: $localize`Created`,
      color: 'darkcyan',
      icon: 'add',
    },
    [ResultStatus.RESULT_STATUS_COMPLETED]: {
      label: $localize`Completed`,
      color: 'green',
      icon: 'success',
    },
    [ResultStatus.RESULT_STATUS_ABORTED]: {
      label: $localize`Aborted`,
      color: 'purple',
      icon: 'cancel'
    },
    [ResultStatus.RESULT_STATUS_DELETED]: {
      label: $localize`Deleted`,
      color: 'black',
      icon: 'delete',
    },
    [ResultStatus.RESULT_STATUS_NOTFOUND]: {
      label: $localize`Not found`,
      color: 'grey'
    },
  };
}
