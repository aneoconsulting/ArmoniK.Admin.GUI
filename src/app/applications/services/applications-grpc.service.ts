import { ApplicationField, ApplicationFilterField, ApplicationRawEnumField, ApplicationsClient, SortDirection as ArmoniKSortDirection, FilterStringOperator, ListApplicationsRequest, ListApplicationsResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { UtilsService } from '@services/utils.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationRawFieldKey, ApplicationRawFilter, ApplicationRawListOptions } from '../types';

@Injectable()
export class ApplicationsGrpcService {
  readonly #applicationsFiltersService = inject(ApplicationsFiltersService);
  readonly #applicationsClient = inject(ApplicationsClient);
  readonly #utilsService = inject(UtilsService<ApplicationRawEnumField>);

  readonly sortDirections: Record<SortDirection, ArmoniKSortDirection> = {
    'asc': ArmoniKSortDirection.SORT_DIRECTION_ASC,
    'desc': ArmoniKSortDirection.SORT_DIRECTION_DESC,
    '': ArmoniKSortDirection.SORT_DIRECTION_UNSPECIFIED
  };

  readonly sortFields: Record<ApplicationRawFieldKey, ApplicationRawEnumField> = {
    'name': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
    'namespace': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
    'service': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
    'version': ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
  };

  list$(options: ApplicationRawListOptions, filters: ApplicationRawFilter): Observable<ListApplicationsResponse> {

    const requestFilters = this.#utilsService.createFilters<ApplicationFilterField.AsObject>(filters, this.#applicationsFiltersService.retrieveFiltersDefinitions(), this.#buildFilterField);

    const request = new ListApplicationsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        fields: this.#getSortFieldsArray(this.sortFields[options.sort.active])
      },
      filters: requestFilters
    });

    return this.#applicationsClient.listApplications(request);
  }

  get$(): Observable<never> {
    throw new Error('This method must never be called.');
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
        return {
          field: filterField,
          filterString: {
            value: filter.value?.toString() ?? '',
            operator: filter.operator ?? FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
          }
        } satisfies ApplicationFilterField.AsObject;
      default: {
        throw new Error(`Type ${type} not supported`);
      }
      }
    };
  }

  #getSortFieldsArray(field: ApplicationRawEnumField): ApplicationField.AsObject[] {
    switch (field) {
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME:
      return [
        {
          applicationField: {
            field: field
          }
        },
        {
          applicationField: {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION
          }
        }
      ];
    default:
      return [{
        applicationField: {
          field: field
        }
      }];
    }
  }
}
