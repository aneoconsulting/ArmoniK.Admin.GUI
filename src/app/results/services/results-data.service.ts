import { ListResultsResponse, ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Scope } from '@app/types/config';
import { ResultData } from '@app/types/data';
import { AbstractTableDataService } from '@app/types/services/table-data.service';
import { ResultRaw } from '../types';
import { ResultsGrpcService } from './results-grpc.service';

@Injectable()
export default class ResultsDataService extends AbstractTableDataService<ResultRaw, ResultRawEnumField> {
  readonly grpcService = inject(ResultsGrpcService);

  scope: Scope = 'results';

  computeGrpcData(entries: ListResultsResponse): ResultRaw[] | undefined {
    return entries.results;
  }

  createNewLine(entry: ResultRaw): ResultData {
    return {
      raw: entry,
    };
  }
}