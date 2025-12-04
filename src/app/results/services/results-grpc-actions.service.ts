import { DownloadResultDataResponse, ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import JSZip from 'jszip';
import { catchError, combineLatest, of, Subject, switchMap } from 'rxjs';
import { ResultsGrpcService } from './results-grpc.service';
import { ResultsStatusesService } from './results-statuses.service';
import { ResultRaw } from '../types';

@Injectable()
export class ResultsGrpcActionsService extends GrpcActionsService<ResultRaw, ResultStatus, ResultRawEnumField> {
  protected readonly statusesService = inject(StatusService) as ResultsStatusesService;
  protected readonly grpcService = inject(ResultsGrpcService);
  
  private readonly downloadResultData$ = new Subject<ResultRaw[]>();

  constructor() {
    super();

    this.actions.push(
      {
        label: $localize`Download result data`,
        icon: 'download',
        click: (results) => this.downloadResultData$.next(results),
        key: 'download'
      }
    );
  }
  
  protected override subscribeToActions(): void {
    const downloadSubscription = this.downloadResultData$.pipe(
      switchMap(results => {
        if (results.length !== 0) {
          return combineLatest(
            results.map(result => 
              combineLatest([of(result.resultId), this.grpcService.downloadResultData$(result.resultId).pipe(
                catchError(error => {
                  if (results.length === 1) {
                    this.handleError(error, $localize`An error occurred while downloading result ${result.resultId}`);
                  }
                  return of(null);
                })
              )])
            )
          );
        }
        return of([]);
      })
    ).subscribe((resultChunks) => {
      const filteredResult = resultChunks.filter((data) => !!data[1]);
      if (filteredResult.length === 0) {
        this.error($localize`Could not find data to download`);
      } else if (filteredResult.length === 1) {
        const [resultId, resultChunk] = filteredResult[0];
        if (resultChunk) {
          const fileName = `${resultId}.bin`;
          this.downloadAs(resultChunk.serializeBinary(), fileName, 'application/octet-stream');
          this.success($localize`${resultId} downloaded`);
        }
      } else {
        void this.downloadAsZip(filteredResult);
        this.success($localize`Results downloaded`);
      }
    });
    this.subscriptions.add(downloadSubscription);
  }

  downloadAs(
    content: Uint8Array<ArrayBufferLike>,
    filename: string,
    mime: 'application/json' | 'text/plain' | 'application/octet-stream' | 'application/zip'
  ): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([content], { type: mime });

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

  async downloadAsZip(resultChunks: [string, DownloadResultDataResponse | null][]) {
    const zip = new JSZip();
    for (const [resultId, resultChunk] of resultChunks) {
      if (resultChunk && resultChunk.dataChunk.length !== 0) {
        zip.file(`${resultId}.bin`, resultChunk.serializeBinary());
      }
    }
    await zip.generateAsync({ type: 'uint8array' }).then((content) => {
      const date = new Date().toISOString().slice(0, 10);
      const id = Date.now();
      this.downloadAs(content, `results-${id}-${date}.zip`, 'application/zip');
    });
  }
}