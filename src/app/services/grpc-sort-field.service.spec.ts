import { SessionField, SessionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { ListOptionsSort } from '@app/types/options';
import { GrpcSortFieldService } from './grpc-sort-field.service';

function buildField(sortOptions: ListOptionsSort<SessionRaw & TaskOptions>): SessionField.AsObject {
  return {
    sessionRawField: {
      field: sortOptions.active === 'sessionId' ? SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID : SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS
    }
  };
}

describe('GrpcSortFieldService', () => {
  const service = new GrpcSortFieldService();

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildSortField', () => {
    it('should return taskOptionGenericField if data is sorted via a custom field', () => {
      const sort = {
        active: 'options.options.customField',
        direction: 'asc'
      } as unknown as ListOptionsSort<SessionRaw>;
      const result = service.buildSortField<SessionRaw, SessionField.AsObject>(sort, () => {return {} as SessionField.AsObject;});
      expect(result).toEqual({
        taskOptionGenericField: {
          field: 'customField'
        }
      });
    });

    it('should return taskOptionField if data is sorted via a task option field', () => {
      const sort = {
        active: 'options.applicationName',
        direction: 'asc'
      } as unknown as ListOptionsSort<SessionRaw>;
      const result = service.buildSortField<SessionRaw, SessionField.AsObject>(sort, () => {return {} as SessionField.AsObject;});
      expect(result).toEqual({
        taskOptionField: {
          field: 5
        }
      });
    });

    it('should return the result of the buildField function if data is sorted via a basic field', () => {
      const sort = {
        active: 'sessionId',
        direction: 'asc'
      } as unknown as ListOptionsSort<SessionRaw>;
      expect(service.buildSortField<SessionRaw, SessionField.AsObject>(sort, buildField)).toEqual({
        sessionRawField: {
          field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID
        }
      });
    });
  });
});