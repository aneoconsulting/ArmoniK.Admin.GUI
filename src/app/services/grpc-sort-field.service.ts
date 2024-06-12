import { SessionField, SessionRawEnumField, SessionTaskOptionEnumField, TaskField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptionsFieldKey } from '@app/tasks/types';

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

  buildSortField<F extends GrpcSortOptionalFields> (
    field: TaskSummaryEnumField | TaskOptionEnumField | SessionRawEnumField | SessionTaskOptionEnumField | undefined,
    buildField: () => F): F
  {
    if (field && field.toString().startsWith('options.options.')) {
      return {
        taskOptionGenericField: {
          field: field.toString().replace('options.options.', '')
        }
      } as F;
    } else if (field && field.toString().startsWith('options.')) {
      return {
        taskOptionField: {
          field: this.sortOptionsFields[field.toString().replace('options.', '') as TaskOptionsFieldKey]
        }
      } as F;
    } else {
      return buildField();
    }
  }
}