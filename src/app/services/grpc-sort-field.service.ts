import { SessionField, TaskField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptions, TaskOptionsFieldKey } from '@app/tasks/types';
import { DataRaw } from '../types/data';
import { ListOptionsSort } from '../types/options';

export type GrpcSortOptionalFields = TaskField.AsObject | SessionField.AsObject;

export class GrpcSortFieldService {
  readonly sortOptionsFields: Record<TaskOptionsFieldKey, TaskOptionEnumField> = {
    applicationName: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
    applicationVersion: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
    applicationNamespace: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE,
    applicationService: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE,
    engineType: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_ENGINE_TYPE,
    maxDuration: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION,
    maxRetries: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
    options: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_UNSPECIFIED,
    priority: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY,
    partitionId: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
  };

  buildSortField<D extends DataRaw, F extends GrpcSortOptionalFields> (
    sort: ListOptionsSort<D & TaskOptions>,
    buildField: (sortOptions: ListOptionsSort<D & TaskOptions>) => F): F
  {
    if (sort.active && sort.active.toString().startsWith('options.options.')) {
      return {
        taskOptionGenericField: {
          field: sort.active.toString().replace('options.options.', '')
        }
      } as F;
    } else if (sort.active && sort.active.toString().startsWith('options.')) {
      return {
        taskOptionField: {
          field: this.sortOptionsFields[sort.active.toString().replace('options.', '') as TaskOptionsFieldKey]
        }
      } as F;
    } else {
      return buildField(sort);
    }
  }
}