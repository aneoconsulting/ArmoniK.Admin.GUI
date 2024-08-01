import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptions, TaskRaw } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { InspectionComponent } from './inspection.component';

describe('InspectionComponent', () => {
  const component = new InspectionComponent<TaskRaw, TaskStatus, TaskOptions>();

  const data: TaskRaw = {
    id: 'taskId',
    options: {
      applicationName: 'string',
    }
  } as TaskRaw;

  const optionsFields: Field<TaskOptions>[] = [
    {
      key: 'applicationName',
    },
    {
      key: 'options',
      type: 'object'
    }
  ];

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

  const statuses: Record<TaskStatus, string> = {
    0: 'Undefined',
    1: 'completed'
  } as Record<TaskStatus, string>;

  beforeEach(() => {
    component.fields = fields;
    component.optionsFields = optionsFields;
    component.data = data;
    component.statuses = statuses;
  });

  describe('initialisation', () => {
    it('should set fields without options fields', () => {
      expect(component.fields).toEqual(fields);
    });

    it('should set optionsFields', () => {
      expect(component.optionsFields).toEqual(optionsFields);
    });

    it('should set data', () => {
      expect(component.data).toEqual(data);
    });

    it('should set "options" object', () => {
      expect(component.options).toEqual(data.options);
    });

    it('should set statuses', () => {
      expect(component.statuses).toEqual(statuses);
    });
  });
});