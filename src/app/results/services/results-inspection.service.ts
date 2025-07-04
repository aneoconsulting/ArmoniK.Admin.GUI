import { Field } from '@app/types/column.type';
import { InspectionService } from '@app/types/services/inspectionService';
import { ResultRaw } from '../types';

export class ResultsInspectionService extends InspectionService<ResultRaw> {
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
      key: 'createdBy',
      link: 'tasks',
    },
    {
      key: 'completedAt',
      type: 'date'
    },
    {
      key: 'manualDeletion',
    },
    {
      key: 'size'
    },
    {
      key: 'opaqueId',
      type: 'byte-array',
    }
  ];
}