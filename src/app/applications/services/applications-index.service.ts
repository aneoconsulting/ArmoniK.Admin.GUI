import { Injectable, inject } from '@angular/core';
import { TableColumn } from '@app/types/column.type';
import { IndexServiceInterface } from '@app/types/services/indexService';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawListOptions } from '../types';

@Injectable()
// export class ApplicationsIndexService implements AppIndexService<ApplicationRaw> {
export class ApplicationsIndexService implements IndexServiceInterface<ApplicationRawColumnKey, ApplicationRawListOptions> {
  readonly tableService = inject(TableService);
  readonly defaultConfigService = inject(DefaultConfigService);

  readonly defaultColumns = this.defaultConfigService.defaultApplications.columns;
  readonly defaultOptions: ApplicationRawListOptions = this.defaultConfigService.defaultApplications.options;
  readonly defaultIntervalValue = this.defaultConfigService.defaultApplications.interval;
  readonly defaultLockColumns = this.defaultConfigService.defaultApplications.lockColumns;

  readonly availableTableColumns: TableColumn<ApplicationRawColumnKey>[] = [
    {
      name: $localize`Name`,
      key: 'name',
      sortable: true,
    },
    {
      name: $localize`Namespace`,
      key: 'namespace',
      sortable: true,
    },
    {
      name: $localize`Service`,
      key: 'service',
      sortable: true,
    },
    {
      name: $localize`Version`,
      key: 'version',
      sortable: true,
    },
    {
      name: $localize`Tasks by Status`,
      key: 'count',
      type: 'count',
      sortable: false
    },
    {
      name: $localize`Actions`,
      key: 'actions',
      type: 'actions',
      sortable: false
    }
  ];

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.tableService.saveIntervalValue('applications-interval', value);
  }

  restoreIntervalValue(): number {
    return this.tableService.restoreIntervalValue('applications-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.tableService.saveLockColumns('applications-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.tableService.restoreLockColumns('applications-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: ApplicationRawListOptions): void {
    this.tableService.saveOptions('applications-options', options);
  }

  restoreOptions(): ApplicationRawListOptions {
    const options = this.tableService.restoreOptions<ApplicationRaw>('applications-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ApplicationRawColumnKey[]): void {
    this.tableService.saveColumns('applications-columns', columns);
  }

  restoreColumns(): ApplicationRawColumnKey[] {
    return this.tableService.restoreColumns<ApplicationRawColumnKey[]>('applications-columns') ?? this.defaultColumns;
  }

  resetColumns(): ApplicationRawColumnKey[] {
    this.tableService.resetColumns('applications-columns');

    return Array.from(this.defaultColumns);
  }
}
