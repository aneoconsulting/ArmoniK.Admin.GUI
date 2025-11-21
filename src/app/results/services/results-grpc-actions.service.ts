import { ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
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
                catchError(error => this.handleError(error, $localize`An error occurred while downloading result ${result.resultId}`))
              )])
            )
          );
        }
        return [];
      })
    ).subscribe((resultChunks) => {
      for (const [resultId, resultChunk] of resultChunks) {
        if (resultChunk && resultChunk.dataChunk.length !== 0) {
          const fileName = `${resultId}.bin`;
          this.downloadAs(resultChunk.serializeBinary(), fileName, 'application/octet-stream');
        }
      }
    });
    this.subscriptions.add(downloadSubscription);
  }

  downloadAs(
    content: Uint8Array<ArrayBufferLike>,
    filename: string,
    mime: 'application/json' | 'text/plain' | 'application/octet-stream'
  ): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([content as Uint8Array<ArrayBuffer>], { type: mime });

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
}