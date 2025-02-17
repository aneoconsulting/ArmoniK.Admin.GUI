import { Injectable, inject, signal } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { ArmonikData, DataRaw, GrpcResponse } from '@app/types/data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { ManageGroupsTableDialogResult } from '@components/table/group/manage-groups-dialog/manage-groups-dialog.component';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { InvertFilterService } from '@services/invert-filter.service';
import { NotificationService } from '@services/notification.service';
import { Subject, Subscription, catchError, map, merge, of, switchMap } from 'rxjs';
import { GrpcTableService } from './grpcService';
import { Scope } from '../config';
import { Group, GroupConditions } from '../groups';

@Injectable()
/**
 * TableData services are used by index and tables components to retrieve and provide every data-related field (such as options, filter, loading, data).
 */
export abstract class AbstractTableDataService<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  abstract readonly grpcService: GrpcTableService<T, F, O, FO>;
  private readonly cacheService = inject(CacheService);
  private readonly notificationService = inject(NotificationService);
  readonly filtersService = inject(FiltersService);
  readonly invertFiltersService: InvertFilterService<F, FO> = inject(InvertFilterService);

  readonly refresh$ = new Subject<void>();

  readonly loading = signal<boolean>(false);
  readonly total = signal<number>(0);
  readonly data = signal<ArmonikData<T, O>[]>([]);
  protected dataSubscription: Subscription;

  filters: FiltersOr<F, FO> = [];
  options: ListOptions<T, O>;

  groups: Group<T, O>[] = [];
  groupsConditions: GroupConditions<F, FO>[] = [];

  abstract scope: Scope;

  constructor() {
    this.loadFromCache();
    this.subscribeToGrpcList();
  }

  /**
   * Load data from the cache on initialisation.
   */
  private loadFromCache() {
    const cachedResponse = this.cacheService.get(this.scope);
    if (cachedResponse) {
      const cachedData = this.computeGrpcData(cachedResponse);
      this.total.set(cachedResponse.total);
      if (cachedData) {
        this.handleData(cachedData);
      }
    }
  }

  /**
   * Subscribe to the refresh subject to fetch the data.
   * Handle the **loading** state.
   * Catch errors if needed.
   */
  private subscribeToGrpcList() {
    this.dataSubscription = this.refresh$.pipe(
      switchMap(() => {
        this.loading.set(true);

        const options = this.prepareOptions();
        const filters = this.prepareFilters();

        return this.grpcService.list$(options, filters)
          .pipe(
            catchError((error: GrpcStatusEvent) => {
              this.error(error, 'An error occured while fetching data');
              return of(null);
            }),
          );
      }),
      map((entries) => {
        this.total.set(entries?.total ?? 0);
        if (entries) {
          this.cacheService.save(this.scope, entries);
          return this.computeGrpcData(entries) ?? [];
        }
        return [];
      })
    ).subscribe((entries) => {
      this.handleData(entries);
    });
  }

  /**
   * Clone the options object and transform it if needed.
   */
  prepareOptions(): ListOptions<T, O> {
    return structuredClone(this.options);
  }

  /**
   * Clone the filter object, and add the inverted conditions of every groupConditions to it.
   */
  prepareFilters(): FiltersOr<F, FO> {
    let filtersOr = structuredClone(this.filters);
    this.groupsConditions.forEach((groupConditions) => {
      const inverted = this.invertFiltersService.invert(groupConditions.conditions);
      if (!this.isNotEmptyFilter(filtersOr)) {
        filtersOr.push(...inverted);
      } else {
        const result: FiltersOr<F, FO> = [];
        filtersOr.forEach((filterAnd) => {
          inverted.map((invertedAnd) => [...invertedAnd, ...filterAnd]).forEach((r) => result.push(r));
        });
        filtersOr = result;
      }
    });
    return filtersOr;
  }

  /**
   * Handle the data after it has been fetched.
   * @param entries 
   */
  handleData(entries: T[]): void {
    this.data.set(entries.map(entry => this.createNewLine(entry)));
    this.loading.set(false);
  }

  setGroup(groupName: string) {
    const groupRefresh$ = new Subject<void>();
    const group: Group<T, O> = {
      name: signal(groupName),
      opened: false,
      total: 0,
      page: 0,
      emptyCondition: false,
      refresh$: groupRefresh$,
      data: merge(this.refresh$, groupRefresh$).pipe(
        switchMap(() => {
          const options = {
            pageSize: 100,
            pageIndex: group.page,
            sort: this.options.sort
          };
          const groupConditions = this.groupsConditions.find((condition) => condition.name === group.name());
          if (groupConditions) {
            if (this.isNotEmptyFilter(groupConditions.conditions)) {
              return this.grpcService.list$(options, groupConditions.conditions);
            }
            group.emptyCondition = true;
          }
          return of(undefined);
        }),
        map((data) => {
          if (data) {
            group.total = data.total;
            return this.computeGrpcData(data);
          } else {
            group.total = 0;
            return undefined;
          }
        }),
        map((data) => {
          if (data) {
            return data.map(entry => this.createNewLine(entry));
          }
          return [];
        })
      )
    };

    this.groups.push(group);
  }

  manageGroupDialogResult(dialogResult: ManageGroupsTableDialogResult<F, FO>) {
    const editedKeys = Object.keys(dialogResult.editedGroups);
    editedKeys.forEach((key) => {
      const conditionsIndex =  this.groupsConditions.findIndex((group) => group.name === key);
      if (conditionsIndex !== -1) {
        this.groupsConditions[conditionsIndex] = dialogResult.editedGroups[key];
      }
      const groupIndex = this.groups.findIndex((group) => group.name() === key);
      if (groupIndex !== -1) {
        this.groups[groupIndex].name.set(dialogResult.editedGroups[key].name);
      }
    });
    
    dialogResult.deletedGroups.forEach((groupName) => (this.removeGroup(groupName)));

    dialogResult.addedGroups.forEach((group) => (this.addGroup(group)));

    this.refresh$.next();
  }

  initGroups() {
    this.groupsConditions.forEach((g) => this.setGroup(g.name));
  }

  private addGroup(groupCondition: GroupConditions<F, FO>) {
    this.groupsConditions.push(groupCondition);
    this.setGroup(groupCondition.name);
  }

  refreshGroup(groupName: string) {
    const group = this.groups.find((group) => group.name() === groupName);
    if (group) {
      group.refresh$.next();
    }
  }

  private removeGroup(groupName: string) {
    const conditionsIndex = this.groupsConditions.findIndex((group) => group.name === groupName);
    if (conditionsIndex !== -1) {
      this.groupsConditions.splice(conditionsIndex, 1);
    }
    const groupIndex = this.groups.findIndex((group) => group.name() === groupName);
    if (groupIndex !== -1) {
      this.groups.splice(groupIndex, 1);
    }
  }

  private isNotEmptyFilter(filters: FiltersOr<F, FO>): boolean {
    return filters.map((filterAnd) => 
      filterAnd
        .map((filter) => filter.for !== null && filter.field !== null && filter.operator !== null && filter.value !== null)
        .reduce((acc, current) => acc || current, false)
    ).reduce((acc, current) => acc || current, false);
  }

  /**
   * Display a success message to the user.
   */
  success(message: string) {
    this.notificationService.success(message);
  }

  /**
   * Display a message error in the console and show a error notification to the user.
   * @param error - GrpcStatusEvent, the logged object.
   * @param message - (Optional) The message displayed to the user. If not present, display the error statusMessage.
   */
  error(error: GrpcStatusEvent, message?: string) {
    this.notificationService.error(message ?? error.statusMessage);
    console.error(error);
  }

  /**
   * Display a warning message to the user.
   */
  warning(message: string) {
    this.notificationService.warning(message);
  }

  protected onDestroy() {
    this.dataSubscription.unsubscribe();
  }
  
  /**
   * Transform a ListGrpcResponse into a readable DataRaw array.
   */
  abstract computeGrpcData(entries: GrpcResponse): T[] | undefined;

  /**
   * Transform a DataRaw object into an ArmoniKData object.
   * @param entry 
   */
  abstract createNewLine(entry: T): ArmonikData<T, O>;
}