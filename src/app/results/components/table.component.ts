import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { NotificationService } from '@services/notification.service';
import { UserService } from '@services/user.service';
import { Subject } from 'rxjs';
import ResultsDataService from '../services/results-data.service';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw } from '../types';

interface ResultChunk {
  _dataChunk?: Uint8Array;
  dataChunk?: Uint8Array;
}

@Component({
  selector: 'app-results-table',
  templateUrl: './table.component.html',
  providers: [
    ResultsGrpcService,
    ResultsStatusesService,
    NotificationService,
  ],
  imports: [
    TableComponent,
  ]
})
export class ResultsTableComponent extends AbstractTableComponent<ResultRaw, ResultRawEnumField> implements OnInit {
  readonly tableDataService = inject(ResultsDataService);
  readonly statusesService: ResultsStatusesService = inject(StatusService);
  readonly grpcService = inject(ResultsGrpcService);
  readonly resultsNotificationService = inject(NotificationService);
  private readonly userService = inject(UserService);

  downloadResult$ = new Subject<ArmonikData<ResultRaw>>();
  downloadResultSubscription = this.downloadResult$.subscribe(data => this.onDownload(data.raw.resultId));

  deleteResultData$ = new Subject<ArmonikData<ResultRaw>>();
  deleteResultDataSubscription = this.deleteResultData$.subscribe(data => this.onDeleteResultData(data.raw.resultId));

  getServiceConfiguration$ = new Subject<ArmonikData<ResultRaw>>();
  getServiceConfigurationSubscription = this.getServiceConfiguration$.subscribe(data => this.onGetServiceConfiguration(data.raw.resultId));

  uploadResultData$ = new Subject<ArmonikData<ResultRaw>>();
  uploadResultDataSubscription = this.uploadResultData$.subscribe(data => this.onUploadResultData(data.raw.resultId));

  getResult$ = new Subject<ArmonikData<ResultRaw>>();
  getResultSubscription = this.getResult$.subscribe(data => this.onGetResult(data.raw.resultId));

  importResultsData$ = new Subject<ArmonikData<ResultRaw>>();
  importResultsDataSubscription = this.importResultsData$.subscribe(data => this.onImportResultsData(data.raw.resultId));

  actions: ActionTable<ResultRaw>[] = [
    {
      label: 'Download result data',
      icon: 'download',
      action$: this.downloadResult$,
      condition: () => {
        const permissions = this.userService.user?.permissions ?? [];
        return permissions.includes('Results:DownloadResultData');
      },
    },
    {
      label: 'Delete result data',
      icon: 'delete',
      action$: this.deleteResultData$,
      condition: () => {
        const permissions = this.userService.user?.permissions ?? [];
        return permissions.includes('Results:DeleteResultsData');
      },
    },
    {
      label: 'Get service configuration',
      icon: 'settings',
      action$: this.getServiceConfiguration$,
      condition: () => {
        const permissions = this.userService.user?.permissions ?? [];
        return permissions.includes('Results:GetServiceConfiguration');
      },
    },
    {
      label: 'Upload result data',
      icon: 'upload',
      action$: this.uploadResultData$,
      condition: () => {
        const permissions = this.userService.user?.permissions ?? [];
        return permissions.includes('Results:UploadResultData');
      },
    },
    {
      label: 'Get result',
      icon: 'visibility',
      action$: this.getResult$,
      condition: () => {
        const permissions = this.userService.user?.permissions ?? [];
        return permissions.includes('Results:GetResult');
      },
    },
    {
      label: 'Import results data',
      icon: 'file_download',
      action$: this.importResultsData$,
      condition: () => {
        const permissions = this.userService.user?.permissions ?? [];
        return permissions.includes('Results:ImportResultsData');
      },
    },
  ];

  ngOnInit(): void {
    this.initTableDataService();
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
  }

  hasDownloadPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:DownloadResultData');
  }

  hasCreateMetaDataPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:CreateResultsMetaData');
  }

  hasCreateResultsPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:CreateResults');
  }

  hasDeleteResultsDataPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:DeleteResultsData');
  }

  hasGetServiceConfigurationPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:GetServiceConfiguration');
  }

  hasUploadResultDataPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:UploadResultData');
  }

  hasGetResultPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:GetResult');
  }

  hasImportResultsDataPermission(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    return permissions.includes('Results:ImportResultsData');
  }

  onDownload(resultId: string): boolean {
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

  onDeleteResultData(resultId: string): void {
    if (!resultId) {
      console.error('[deleteResultData] No resultId provided');
      return;
    }
    this.resultsNotificationService.success('Result data deletion requested for: ' + resultId);
    console.log('Delete result data requested for:', resultId);
  }

  onGetServiceConfiguration(resultId: string): void {
    if (!resultId) {
      console.error('[getServiceConfiguration] No resultId provided');
      return;
    }
    this.resultsNotificationService.success('Service configuration requested for result: ' + resultId);
    console.log('Get service configuration requested for result:', resultId);
  }

  onUploadResultData(resultId: string): void {
    if (!resultId) {
      console.error('[uploadResultData] No resultId provided');
      return;
    }
    this.resultsNotificationService.success('Result data upload requested for: ' + resultId);
    console.log('Upload result data requested for:', resultId);
  }

  onGetResult(resultId: string): void {
    if (!resultId) {
      console.error('[getResult] No resultId provided');
      return;
    }
    this.resultsNotificationService.success('Get result requested for: ' + resultId);
    console.log('Get result requested for:', resultId);
  }

  onImportResultsData(resultId: string): void {
    if (!resultId) {
      console.error('[importResultsData] No resultId provided');
      return;
    }
    this.resultsNotificationService.success('Results data import requested for: ' + resultId);
    console.log('Import results data requested for:', resultId);
  }

  trackBy(index: number, item: ArmonikData<ResultRaw>): string | number {
    return item.raw.resultId;
  }
}