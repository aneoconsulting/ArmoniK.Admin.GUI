import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptions, TaskRaw } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { Status } from '@app/types/data';
import { InspectionCardComponent } from './inspection-card.component';

describe('InspectionCardComponent', () => {
  const component = new InspectionCardComponent<TaskRaw, TaskStatus, TaskOptions>();

  const data: TaskRaw = {
    id: 'taskId',
    options: {
      applicationName: 'string',
    }
  } as TaskRaw;

  const fields: Field<TaskRaw>[] = [
    {
      key: 'id',
      type: 'link',
      link: 'tasks'
    },
    {
      key: 'sessionId',
      type: 'link',
      link: 'sessions'
    },
    {
      key: 'options',
      type: 'object'
    },
    {
      key: 'createdAt',
      type: 'date'
    }
  ];

  const optionsFields: Field<TaskOptions>[] = [
    {
      key: 'applicationName',
    },
    {
      key: 'options',
      type: 'object'
    }
  ];

  const statuses = {
    [TaskStatus.TASK_STATUS_COMPLETED]: 'Completed',
    [TaskStatus.TASK_STATUS_CANCELLING]: 'Cancelling',
  } as Record<Status, string>;

  beforeEach(() => {
    component.fields = fields;
    component.optionsFields = optionsFields;
    component.data = data;
    component.statuses = statuses;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should init fields', () => {
      expect(component.fields).toEqual(fields);
    });

    it('should init options fields', () => {
      expect(component.optionsFields).toEqual(optionsFields);
    });

    it('should init data', () => {
      expect(component.data).toEqual(data);
    });

    it('should init statuses', () => {
      expect(component.statuses).toEqual(statuses);
    });
  });
});