import { Injectable } from "@angular/core";
import { GrpcPartitionsService } from "@armonik.admin.gui/partitions/data-access";
import { ClrDatagridStateInterface } from "@clr/angular";

@Injectable()
export class PartitionsListService {
  constructor(
    private _grpcPartitionsService: GrpcPartitionsService,
  ) { }

  // TODO: Add error handling
  // Do it in the page component. When the request fails, the loading spinner will stop and the error will be displayed under the table.
  list$(state: ClrDatagridStateInterface) {
    const params = this._grpcPartitionsService.createListRequestParams(state);
    const grpcParams = this._grpcPartitionsService.createListRequestOptions(params);

    console.log('state', state);
    console.log('params', params);
    console.log('grpcParams', grpcParams);

    return this._grpcPartitionsService.list$(grpcParams);
  }
}
