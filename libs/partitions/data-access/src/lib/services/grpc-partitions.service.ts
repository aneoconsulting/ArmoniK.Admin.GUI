import { Injectable } from "@angular/core";
import { PartitionsClient, BaseGrpcService, ListPartitionsRequest } from "@armonik.admin.gui/shared/data-access";
import { Observable, takeUntil } from "rxjs";

@Injectable()
export class GrpcPartitionsService extends BaseGrpcService {
    constructor(private _partitionsClient: PartitionsClient) {
        super();
    }

    public list$(
        params: GrpcParams<
            ListPartitionsRequest.OrderByField,
            ListPartitionsRequest.OrderDirection,
            ListPartitionsRequest.Filter.AsObject
    ): Observable<ListPartitionsResponse> {
        const options = new ListPartitionsRequest({
            page: params.page || 0,
            pageSize: params.pageSize || 10,
            sort: {
              field:
                params.orderBy ||
                ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_NAME,
              direction:
                params.order ||
                ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
            },
          })

        return this._partitionsClient.list(options).pipe(takeUntil(this._timeout$));
    }
}