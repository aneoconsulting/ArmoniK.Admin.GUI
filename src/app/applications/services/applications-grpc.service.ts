import { ApplicationFilterField, ApplicationRawEnumField, ApplicationsClient, ListApplicationsRequest, ListApplicationsResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcTableService, ListApplicationSortField, RequestFilterField } from '@app/types/services/grpcService';
import { FilterField, buildStringFilter } from '@services/grpc-build-request.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationRawFieldKey, ApplicationRawFilters, ApplicationRawListOptions } from '../types';

@Injectable()
export class ApplicationsGrpcService extends GrpcTableService<ApplicationRawFieldKey, ApplicationRawListOptions, ApplicationRawEnumField> {
  readonly filterService = inject(ApplicationsFiltersService);
  readonly grpcClient = inject(ApplicationsClient);

  readonly sortFields: Record<ApplicationRawFieldKey, ApplicationRawEnumField> = {
    'name': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
    'namespace': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
    'service': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
    'version': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
  };

  list$(options: ApplicationRawListOptions, filters: ApplicationRawFilters): Observable<ListApplicationsResponse> {
    const request = new ListApplicationsRequest(this.createListRequest(options, filters) as ListApplicationsRequest);
    return this.grpcClient.listApplications(request);
  }

  createSortField(field: ApplicationRawFieldKey): ListApplicationSortField {
    if (field === 'name') {
      return {
        fields: [
          {
            applicationField: {
              field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
            }
          },
          {
            applicationField: {
              field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION
            }
          }
        ]
      };
    } else if (this.sortFields[field]) {
      return {
        fields: [{
          applicationField: {
            field: this.sortFields[field]
          }
        }]
      };
    } else {
      return this.createSortField('name');
    }
  }

  createFilterField(field: ApplicationRawEnumField): FilterField {
    return {
      applicationField: {
        field
      }
    };
  }

  buildFilter(type: FilterType, filterField: FilterField, filter: Filter<ApplicationRawEnumField, null>): RequestFilterField {
    switch (type) {
    case 'string':
      return buildStringFilter(filterField, filter) as ApplicationFilterField.AsObject;
    default: {
      throw new Error(`Type ${type} not supported`);
    }
    }
  }
}
