import { PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Field } from '@app/types/column.type';
import { InspectionService } from '@app/types/services/inspectionService';
import { PartitionRaw } from '../types';

export class PartitionsInspectionService extends InspectionService<PartitionRaw> {
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

  readonly arrays: Field<PartitionRaw>[] = [
    { 
      key: 'parentPartitionIds', 
      link: 'partitions', 
      queryParams: `0-root-${PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID}-0`
    }
  ];
}