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
import * as thisProto from './sessions-service.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status001 from './task-status.pb';
import * as googleProtobuf002 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1003 from './objects.pb';
import * as armonikApiGrpcV1Session_status004 from './session-status.pb';
import * as armonikApiGrpcV1Sessions005 from './sessions-common.pb';
import { GRPC_SESSIONS_CLIENT_SETTINGS } from './sessions-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.sessions.Sessions
 */
@Injectable({ providedIn: 'any' })
export class SessionsClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /armonik.api.grpc.v1.sessions.Sessions/ListSessions
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Sessions005.ListSessionsResponse>>
     */
    listSessions: (
      requestData: armonikApiGrpcV1Sessions005.ListSessionsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Sessions005.ListSessionsResponse>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.sessions.Sessions/ListSessions',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Sessions005.ListSessionsRequest,
        responseClass: armonikApiGrpcV1Sessions005.ListSessionsResponse
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.sessions.Sessions/GetSession
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Sessions005.GetSessionResponse>>
     */
    getSession: (
      requestData: armonikApiGrpcV1Sessions005.GetSessionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Sessions005.GetSessionResponse>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.sessions.Sessions/GetSession',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Sessions005.GetSessionRequest,
        responseClass: armonikApiGrpcV1Sessions005.GetSessionResponse
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.sessions.Sessions/CancelSession
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Sessions005.CancelSessionResponse>>
     */
    cancelSession: (
      requestData: armonikApiGrpcV1Sessions005.CancelSessionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Sessions005.CancelSessionResponse>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.sessions.Sessions/CancelSession',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Sessions005.CancelSessionRequest,
        responseClass: armonikApiGrpcV1Sessions005.CancelSessionResponse
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_SESSIONS_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.sessions.Sessions',
      settings
    );
  }

  /**
   * Unary call @/armonik.api.grpc.v1.sessions.Sessions/ListSessions
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Sessions005.ListSessionsResponse>
   */
  listSessions(
    requestData: armonikApiGrpcV1Sessions005.ListSessionsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Sessions005.ListSessionsResponse> {
    return this.$raw
      .listSessions(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.sessions.Sessions/GetSession
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Sessions005.GetSessionResponse>
   */
  getSession(
    requestData: armonikApiGrpcV1Sessions005.GetSessionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Sessions005.GetSessionResponse> {
    return this.$raw
      .getSession(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.sessions.Sessions/CancelSession
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Sessions005.CancelSessionResponse>
   */
  cancelSession(
    requestData: armonikApiGrpcV1Sessions005.CancelSessionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Sessions005.CancelSessionResponse> {
    return this.$raw
      .cancelSession(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
