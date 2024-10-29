import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { ArmonikData, DataRaw, GrpcResponse } from '@app/types/data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import { GrpcTableService } from './grpcService';
import { Scope } from '../config';

@Injectable()
/**
 * TableData services are used by index and tables components to retrieve and provide every data-related field (such as options, filter, loading, data).
 */
export abstract class AbstractTableDataService<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  abstract readonly grpcService: GrpcTableService<T, F, O, FO>;
  private readonly cacheService = inject(CacheService);
  private readonly notificationService = inject(NotificationService);
  readonly filtersService = inject(FiltersService);

  readonly refresh$ = new Subject<void>();

  private readonly _loading = signal<boolean>(false);
  private readonly _data: WritableSignal<ArmonikData<T, O>[]> = signal([]);
  private readonly _total = signal<number>(0);

  filters: FiltersOr<F, FO> = [];
  options: ListOptions<T, O>;

  abstract scope: Scope;

  protected set data(entries: T[]) {
    this._data.set(entries.map(entry => this.createNewLine(entry)));
  }

  protected set loading(value: boolean) {
    this._loading.set(value);
  }

  /**
   * Handle the loading state of the table.
   */
  get loading(): boolean {
    return this._loading();
  }

  /**
   * The current loaded data.
   */
  get data(): ArmonikData<T, O>[] {
    return this._data();
  }

  /**
   * Total number of this data stored in the database.
   */
  get total(): number {
    return this._total();
  }

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
      this._total.set(cachedResponse.total);
      if (cachedData) {
        this.data = cachedData;
      }
    }
  }

  /**
   * Subscribe to the refresh subject to fetch the data.
   * Handle the **loading** state.
   * Catch errors if needed.
   */
  private subscribeToGrpcList() {
    this.refresh$.pipe(
      switchMap(() => {
        this._loading.set(true);

        const options = this.prepareOptions();
        const filters = this.preparefilters();

        return this.grpcService.list$(options, filters)
          .pipe(
            catchError((error: GrpcStatusEvent) => {
              this.error(error, 'An error occured while fetching data');
              return of(null);
            }),
          );
      }),
      map((entries) => {
        this._total.set(entries?.total ?? 0);
        if (entries) {
          this.cacheService.save(this.scope, entries);
          return this.computeGrpcData(entries) ?? [];
        }
        return [];
      })
    ).subscribe((entries) => {
      this.handleData(entries);
      this._loading.set(false);
    });
  }

  /**
   * Clone the options object and transform it if needed.
   */
  prepareOptions(): ListOptions<T, O> {
    return structuredClone(this.options);
  }

  /**
   * Clone the filter object and transform it if needed.
   */
  preparefilters(): FiltersOr<F, FO> {
    return structuredClone(this.filters);
  }

  /**
   * Handle the data after it has been fetched.
   * @param entries 
   */
  handleData(entries: T[]): void {
    this.data = entries;
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