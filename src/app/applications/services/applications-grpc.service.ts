import { ApplicationsClient, ListApplicationsRequest, ListApplicationsResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AppGrpcService } from '@app/types/services';
import { UtilsService } from '@services/utils.service';
import { ApplicationRaw, ApplicationRawFieldKey, ApplicationRawFilter, ApplicationRawListOptions } from '../types';

@Injectable()
export class ApplicationsGrpcService implements AppGrpcService<ApplicationRaw> {
  readonly sortDirections: Record<SortDirection, ListApplicationsRequest.OrderDirection> = {
    'asc': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
    'desc': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
    '': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC
  };

  readonly sortFields: Record<ApplicationRawFieldKey, ListApplicationsRequest.OrderByField> = {
    'name': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
    'namespace': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
    'service': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_SERVICE,
    'version': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_VERSION,
  };

  constructor(
    private _applicationsClient: ApplicationsClient,
    private _utilsService: UtilsService<ApplicationRaw>
  ) {}

  list$(options: ApplicationRawListOptions, filters: ApplicationRawFilter[]): Observable<ListApplicationsResponse> {
    const findFilter = this._utilsService.findFilter;
    const convertFilterValue = this._utilsService.convertFilterValue;

    const listPartitionsRequest = new ListApplicationsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        fields: [this.sortFields[options.sort.active], ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME, ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_VERSION]
      },
      filter: {
        name: convertFilterValue(findFilter(filters, 'name')),
        namespace: convertFilterValue(findFilter(filters, 'namespace')),
        service: convertFilterValue(findFilter(filters, 'service')),
        version: convertFilterValue(findFilter(filters, 'version'))
      }
    });

    return this._applicationsClient.listApplications(listPartitionsRequest);
  }

  get$(): Observable<never> {
    // TODO: Waiting for ArmoniK.Api.Angular
    // @see https://github.com/aneoconsulting/ArmoniK.Api/pull/256/files
    throw new Error('Method not implemented.');
    // const getPartitionRequest = new GetPartitionRequest({
    //   id
    // });

    // return this._applicationsClient.(getPartitionRequest);
  }
}
