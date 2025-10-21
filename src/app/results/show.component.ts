import { GetResultResponse, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AppShowComponent } from '@app/types/components/show';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { ShowPageComponent } from '@components/show-page.component';
import { DefaultConfigService } from '@services/default-config.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsInspectionService } from './services/results-inspection.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  templateUrl: 'show.component.html',
  styleUrl: '../../inspections.scss',
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    ResultsGrpcService,
    TableService,
    TableStorageService,
    TableURLService,
    ResultsFiltersService,
    NotificationService,
    MatSnackBar,
    ResultsInspectionService,
    DefaultConfigService,
    StorageService,
    {
      provide: StatusService,
      useClass: ResultsStatusesService
    }
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<ResultRaw, GetResultResponse> implements OnInit, OnDestroy {
  readonly grpcService = inject(ResultsGrpcService);
  readonly inspectionService = inject(ResultsInspectionService);

  private readonly resultsStatusesService = inject(StatusService) as ResultsStatusesService;

  private _status: StatusLabelColor | undefined;

  set status(status: ResultStatus | undefined) {
    this._status = status ? this.statuses[status] : undefined;
  }

  get status(): StatusLabelColor | undefined {
    return this._status;
  }

  get statuses() {
    return this.resultsStatusesService.statuses;
  }

  ngOnInit(): void {
    this.initInspection();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetResultResponse): ResultRaw | undefined {
    console.log('data.result : ', data.result);
    return data.result;
  }

  afterDataFetching(): void {
    this.status = this.data()?.status;
  }

  downloadResult(resultId: string | undefined, data: any): void {
    const fileName = resultId + '_result.json';
    if (!data) return;
    const json = JSON.stringify(this.toPlainDeep(data), null, 2);
    this.downloadAs(json, fileName, 'application/json');
  }

  downloadAs(content: string, filename: string, mime: string): void {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  toPlainDeep(obj: any, seen = new WeakSet()): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (seen.has(obj)) return '[circular]';
    seen.add(obj);
  
    if (typeof obj.toJSON === 'function') return obj.toJSON();
    if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
    if (obj instanceof Date) return obj.toISOString();

    if (obj.seconds !== undefined && typeof obj.seconds === 'number') {
      const ms = obj.seconds * 1000 + Math.floor((obj.nanoseconds || 0) / 1e6);
      return new Date(ms).toISOString();
    }

    if (obj instanceof Uint8Array) return Array.from(obj);
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) return obj.data;

    if (obj instanceof Map) return Object.fromEntries([...obj.entries()].map(([k, v]) => [k, this.toPlainDeep(v, seen)]));
    if (obj instanceof Set) return [...obj].map(v => this.toPlainDeep(v, seen));

    if (Array.isArray(obj)) return obj.map(v => this.toPlainDeep(v, seen));

    const out: any = {};
    for (const key of Reflect.ownKeys(obj)) {
      try {
        out[key as any] = this.toPlainDeep((obj as any)[key as any], seen);
      } catch {
      }
    }
    return out;
  }

}
