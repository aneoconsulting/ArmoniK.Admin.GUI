import { ResultRawEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Field } from '@app/types/column.type';
import { InspectionService } from '@app/types/services/inspectionService';
import { TaskOptions, TaskRaw } from '../types';

export class TasksInspectionService extends InspectionService<TaskRaw> {
  readonly fields: Field<TaskRaw>[] = [
    {
      key: 'sessionId',
      link: 'sessions'
    },
    {
      key: 'initialTaskId',
      link: 'tasks'
    },
    {
      key: 'ownerPodId'
    },
    {
      key: 'podHostname'
    },
    {
      key: 'podTtl'
    },
    {
      key: 'creationToEndDuration',
      type: 'duration'
    },
    {
      key: 'receivedToEndDuration',
      type: 'duration'
    },
    {
      key: 'processingToEndDuration',
      type: 'duration'
    },
    {
      key: 'createdBy',
      link: 'tasks',
    },
    {
      key: 'payloadId',
      link: 'results',
    },
    {
      key: 'createdAt',
      type: 'date'
    },
    {
      key: 'submittedAt',
      type: 'date'
    },
    {
      key: 'receivedAt',
      type: 'date'
    },
    {
      key: 'acquiredAt',
      type: 'date'
    },
    {
      key: 'fetchedAt',
      type: 'date'
    },
    {
      key: 'startedAt',
      type: 'date'
    },
    {
      key: 'processedAt',
      type: 'date'
    },
    {
      key: 'endedAt',
      type: 'date'
    },
    {
      key: 'statusMessage',
      type: 'object'
    },
    {
      key: 'output',
      type: 'object'
    },
  ];

  readonly optionsFields: Field<TaskOptions>[] = [
    {
      key: 'partitionId',
      link: 'partitions'
    },
    {
      key: 'applicationName'
    },
    {
      key: 'applicationVersion'
    },
    {
      key: 'applicationService'
    },
    {
      key: 'applicationNamespace'
    },
    {
      key: 'maxDuration'
    },
    {
      key: 'maxRetries'
    },
    {
      key: 'priority'
    },
    {
      key: 'options',
      type: 'object'
    },
  ];

  readonly arrays: Field<TaskRaw>[] =  [
    {
      key: 'dataDependencies',
      link: 'results',
      queryParams: `0-root-${ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID}-0`
    },
    {
      key: 'expectedOutputIds',
      link: 'results',
      queryParams: `0-root-${ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID}-0`
    },
    {
      key: 'parentTaskIds',
      link: 'tasks',
      queryParams: `0-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID}-0`
    },
    {
      key: 'retryOfIds',
      link: 'tasks',
      queryParams: `0-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID}-0`
    }
  ];
}