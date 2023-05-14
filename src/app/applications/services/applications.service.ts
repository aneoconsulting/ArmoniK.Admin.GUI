import { ApplicationRaw, ApplicationsClient, ListApplicationsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { TableService } from '@services/table.service';
// Create a "packages" (aliases) for types
import { ApplicationColumn, Filter, FilterField, ListApplicationsOptions } from '@app/applications/types';


/**
 * Applications service used to manage the applications table.
 */
@Injectable()
export class ApplicationsService {
  private _tableName = 'applications';
  private _defaultColumn: ApplicationColumn[] = ['name', 'version', 'actions'];
  private _defaultIntervalValue = 10;
  private _defaultOptions: ListApplicationsOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    },
    filters: {
      name: null,
      namespace: null,
      service: null,
      version: null
    }
  };
  private _defaultFilters: Filter[] = [];

  public readonly filtersFields: FilterField[] = [
    'name',
    'namespace',
    'service',
    'version'
  ];

  public readonly availableColumns: ApplicationColumn[] = ['name', 'namespace', 'service', 'version', 'actions'];

  public readonly sortDirections: Record<SortDirection, ListApplicationsRequest.OrderDirection> = {
    'asc': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
    'desc': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
    '': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC
  };

  public readonly sortFields: Record<ApplicationColumn, ListApplicationsRequest.OrderByField> = {
    'name': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
    'namespace': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
    'service': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_SERVICE,
    'version': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_VERSION,
    'actions': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED
  };

  constructor(private _applicationsClient: ApplicationsClient, private _tableService: TableService) {}

  generateSharableURL(options: ListApplicationsOptions) {
    // TODO: Use the URL service
    return '/applications?sort=' + options.sort.active + '&order=' + options.sort.direction + '&pageIndex=' + options.pageIndex + '&pageSize=' + options.pageSize;
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number) {
    this._tableService.saveIntervalValue(this._tableName, value);
  }

  restoreIntervalValue() {
    return this._tableService.restoreIntervalValue(this._tableName) ?? this._defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: ListApplicationsOptions) {
    this._tableService.saveOptions(this._tableName, options);
  }

  restoreOptions(): ListApplicationsOptions {
    const options = this._tableService.restoreOptions<ApplicationRaw>(this._tableName, this._defaultOptions);

    return options as any;
  }

  /**
   * Columns
   */

  restoreColumns(): ApplicationColumn[] {
    return this._tableService.restoreColumns<ApplicationColumn[]>(this._tableName) ?? this._defaultColumn;
  }

  saveColumns(columns: ApplicationColumn[]) {
    this._tableService.saveColumns(this._tableName, columns);
  }

  resetColumns() {
    this._tableService.resetColumns(this._tableName);

    return this._defaultColumn;
  }

  /**
   * Filters
   */

  restoreFilters() {
    // TODO: use the URL to restore the filters
    return this._tableService.restoreFilters<Filter[]>(this._tableName) ?? this._defaultFilters;
  }

  saveFilters(filters: Filter[]) {
    this._tableService.saveFilters(this._tableName, filters);
  }

  resetFilters() {
    this._tableService.resetFilters(this._tableName);

    return this._defaultFilters;
  }

  /**
   * gRPC
   */

  list(options: ListApplicationsOptions) {
    const listApplicationsRequest = new ListApplicationsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        fields: [
          this.sortFields[options.sort.active] ?? ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME
        ]
      },
      filter: {
        name: options.filters?.name ?? '',
        namespace: options.filters?.namespace ?? '',
        service: options.filters?.service ?? '',
        version: options.filters?.version ?? '',
      }
    });

    return this._applicationsClient.listApplications(listApplicationsRequest);
  }
}
