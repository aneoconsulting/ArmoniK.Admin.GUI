import { TestBed } from '@angular/core/testing';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcTasksService } from './grpc-tasks.service';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import {
  ListTasksRequest,
  SortDirection,
  TaskSummaryField,
  TasksClient,
} from '@aneoconsultingfr/armonik.api.angular';

describe('GrpcTasksService', () => {
  let service: GrpcTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GrpcCoreModule.forRoot(),
        GrpcWebClientModule.forRoot({
          settings: {
            host: '',
          },
        }),
      ],
      providers: [GrpcTasksService, TasksClient, GrpcParamsService],
    });
    service = TestBed.inject(GrpcTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

//   it('should create a default list of request params', () => {
//     const state: ClrDatagridStateInterface = {};
//     const requestParams = service.createListRequestParams(state);
//     expect(requestParams).toEqual({
//       page: 0,
//       pageSize: 10,
//       orderBy: TaskSummaryField.TASK_SUMMARY_FIELD_CREATED_AT,
//       order: 1,
//       filter: {} as ListTasksRequest.Filter,
//     });
//   });

//   it('should create a list of specified request params', () => {
//     const state: ClrDatagridStateInterface = {
//       page: {
//         current: 2,
//         size: 50,
//       },
//       sort: {
//         by: TaskSummaryField.TASK_SUMMARY_FIELD_STARTED_AT as unknown as ClrDatagridComparatorInterface<number>,
//         reverse: true,
//       },
//       filters: [
//         {
//           property: 'sessionId',
//           value: 'Some test sessionId',
//         },
//       ],
//     };
//     const requestParams = service.createListRequestParams(state);
//     expect(requestParams).toEqual({
//       page: 1,
//       pageSize: 50,
//       orderBy: TaskSummaryField.TASK_SUMMARY_FIELD_STARTED_AT,
//       order: 2,
//       filter: {
//         sessionId: 'Some test sessionId',
//       } as ListTasksRequest.Filter,
//     });
//   });

//   it('should create a default request query', () => {
//     const result = service.createListRequestQueryParams(
//       {
//         page: 0,
//         pageSize: 10,
//         orderBy: TaskSummaryField.TASK_SUMMARY_FIELD_CREATED_AT,
//         order: SortDirection.SORT_DIRECTION_ASC,
//         filter: {} as ListTasksRequest.Filter,
//       },
//       10000
//     );
//     expect(result).toEqual({
//       page: undefined,
//       pageSize: undefined,
//       interval: undefined,
//       orderBy: undefined,
//       order: undefined,
//       createdAfter: undefined,
//       createdBefore: undefined,
//       endedBefore: undefined,
//       endedAfter: undefined,
//       startedBefore: undefined,
//       startedAfter: undefined,
//       sessionId: undefined,
//       status: undefined,
//     });
//   });

//   it('should create a request query', () => {
//     const result = service.createListRequestQueryParams(
//       {
//         page: 2,
//         pageSize: 50,
//         orderBy: TaskSummaryField.TASK_SUMMARY_FIELD_STARTED_AT,
//         order: SortDirection.SORT_DIRECTION_DESC,
//         filter: {
//           sessionId: 'Some test sessionId',
//         } as ListTasksRequest.Filter,
//       },
//       30000
//     );
//     expect(result).toEqual({
//       page: 2,
//       pageSize: 50,
//       interval: 30000,
//       orderBy: 4,
//       order: 2,
//       sessionId: 'Some test sessionId',
//       createdAfter: undefined,
//       createdBefore: undefined,
//       endedBefore: undefined,
//       endedAfter: undefined,
//       startedBefore: undefined,
//       startedAfter: undefined,
//       status: undefined,
//     });
//   });

//   it('should create a default list of request options', () => {
//     const result = service.createListRequestOptions({
//       page: 0,
//       pageSize: 10,
//       orderBy: TaskSummaryField.TASK_SUMMARY_FIELD_CREATED_AT,
//       order: SortDirection.SORT_DIRECTION_ASC,
//       filter: {} as ListTasksRequest.Filter,
//     });
//     expect(result).toEqual(
//       new ListTasksRequest({
//         page: 0,
//         pageSize: 10,
//         sort: {
//           field: {
//             taskOptionField: null as any,
//             taskSummaryField: TaskSummaryField.TASK_SUMMARY_FIELD_CREATED_AT,
//           },
//           direction: SortDirection.SORT_DIRECTION_ASC,
//         },
//         filter: {
//           sessionId: '',
//           status: [],
//         },
//       })
//     );
//   });

//   it('should create a list of request options', () => {
//     const result = service.createListRequestOptions({
//       page: 2,
//       pageSize: 50,
//       orderBy: TaskSummaryField.TASK_SUMMARY_FIELD_STARTED_AT,
//       order: SortDirection.SORT_DIRECTION_DESC,
//       filter: {
//         sessionId: 'Some test sessionId',
//       } as ListTasksRequest.Filter,
//     });
//     expect(result).toEqual(
//       new ListTasksRequest({
//         page: 2,
//         pageSize: 50,
//         sort: {
//           field: {
//             taskOptionField: null as any,
//             taskSummaryField: TaskSummaryField.TASK_SUMMARY_FIELD_STARTED_AT,
//           },
//           direction: SortDirection.SORT_DIRECTION_DESC,
//         },
//         filter: {
//           sessionId: 'Some test sessionId',
//           status: [],
//         },
//       })
//     );
//   });
});
