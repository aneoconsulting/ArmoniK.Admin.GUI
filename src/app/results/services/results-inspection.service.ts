import { Field } from '@app/types/column.type';
import { InspectionService } from '@app/types/services/inspectionService';
import { ResultRaw } from '../types';

export class ResultInspectionService extends InspectionService<ResultRaw> {
  readonly fields: Field<ResultRaw>[] = [
    {
      key: 'name'
    },
    {
      key: 'sessionId',
      link: 'sessions'
    },
    {
      key: 'ownerTaskId',
      link: 'tasks'
    },
    {
      key: 'createdAt',
      type: 'date'
    },
    {
      key: 'completedAt',
      type: 'date'
    },
    {
      key: 'size'
    }
  ];
}