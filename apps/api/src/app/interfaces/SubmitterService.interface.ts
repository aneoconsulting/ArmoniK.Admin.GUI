import { Observable } from 'rxjs';
import { TaskStatusEnum } from '@armonik.admin.gui/interfaces';

export type StatusCount = {
  status: TaskStatusEnum;
  count: number;
};

export type Count = {
  value: StatusCount[];
};

// Must be conform to the service in proto files.
export interface SubmitterService {
  countTasks(filter: object): Observable<Count>;
}
