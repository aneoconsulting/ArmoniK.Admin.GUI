import { TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { SessionRawFieldKey } from '@app/sessions/types';
import { TaskOptionsFieldKey } from '@app/tasks/types';
import { GrpcSortFieldService } from './grpc-sort-field.service';

describe('GrpcSortFieldService', () => {
  const service = new GrpcSortFieldService();
  const mockFunction = jest.fn();

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildSortField', () => {
    it('should return taskOptionGenericField if data is sorted via a custom field', () => {
      const field = 'options.options.customField' as SessionRawFieldKey;
      const result = service.buildSortField(field, mockFunction);
      expect(result).toEqual({
        taskOptionGenericField: {
          field: 'customField'
        }
      });
    });

    it('should return taskOptionField if data is sorted via a task option field', () => {
      const field: TaskOptionsFieldKey = 'applicationName';
      const result = service.buildSortField(field, mockFunction);
      expect(result).toEqual({
        taskOptionField: {
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME
        }
      });
    });

    it('should return the result of the buildField function if data is sorted via a basic field', () => {
      const field: SessionRawFieldKey = 'createdAt';
      service.buildSortField(field, mockFunction);
      expect(mockFunction).toHaveBeenCalled();
    });

    it('should handle null values', () => {
      const field = null as unknown as SessionRawFieldKey;
      service.buildSortField(field, mockFunction);
      expect(mockFunction).toHaveBeenCalled();
    });
  });
});