import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskRaw, TaskSummaryColumnKey } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { Status } from '@app/types/data';
import { InspectionCardComponent } from './inspection-card.component';

describe('InspectionCardComponent', () => {
  const component = new InspectionCardComponent();

  const data: TaskRaw = {
    id: 'taskId',
    options: {
      applicationName: 'string',
    }
  } as TaskRaw;

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

  const statuses = {
    [TaskStatus.TASK_STATUS_COMPLETED]: 'Completed',
    [TaskStatus.TASK_STATUS_CANCELLING]: 'Cancelling',
  } as Record<Status, string>;

  beforeEach(() => {
    component.line = true;
    component.fields = fields;
    component.data = data;
    component.statuses = statuses;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should init line', () => {
      expect(component.line).toBeTruthy();
    });

    it('should init fields', () => {
      expect(component.fields).toEqual(fields);
    });

    it('should init data', () => {
      expect(component.data).toEqual(data);
    });

    it('should init statuses', () => {
      expect(component.statuses).toEqual(statuses);
    });
  });
});