import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskRaw } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { InspectionObjectComponent } from './inspection-object.component';

describe('InspectionObjectComponent', () => {
  const component = new InspectionObjectComponent<TaskRaw, TaskStatus>();

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

  const statuses: Record<TaskStatus, string> = {
    0: 'Undefined',
    1: 'completed'
  } as Record<TaskStatus, string>;

  beforeEach(() => {
    component.data = data;
    component.fields = fields;
    component.statuses = statuses;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set data', () => {
      expect(component.data).toEqual(data);
    });

    it('should set fields', () => {
      expect(component.fields).toEqual(fields);
    });

    it('should set statuses', () => {
      expect(component.statuses).toEqual(statuses);
    });

    it('should set data keys as fields if none are provided', () => {
      component.fields = [];
      component.data = data;
      expect(component.fields).toEqual([{ key: 'id' }, { key: 'options' }]);
    });
  });

  it('should get an object', () => {
    expect(component.getObject(fields[2])).toEqual(data.options);
  });
});