import { Injectable } from "@angular/core";
import { PartitionsClient, BaseGrpcService, ListPartitionsRequest, ListPartitionsResponse, GrpcParams, GetPartitionResponse, GetPartitionRequest } from "@armonik.admin.gui/shared/data-access";
import { Observable, takeUntil } from "rxjs";

@Injectable()
export class GrpcPartitionsService extends BaseGrpcService {
    constructor(private _partitionsClient: PartitionsClient) {
        super();
    }

    public urlToGrpcParams(urlParams: Record<string, string | number>
        ) :GrpcParams<
    ListPartitionsRequest.OrderByField,
    ListPartitionsRequest.OrderDirection,
    ListPartitionsRequest.Filter.AsObject> {
        const grpcParams: GrpcParams<ListPartitionsRequest.OrderByField,
        ListPartitionsRequest.OrderDirection,
        ListPartitionsRequest.Filter.AsObject> = {}

        const filter: ListPartitionsRequest.Filter.AsObject = {
            id: '',
            parentPartitionId: '',
            podMax: '',
            podReserved: '',
            preemptionPercentage: '',
            priority: ''
        }

        for (const [key, value] of Object.entries(urlParams)) {
            switch (key) {
                case 'page': {
                    grpcParams.page = value as number;
                    break;
                }
                case 'PageSize': {
                    grpcParams.pageSize = value as number;
                    break;
                }
                case 'order': {
                    grpcParams.order = value as number;
                    break;
                }
                case 'orderBy': {
                    grpcParams.orderBy = value as number;
                    break;
                }
                case 'id': {
                    filter.id = value as string;
                    break;
                }
                case 'parentPartitionId': {
                    filter.parentPartitionId = value as string;
                    break;
                }
                case 'podMax': {
                    filter.podMax = value as string;
                    break;
                }
                case 'podReserved': {
                    filter.podReserved = value as string;
                    break;
                }
                case 'preemptionPercentage': {
                    filter.preemptionPercentage = value as string;
                    break;
                }
                case 'priority': {
                    filter.priority = value as string;
                    break;
                }
            }
        }
        grpcParams.filter = filter;
        return grpcParams;
    }

    public list$(
        params: GrpcParams<
            ListPartitionsRequest.OrderByField,
            ListPartitionsRequest.OrderDirection,
            ListPartitionsRequest.Filter.AsObject>
    ): Observable<ListPartitionsResponse> {
        const options = new ListPartitionsRequest({
            page: params.page || 0,
            pageSize: params.pageSize || 10,
            sort: {
              field: params.orderBy || ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
              direction:
                params.order ||
                ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
            },
          })

        return this._partitionsClient.listPartitions(options).pipe(takeUntil(this._timeout$));
    }

    public get$(
        paramId: string
    ): Observable<GetPartitionResponse> {
        const options = new GetPartitionRequest({
            id: paramId
        });

        return this._partitionsClient.getPartition(options).pipe(takeUntil(this._timeout$));
    }
}