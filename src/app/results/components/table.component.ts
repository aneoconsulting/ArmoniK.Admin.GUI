import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractTableComponent } from '@app/types/components/table';
import { ArmonikData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { NotificationService } from '@services/notification.service';
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

  downloadResult$ = new Subject<ArmonikData<ResultRaw>>();
  downloadResultSubscription = this.downloadResult$.subscribe(data => this.onDownload(data.raw.resultId));

  actions: ActionTable<ResultRaw>[] = [
    {
      label: 'Download result data',
      icon: 'download',
      action$: this.downloadResult$,
    },
  ];

  ngOnInit(): void {
    this.initTableDataService();
  }

  isDataRawEqual(value: ResultRaw, entry: ResultRaw): boolean {
    return value.resultId === entry.resultId;
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

  trackBy(index: number, item: ArmonikData<ResultRaw>): string | number {
    return item.raw.resultId;
  }
}