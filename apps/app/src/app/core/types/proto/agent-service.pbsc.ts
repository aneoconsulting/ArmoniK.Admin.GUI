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
import * as thisProto from './agent-service.pb';
import * as armonikApiGrpcV1000 from './objects.pb';
import * as googleProtobuf001 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status002 from './task-status.pb';
import * as armonikApiGrpcV1Agent003 from './agent-common.pb';
import { GRPC_AGENT_CLIENT_SETTINGS } from './agent-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.agent.Agent
 */
@Injectable({ providedIn: 'any' })
export class AgentClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Client streaming: /armonik.api.grpc.v1.agent.Agent/CreateTask
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Agent003.CreateTaskReply>>
     */
    createTask: (
      requestData: Observable<armonikApiGrpcV1Agent003.CreateTaskRequest>,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Agent003.CreateTaskReply>> => {
      return this.handler.handle({
        type: GrpcCallType.clientStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.agent.Agent/CreateTask',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Agent003.CreateTaskRequest,
        responseClass: armonikApiGrpcV1Agent003.CreateTaskReply
      });
    },
    /**
     * Server streaming: /armonik.api.grpc.v1.agent.Agent/GetResourceData
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Agent003.DataReply>>
     */
    getResourceData: (
      requestData: armonikApiGrpcV1Agent003.DataRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Agent003.DataReply>> => {
      return this.handler.handle({
        type: GrpcCallType.serverStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.agent.Agent/GetResourceData',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Agent003.DataRequest,
        responseClass: armonikApiGrpcV1Agent003.DataReply
      });
    },
    /**
     * Server streaming: /armonik.api.grpc.v1.agent.Agent/GetCommonData
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Agent003.DataReply>>
     */
    getCommonData: (
      requestData: armonikApiGrpcV1Agent003.DataRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Agent003.DataReply>> => {
      return this.handler.handle({
        type: GrpcCallType.serverStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.agent.Agent/GetCommonData',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Agent003.DataRequest,
        responseClass: armonikApiGrpcV1Agent003.DataReply
      });
    },
    /**
     * Server streaming: /armonik.api.grpc.v1.agent.Agent/GetDirectData
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Agent003.DataReply>>
     */
    getDirectData: (
      requestData: armonikApiGrpcV1Agent003.DataRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Agent003.DataReply>> => {
      return this.handler.handle({
        type: GrpcCallType.serverStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.agent.Agent/GetDirectData',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Agent003.DataRequest,
        responseClass: armonikApiGrpcV1Agent003.DataReply
      });
    },
    /**
     * Client streaming: /armonik.api.grpc.v1.agent.Agent/SendResult
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Agent003.ResultReply>>
     */
    sendResult: (
      requestData: Observable<armonikApiGrpcV1Agent003.Result>,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Agent003.ResultReply>> => {
      return this.handler.handle({
        type: GrpcCallType.clientStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.agent.Agent/SendResult',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Agent003.Result,
        responseClass: armonikApiGrpcV1Agent003.ResultReply
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_AGENT_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.agent.Agent',
      settings
    );
  }

  /**
   * Client streaming @/armonik.api.grpc.v1.agent.Agent/CreateTask
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Agent003.CreateTaskReply>
   */
  createTask(
    requestData: Observable<armonikApiGrpcV1Agent003.CreateTaskRequest>,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Agent003.CreateTaskReply> {
    return this.$raw
      .createTask(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Server streaming @/armonik.api.grpc.v1.agent.Agent/GetResourceData
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Agent003.DataReply>
   */
  getResourceData(
    requestData: armonikApiGrpcV1Agent003.DataRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Agent003.DataReply> {
    return this.$raw
      .getResourceData(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Server streaming @/armonik.api.grpc.v1.agent.Agent/GetCommonData
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Agent003.DataReply>
   */
  getCommonData(
    requestData: armonikApiGrpcV1Agent003.DataRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Agent003.DataReply> {
    return this.$raw
      .getCommonData(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Server streaming @/armonik.api.grpc.v1.agent.Agent/GetDirectData
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Agent003.DataReply>
   */
  getDirectData(
    requestData: armonikApiGrpcV1Agent003.DataRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Agent003.DataReply> {
    return this.$raw
      .getDirectData(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Client streaming @/armonik.api.grpc.v1.agent.Agent/SendResult
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Agent003.ResultReply>
   */
  sendResult(
    requestData: Observable<armonikApiGrpcV1Agent003.Result>,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Agent003.ResultReply> {
    return this.$raw
      .sendResult(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
