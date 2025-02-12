import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { TaskOptions, TaskRaw } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { Status } from '@app/types/status';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { FieldContentComponent } from './field-content.component';

describe('FieldContentComponent', () => {
  let component: FieldContentComponent<TaskRaw, TaskStatus, TaskOptions>;

  const mockNotificationService = {
    success: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn(),
  };

  const statuses = {
    [TaskStatus.TASK_STATUS_COMPLETED]: 'Completed',
    [TaskStatus.TASK_STATUS_CANCELLING]: 'Cancelling',
  } as Record<Status, string>;

  const data: TaskRaw = {
    id: 'taskId',
    status: TaskStatus.TASK_STATUS_CANCELLING,
    createdAt: {
      seconds: '13343490',
      nanos: 0
    },
    creationToEndDuration: {
      seconds: '1230',
      nanos: 0
    },
    parentTaskIds: [],
    options: {
      applicationName: 'string',
    }
  } as unknown as TaskRaw;

  const field: Field<TaskRaw> = {
    key: 'id',
  };

  const statusField: Field<TaskRaw> = {
    key: 'status',
    type: 'status',
  };

  const dateField: Field<TaskRaw> = {
    key: 'createdAt',
    type: 'date',
  };

  const emptyDateField: Field<TaskRaw> = {
    key: 'acquiredAt',
    type: 'date'
  };

  const durationField: Field<TaskRaw> = {
    key: 'creationToEndDuration',
    type: 'duration',
  };

  const objectField: Field<TaskRaw> = {
    key: 'options',
    type: 'object'
  };

  const arrayField: Field<TaskRaw> = { 
    key: 'parentTaskIds'
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipboard },
        IconsService,
        FieldContentComponent
      ]
    }).inject(FieldContentComponent<TaskRaw, TaskStatus, TaskOptions>);
    component.statuses = statuses;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('Basics', () => {
    beforeEach(() => {
      component.field = field;
      component.data = data;
    });

    it('should get the value', () => {
      expect(component.value).toEqual(data.id);
    });

    it('should get the key', () => {
      expect(component.key).toEqual(field.key);
    });

    it('should copy the raw value', () => {
      component.copy();
      expect(mockClipboard.copy).toHaveBeenCalledWith(data.id);
    });

    it('should notify on copy', () => {
      component.copy();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('Statuses', () => {
    beforeEach(() => {
      component.field = statusField;
      component.data = data;
    });

    it('should get the status', () => {
      expect(component.value).toEqual(statuses[data.status]);
    });

    it('should get the key', () => {
      expect(component.key).toEqual(statusField.key);
    });

    it('should copy the status', () => {
      component.copy();
      expect(mockClipboard.copy).toHaveBeenCalledWith(statuses[data.status]);
    });

    it('should notify on copy', () => {
      component.copy();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('Dates', () => {
    beforeEach(() => {
      component.field = dateField;
      component.data = data;
    });

    it('should get the value as a date', () => {
      expect(component.date).toEqual((new Timestamp(data.createdAt)).toDate());
    });

    it('should get the key', () => {
      expect(component.key).toEqual(dateField.key);
    });

    it('should copy the date', () => {
      component.copy();
      expect(mockClipboard.copy).toHaveBeenCalledWith((new Timestamp(data.createdAt)).toDate().toLocaleString());
    });

    it('should notify on copy', () => {
      component.copy();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should set undefined is the date is undefined too', () => {
      component.field = emptyDateField;
      component.data = data;
      expect(component.date).toBeUndefined();
    });
  });

  describe('Durations', () => {
    beforeEach(() => {
      component.field = durationField;
      component.data = data;
    });

    it('should get the value as a duration', () => {
      expect(component.value).toEqual(data.creationToEndDuration);
    });

    it('should get the key', () => {
      expect(component.key).toEqual(durationField.key);
    });

    it('should copy the duration', () => {
      component.copy();
      const durationPipe = new DurationPipe();
      expect(mockClipboard.copy).toHaveBeenCalledWith(durationPipe.transform(data.creationToEndDuration as Duration));
    });

    it('should notify on copy', () => {
      component.copy();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should not copy if there is no duration', () => {
      component.data = {} as TaskRaw;
      component.copy();
      expect(mockClipboard.copy).not.toHaveBeenCalled();
    });
  });

  describe('Objects', () => {
    beforeEach(() => {
      component.field = objectField;
      component.data = data;
    });

    it('should get the value as an object', () => {
      expect(component.object).toEqual(data.options);
    });

    it('should get the key', () => {
      expect(component.key).toEqual(objectField.key);
    });
  });

  describe('guessType', () => {
    it('should guess a date', () => {
      component.field = { key: 'acquiredAt' };
      expect(component.type).toEqual('date');
    });

    it('should guess a duration', () => {
      component.field = { key: 'creationToEndDuration' };
      expect(component.type).toEqual('duration');
    });

    it('should guess an object with "options"', () => {
      component.field = { key: 'options' };
      expect(component.type).toEqual('object');
    });

    it('should guess an object with "options.options"', () => {
      component.field = { key: 'options' };
      expect(component.type).toEqual('object');
    });

    it('should return raw if it cannot guess anything', () => {
      component.field = { key: 'id' };
      expect(component.type).toEqual('raw');
    });
  });

  describe('array', () => {
    beforeEach(() => {
      component.field = arrayField;
      component.data = data;
    });

    it('should set the type to "array" in case of an array', () => {
      expect(component.type).toEqual('array');
    });

    it('should get the array', () => {
      expect(component.array).toEqual(data.parentTaskIds);
    });
  });
});