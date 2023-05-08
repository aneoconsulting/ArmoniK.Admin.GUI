import { ApplicationsClient, ListApplicationsRequest } from "@aneoconsultingfr/armonik.api.angular";
import { Injectable } from "@angular/core";
import { TableService } from "./table.service";
import { ApplicationColumn, Filter, ListApplicationsOptions } from "../types";
import { SortDirection } from "@angular/material/sort";


/**
 * Applications service used to manage the applications table.
 */
@Injectable()
// TODO: Create an interface to implement
export class ApplicationsService {
  private _tableName = 'applications';
  private _defaultColumn: ApplicationColumn[] = ['name', 'version'];
  private _defaultOptions: ListApplicationsOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    }
  }
  private _defaultFilters: Filter[] = [];

  public readonly availableColumns: ApplicationColumn[] = ['name', 'namespace', 'service', 'version'];

  public readonly sortDirections: Record<SortDirection, ListApplicationsRequest.OrderDirection> = {
    'asc': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
    'desc': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
    '': ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC
  }

  public readonly sortFields: Record<ApplicationColumn, ListApplicationsRequest.OrderByField> = {
    'name': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
    'namespace': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
    'service': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_SERVICE,
    'version': ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_VERSION,
  }

  constructor(private _applicationsClient: ApplicationsClient, private _tableService: TableService) {}

  generateSharableURL(options: ListApplicationsOptions) {
    // TODO: Use the URL service
    return "/applications?sort=" + options.sort.active + "&order=" + options.sort.direction + "&pageIndex=" + options.pageIndex + "&pageSize=" + options.pageSize;
  }

  /**
   * Options
   */

  saveOptions(options: ListApplicationsOptions) {
    this._tableService.saveOptions(this._tableName, options);
  }

  restoreOptions(): ListApplicationsOptions {
    const options = this._tableService.restoreOptions<ApplicationColumn>(this._tableName, this._defaultOptions);

    if (!options) {
      return this._defaultOptions;
    }

    return options;
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

  /**
   * Filters
   */

  restoreFilters() {
    return this._tableService.restoreFilters<Filter[]>(this._tableName) ?? this._defaultFilters;
  }

  saveFilters(filters: Filter[]) {
    this._tableService.saveFilters(this._tableName, filters);
  }

  /**
   * gRPC
   */

  listApplications(options: ListApplicationsOptions) {
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
        name: '',
        namespace: '',
        service: '',
        version: '',
      }
    });

    return this._applicationsClient.listApplications(listApplicationsRequest);
  }
}
