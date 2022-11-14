/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import { Inject, Injectable, Optional } from '@angular/core';
import {
  GrpcCallType,
  GrpcClient,
  GrpcClientFactory,
  GrpcEvent,
  GrpcMetadata
} from '@ngx-grpc/common';
import {
  GRPC_CLIENT_FACTORY,
  GrpcHandler,
  takeMessages,
  throwStatusErrors
} from '@ngx-grpc/core';
import { Observable } from 'rxjs';
import * as thisProto from './tasks-service.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status001 from './task-status.pb';
import * as googleProtobuf002 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1003 from './objects.pb';
import * as armonikApiGrpcV1Tasks004 from './tasks-common.pb';
import { GRPC_TASKS_CLIENT_SETTINGS } from './tasks-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.tasks.Tasks
 */
@Injectable({ providedIn: 'any' })
export class TasksClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /armonik.api.grpc.v1.tasks.Tasks/ListTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Tasks004.ListTasksResponse>>
     */
    listTasks: (
      requestData: armonikApiGrpcV1Tasks004.ListTasksRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Tasks004.ListTasksResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.tasks.Tasks/ListTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Tasks004.ListTasksRequest,
        responseClass: armonikApiGrpcV1Tasks004.ListTasksResponse
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.tasks.Tasks/GetTask
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Tasks004.GetTaskResponse>>
     */
    getTask: (
      requestData: armonikApiGrpcV1Tasks004.GetTaskRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Tasks004.GetTaskResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.tasks.Tasks/GetTask',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Tasks004.GetTaskRequest,
        responseClass: armonikApiGrpcV1Tasks004.GetTaskResponse
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.tasks.Tasks/CancelTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Tasks004.CancelTasksResponse>>
     */
    cancelTasks: (
      requestData: armonikApiGrpcV1Tasks004.CancelTasksRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Tasks004.CancelTasksResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.tasks.Tasks/CancelTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Tasks004.CancelTasksRequest,
        responseClass: armonikApiGrpcV1Tasks004.CancelTasksResponse
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.tasks.Tasks/GetResultIds
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Tasks004.GetResultIdsResponse>>
     */
    getResultIds: (
      requestData: armonikApiGrpcV1Tasks004.GetResultIdsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Tasks004.GetResultIdsResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.tasks.Tasks/GetResultIds',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Tasks004.GetResultIdsRequest,
        responseClass: armonikApiGrpcV1Tasks004.GetResultIdsResponse
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_TASKS_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.tasks.Tasks',
      settings
    );
  }

  /**
   * Unary call @/armonik.api.grpc.v1.tasks.Tasks/ListTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Tasks004.ListTasksResponse>
   */
  listTasks(
    requestData: armonikApiGrpcV1Tasks004.ListTasksRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Tasks004.ListTasksResponse> {
    return this.$raw
      .listTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.tasks.Tasks/GetTask
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Tasks004.GetTaskResponse>
   */
  getTask(
    requestData: armonikApiGrpcV1Tasks004.GetTaskRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Tasks004.GetTaskResponse> {
    return this.$raw
      .getTask(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.tasks.Tasks/CancelTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Tasks004.CancelTasksResponse>
   */
  cancelTasks(
    requestData: armonikApiGrpcV1Tasks004.CancelTasksRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Tasks004.CancelTasksResponse> {
    return this.$raw
      .cancelTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.tasks.Tasks/GetResultIds
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Tasks004.GetResultIdsResponse>
   */
  getResultIds(
    requestData: armonikApiGrpcV1Tasks004.GetResultIdsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Tasks004.GetResultIdsResponse> {
    return this.$raw
      .getResultIds(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
