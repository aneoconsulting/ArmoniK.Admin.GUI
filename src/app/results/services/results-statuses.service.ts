import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusLabelColor, StatusService } from '@app/types/status';

@Injectable()
export class ResultsStatusesService extends StatusService<ResultStatus> {
  readonly statuses: Record<ResultStatus, StatusLabelColor> = {
    [ResultStatus.RESULT_STATUS_UNSPECIFIED]: {
      label: $localize`Unspecified`,
      color: '#696969',
    },
    [ResultStatus.RESULT_STATUS_CREATED]: {
      label: $localize`Created`,
      color: '#008B8B',
      icon: 'add',
    },
    [ResultStatus.RESULT_STATUS_COMPLETED]: {
      label: $localize`Completed`,
      color: '#006400',
      icon: 'success',
    },
    [ResultStatus.RESULT_STATUS_ABORTED]: {
      label: $localize`Aborted`,
      color: '#800080',
      icon: 'cancel'
    },
    [ResultStatus.RESULT_STATUS_DELETED]: {
      label: $localize`Deleted`,
      color: '#000000',
      icon: 'delete',
    },
    [ResultStatus.RESULT_STATUS_NOTFOUND]: {
      label: $localize`Not found`,
      color: '#696969'
    },
  };
}
