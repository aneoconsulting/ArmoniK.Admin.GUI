import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskRaw } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { DataRaw } from '@app/types/data';
import { InspectionObjectComponent } from './inspection-object.component';

function findField<T extends DataRaw>(key: string, fields: Field<T>[]) {
  return fields.find(field => field.key === key);
}

describe('InspectionObjectComponent', () => {
  const component = new InspectionObjectComponent<TaskRaw, TaskStatus>();

  const data: TaskRaw = {
    id: 'taskId',
    options: {
      applicationName: 'string',
    },
    statusMessage: 'some message',
    output: {
      error: 'error message',
      success: false,
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
      key: 'output',
      type: 'output'
    },
    {
      key: 'statusMessage',
      type: 'message'
    },
    {
      key: 'options',
      type: 'object'
    },
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
      expect(component.fields).toEqual([{ key: 'id' }, { key: 'options' }, { key: 'output' }, { key: 'statusMessage' }]);
    });
  });

  it('should get an object', () => {
    expect(component.getObject(findField('options', fields)!)).toEqual(data.options);
  });

  it('should get the output error', () => {
    expect(component.getError(findField('output', fields)!)).toEqual(data.output?.error);
  });

  it('should get the message', () => {
    expect(component.getMessage(findField('statusMessage', fields)!)).toEqual(data.statusMessage);
  });
});