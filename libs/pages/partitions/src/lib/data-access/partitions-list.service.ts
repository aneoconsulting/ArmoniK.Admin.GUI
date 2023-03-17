import { Injectable } from "@angular/core";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { ClrDatagridStateInterface } from "@clr/angular";

@Injectable()
export class PartitionsListService {
  constructor(
    private _grpcPartitionsService: GrpcPartitionsService,
  ) { }

  list$(state: ClrDatagridStateInterface) {
    const params = this._grpcPartitionsService.createListRequestParams(state);
    const grpcParams = this._grpcPartitionsService.createListRequestOptions(params);

    return this._grpcPartitionsService.list$(grpcParams);
  }
}
