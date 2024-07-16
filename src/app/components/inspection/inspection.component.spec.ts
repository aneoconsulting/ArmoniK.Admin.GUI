import { TaskRaw, TaskSummaryColumnKey } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { InspectionComponent } from './inspection.component';

describe('InspectionComponent', () => {
  const component = new InspectionComponent();

  const data: TaskRaw = {
    id: 'taskId',
    options: {
      applicationName: 'string',
    }
  } as TaskRaw;

  const optionsFields: Field<TaskSummaryColumnKey>[] = [
    {
      key: 'options.options',
      type: 'object'
    },
    {
      key: 'options.options.FastCompute'
    },
    {
      key: 'options.applicationName'
    }
  ];

  const fields: Field<TaskSummaryColumnKey>[] = [
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

  const allFields = [...fields, ...optionsFields];

  beforeEach(() => {
    component.fields = allFields;
    component.data = data;
  });

  describe('initialisation', () => {
    it('should set fields without options fields', () => {
      expect(component.fields).toEqual(fields);
    });

    it('should set optionsFields', () => {
      expect(component.optionsFields).toEqual(optionsFields.map(field => {
        return {
          ...field,
          key: field.key.replace('options.', '')
        };
      }));
    });

    it('should set data', () => {
      expect(component.data).toEqual(data);
    });

    it('should set data keys as fields if none are provided', () => {
      component.fields = [];
      component.data = data;
      expect(component.fields).toEqual([{key: 'id'}, {key: 'options'}]);
    });
  });

  it('should retrieve an object', () => {
    expect(component.getObject(fields[2])).toEqual(data.options);
  });
});