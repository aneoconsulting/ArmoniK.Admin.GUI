import { Field } from '@app/types/column.type';
import { InspectionService } from '@app/types/services/inspectionService';
import { SessionRaw } from '../types';

export class SessionInspectionService extends InspectionService<SessionRaw> {
  readonly fields: Field<SessionRaw>[] = [
    {
      key: 'duration',
      type: 'duration'
    },
    {
      key: 'clientSubmission',
    },
    {
      key: 'workerSubmission'
    },
    {
      key: 'createdAt',
      type: 'date',
    },
    {
      key: 'cancelledAt',
      type: 'date',
    },
    {
      key: 'purgedAt',
      type: 'date',
    },
    {
      key: 'closedAt',
      type: 'date'
    },
    {
      key: 'deletedAt',
      type: 'date'
    }
  ];

  readonly arrays: Field<SessionRaw>[] = [
    {
      key: 'partitionIds',
      link: 'partitions'
    }
  ];
}