import { ApplicationFilterField, ApplicationRawEnumField, ApplicationsClient, ListApplicationsRequest, ListApplicationsResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcListInterface } from '@app/types/services/grpcService';
import { buildStringFilter, sortDirections } from '@services/grpc-build-request.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationRawFieldKey, ApplicationRawFilters, ApplicationRawListOptions } from '../types';

@Injectable()
export class ApplicationsGrpcService implements GrpcListInterface<ApplicationsClient, ApplicationRawListOptions, ApplicationRawFilters, ApplicationRawFieldKey, ApplicationRawEnumField> {
  readonly filterService = inject(ApplicationsFiltersService);
  readonly grpcClient = inject(ApplicationsClient);
  readonly utilsService = inject(UtilsService<ApplicationRawEnumField>);

  readonly sortFields: Record<ApplicationRawFieldKey, ApplicationRawEnumField> = {
    'name': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
    'namespace': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
    'service': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
    'version': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
  };

  list$(options: ApplicationRawListOptions, filters: ApplicationRawFilters): Observable<ListApplicationsResponse> {

    const requestFilters = this.utilsService.createFilters<ApplicationFilterField.AsObject>(filters, this.filterService.filtersDefinitions, this.#buildFilterField);

    const request = new ListApplicationsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: sortDirections[options.sort.direction],
        fields: [{
          applicationField: {
            field: this.sortFields[options.sort.active]
          }
        }]
      },
      filters: requestFilters
    });

    return this.grpcClient.listApplications(request);
  }

  #buildFilterField(filter: Filter<ApplicationRawEnumField>) {
    return (type: FilterType, field: ApplicationRawEnumField) => {

      const filterField = {
        applicationField: {
          field: field as ApplicationRawEnumField
        }
      } satisfies ApplicationFilterField.AsObject['field'];

      switch (type) {
      case 'string':
        return buildStringFilter(filterField, filter) as ApplicationFilterField.AsObject;
      default: {
        throw new Error(`Type ${type} not supported`);
      }
      }
    };
  }
}
