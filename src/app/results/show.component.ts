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
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsInspectionService } from './services/results-inspection.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';
 
interface ResultChunk {
  _dataChunk?: Uint8Array;
  dataChunk?: Uint8Array;
}
 
@Component({
  selector: 'app-result-show',
  templateUrl: 'show.component.html',
  styleUrls: ['../../inspections.scss'],
  standalone: true,
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
      useClass: ResultsStatusesService,
    },
  ],
  imports: [ShowPageComponent, MatIconModule, MatButtonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowComponent
  extends AppShowComponent<ResultRaw, GetResultResponse>
  implements OnInit, OnDestroy
{
  readonly resultsNotificationService = inject(NotificationService);
  readonly grpcService = inject(ResultsGrpcService);
  readonly inspectionService = inject(ResultsInspectionService);
  private readonly resultsStatusesService = inject(StatusService) as ResultsStatusesService;
  private readonly userService = inject(UserService);

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

  get hasDownloadPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:DownloadResultData');
  }

  ngOnInit(): void {
    this.initInspection();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetResultResponse): ResultRaw | undefined {
    return data.result;
  }
 
  afterDataFetching(): void {
    this.status = this.data()?.status;
  }
 
  downloadResult(resultId?: string): boolean {
    if (!resultId) {
      console.error('[downloadResult] No resultId provided');
      return false;
    }
    const chunks: Uint8Array[] = [];
    this.grpcService.downloadResultData$(resultId).subscribe({
      next: (chunk: ResultChunk | Uint8Array) => {
        const data: Uint8Array | undefined =
          chunk instanceof Uint8Array
            ? chunk
            : chunk?._dataChunk ?? chunk?.dataChunk;
 
        if (!data) {
          console.warn('[downloadResult] Chunk not a Uint8Array:', chunk);
          return;
        }
        chunks.push(data);
      },
      error: (err: Error) => {
        console.error('[downloadResult] download error:', err);
        this.resultsNotificationService.warning('Result Not Found');
      },
      complete: () => {
        if (!chunks.length) {
          console.warn('[downloadResult] No chunks received');
          return;
        }
 
        const total = chunks.reduce((n, c) => n + c.byteLength, 0);
        const merged = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) {
          merged.set(c, offset);
          offset += c.byteLength;
        }
 
        const fileName = `${resultId}.bin`;
        this.downloadAs(merged, fileName, 'application/octet-stream');
      },
    });
 
    return true;
  }
 
  downloadAs(
    content: BlobPart | BlobPart[],
    filename: string,
    mime: 'application/json' | 'text/plain' | 'application/octet-stream'
  ): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
 
    const parts = Array.isArray(content) ? content : [content];
    const blob = new Blob(parts, { type: mime });

    const url = URL.createObjectURL(blob);
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
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }
}