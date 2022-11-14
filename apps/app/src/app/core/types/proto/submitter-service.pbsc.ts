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
import * as thisProto from './submitter-service.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status001 from './task-status.pb';
import * as armonikApiGrpcV1002 from './objects.pb';
import * as armonikApiGrpcV1Result_status003 from './result-status.pb';
import * as armonikApiGrpcV1Session_status004 from './session-status.pb';
import * as armonikApiGrpcV1Submitter005 from './submitter-common.pb';
import { GRPC_SUBMITTER_CLIENT_SETTINGS } from './submitter-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.submitter.Submitter
 */
@Injectable({ providedIn: 'any' })
export class SubmitterClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/GetServiceConfiguration
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.Configuration>>
     */
    getServiceConfiguration: (
      requestData: armonikApiGrpcV1002.Empty,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.Configuration>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path:
          '/armonik.api.grpc.v1.submitter.Submitter/GetServiceConfiguration',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1002.Empty,
        responseClass: armonikApiGrpcV1002.Configuration
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/CreateSession
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.CreateSessionReply>>
     */
    createSession: (
      requestData: armonikApiGrpcV1Submitter005.CreateSessionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Submitter005.CreateSessionReply>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/CreateSession',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.CreateSessionRequest,
        responseClass: armonikApiGrpcV1Submitter005.CreateSessionReply
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/CancelSession
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.Empty>>
     */
    cancelSession: (
      requestData: armonikApiGrpcV1002.Session,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/CancelSession',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1002.Session,
        responseClass: armonikApiGrpcV1002.Empty
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/CreateSmallTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.CreateTaskReply>>
     */
    createSmallTasks: (
      requestData: armonikApiGrpcV1Submitter005.CreateSmallTaskRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Submitter005.CreateTaskReply>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/CreateSmallTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.CreateSmallTaskRequest,
        responseClass: armonikApiGrpcV1Submitter005.CreateTaskReply
      });
    },
    /**
     * Client streaming: /armonik.api.grpc.v1.submitter.Submitter/CreateLargeTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.CreateTaskReply>>
     */
    createLargeTasks: (
      requestData: Observable<
        armonikApiGrpcV1Submitter005.CreateLargeTaskRequest
      >,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Submitter005.CreateTaskReply>> => {
      return this.handler.handle({
        type: GrpcCallType.clientStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/CreateLargeTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.CreateLargeTaskRequest,
        responseClass: armonikApiGrpcV1Submitter005.CreateTaskReply
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/ListTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.TaskIdList>>
     */
    listTasks: (
      requestData: armonikApiGrpcV1Submitter005.TaskFilter,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.TaskIdList>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/ListTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.TaskFilter,
        responseClass: armonikApiGrpcV1002.TaskIdList
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/ListSessions
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.SessionIdList>>
     */
    listSessions: (
      requestData: armonikApiGrpcV1Submitter005.SessionFilter,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Submitter005.SessionIdList>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/ListSessions',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.SessionFilter,
        responseClass: armonikApiGrpcV1Submitter005.SessionIdList
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/CountTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.Count>>
     */
    countTasks: (
      requestData: armonikApiGrpcV1Submitter005.TaskFilter,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.Count>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/CountTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.TaskFilter,
        responseClass: armonikApiGrpcV1002.Count
      });
    },
    /**
     * Server streaming: /armonik.api.grpc.v1.submitter.Submitter/TryGetResultStream
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.ResultReply>>
     */
    tryGetResultStream: (
      requestData: armonikApiGrpcV1002.ResultRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Submitter005.ResultReply>> => {
      return this.handler.handle({
        type: GrpcCallType.serverStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/TryGetResultStream',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1002.ResultRequest,
        responseClass: armonikApiGrpcV1Submitter005.ResultReply
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/TryGetTaskOutput
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.Output>>
     */
    tryGetTaskOutput: (
      requestData: armonikApiGrpcV1002.TaskOutputRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.Output>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/TryGetTaskOutput',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1002.TaskOutputRequest,
        responseClass: armonikApiGrpcV1002.Output
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/WaitForAvailability
     * @deprecated
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.AvailabilityReply>>
     */
    waitForAvailability: (
      requestData: armonikApiGrpcV1002.ResultRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Submitter005.AvailabilityReply>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/WaitForAvailability',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1002.ResultRequest,
        responseClass: armonikApiGrpcV1Submitter005.AvailabilityReply
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/WaitForCompletion
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.Count>>
     */
    waitForCompletion: (
      requestData: armonikApiGrpcV1Submitter005.WaitRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.Count>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/WaitForCompletion',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.WaitRequest,
        responseClass: armonikApiGrpcV1002.Count
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/CancelTasks
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1002.Empty>>
     */
    cancelTasks: (
      requestData: armonikApiGrpcV1Submitter005.TaskFilter,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1002.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/CancelTasks',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.TaskFilter,
        responseClass: armonikApiGrpcV1002.Empty
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/GetTaskStatus
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.GetTaskStatusReply>>
     */
    getTaskStatus: (
      requestData: armonikApiGrpcV1Submitter005.GetTaskStatusRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Submitter005.GetTaskStatusReply>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/GetTaskStatus',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.GetTaskStatusRequest,
        responseClass: armonikApiGrpcV1Submitter005.GetTaskStatusReply
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.submitter.Submitter/GetResultStatus
     * @deprecated
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.GetResultStatusReply>>
     */
    getResultStatus: (
      requestData: armonikApiGrpcV1Submitter005.GetResultStatusRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Submitter005.GetResultStatusReply>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/GetResultStatus',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.GetResultStatusRequest,
        responseClass: armonikApiGrpcV1Submitter005.GetResultStatusReply
      });
    },
    /**
     * Bidirectional streaming: /armonik.api.grpc.v1.submitter.Submitter/WatchResults
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Submitter005.WatchResultStream>>
     */
    watchResults: (
      requestData: Observable<armonikApiGrpcV1Submitter005.WatchResultRequest>,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Submitter005.WatchResultStream>
    > => {
      return this.handler.handle({
        type: GrpcCallType.bidiStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.submitter.Submitter/WatchResults',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Submitter005.WatchResultRequest,
        responseClass: armonikApiGrpcV1Submitter005.WatchResultStream
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_SUBMITTER_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.submitter.Submitter',
      settings
    );
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/GetServiceConfiguration
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.Configuration>
   */
  getServiceConfiguration(
    requestData: armonikApiGrpcV1002.Empty,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.Configuration> {
    return this.$raw
      .getServiceConfiguration(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/CreateSession
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.CreateSessionReply>
   */
  createSession(
    requestData: armonikApiGrpcV1Submitter005.CreateSessionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.CreateSessionReply> {
    return this.$raw
      .createSession(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/CancelSession
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.Empty>
   */
  cancelSession(
    requestData: armonikApiGrpcV1002.Session,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.Empty> {
    return this.$raw
      .cancelSession(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/CreateSmallTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.CreateTaskReply>
   */
  createSmallTasks(
    requestData: armonikApiGrpcV1Submitter005.CreateSmallTaskRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.CreateTaskReply> {
    return this.$raw
      .createSmallTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Client streaming @/armonik.api.grpc.v1.submitter.Submitter/CreateLargeTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.CreateTaskReply>
   */
  createLargeTasks(
    requestData: Observable<
      armonikApiGrpcV1Submitter005.CreateLargeTaskRequest
    >,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.CreateTaskReply> {
    return this.$raw
      .createLargeTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/ListTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.TaskIdList>
   */
  listTasks(
    requestData: armonikApiGrpcV1Submitter005.TaskFilter,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.TaskIdList> {
    return this.$raw
      .listTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/ListSessions
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.SessionIdList>
   */
  listSessions(
    requestData: armonikApiGrpcV1Submitter005.SessionFilter,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.SessionIdList> {
    return this.$raw
      .listSessions(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/CountTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.Count>
   */
  countTasks(
    requestData: armonikApiGrpcV1Submitter005.TaskFilter,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.Count> {
    return this.$raw
      .countTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Server streaming @/armonik.api.grpc.v1.submitter.Submitter/TryGetResultStream
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.ResultReply>
   */
  tryGetResultStream(
    requestData: armonikApiGrpcV1002.ResultRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.ResultReply> {
    return this.$raw
      .tryGetResultStream(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/TryGetTaskOutput
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.Output>
   */
  tryGetTaskOutput(
    requestData: armonikApiGrpcV1002.TaskOutputRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.Output> {
    return this.$raw
      .tryGetTaskOutput(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/WaitForAvailability
   * @deprecated
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.AvailabilityReply>
   */
  waitForAvailability(
    requestData: armonikApiGrpcV1002.ResultRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.AvailabilityReply> {
    return this.$raw
      .waitForAvailability(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/WaitForCompletion
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.Count>
   */
  waitForCompletion(
    requestData: armonikApiGrpcV1Submitter005.WaitRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.Count> {
    return this.$raw
      .waitForCompletion(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/CancelTasks
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1002.Empty>
   */
  cancelTasks(
    requestData: armonikApiGrpcV1Submitter005.TaskFilter,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1002.Empty> {
    return this.$raw
      .cancelTasks(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/GetTaskStatus
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.GetTaskStatusReply>
   */
  getTaskStatus(
    requestData: armonikApiGrpcV1Submitter005.GetTaskStatusRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.GetTaskStatusReply> {
    return this.$raw
      .getTaskStatus(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.submitter.Submitter/GetResultStatus
   * @deprecated
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.GetResultStatusReply>
   */
  getResultStatus(
    requestData: armonikApiGrpcV1Submitter005.GetResultStatusRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.GetResultStatusReply> {
    return this.$raw
      .getResultStatus(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Bidirectional streaming @/armonik.api.grpc.v1.submitter.Submitter/WatchResults
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Submitter005.WatchResultStream>
   */
  watchResults(
    requestData: Observable<armonikApiGrpcV1Submitter005.WatchResultRequest>,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Submitter005.WatchResultStream> {
    return this.$raw
      .watchResults(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
