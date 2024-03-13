import { Subject } from 'rxjs';
import { ApplicationData, PartitionData, ResultData, SessionData, TaskData } from './data';

export type ActionTable<T extends ApplicationData | SessionData | PartitionData | TaskData | ResultData> = {
  icon: string;
  label: string;
  action$: Subject<T>;
  condition?: (element: T) => boolean;
};