import { Field } from '@app/types/column.type';
import { InspectionService } from '@app/types/services/inspectionService';
import { PartitionRaw } from '../types';

export class PartitionInspectionService extends InspectionService<PartitionRaw> {
  readonly fields: Field<PartitionRaw>[] = [
    {
      key: 'priority'
    },
    {
      key: 'preemptionPercentage'
    },
    {
      key: 'podReserved'
    },
    {
      key: 'podMax'
    },
    {
      key: 'podConfiguration',
      type: 'object'
    }
  ];
}