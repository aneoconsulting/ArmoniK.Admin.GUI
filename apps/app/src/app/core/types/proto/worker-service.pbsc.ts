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
import * as thisProto from './worker-service.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status001 from './task-status.pb';
import * as armonikApiGrpcV1002 from './objects.pb';
import * as armonikApiGrpcV1Worker003 from './worker-common.pb';
import { GRPC_WORKER_CLIENT_SETTINGS } from './worker-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.worker.Worker
 */
@Injectable({ providedIn: 'any' })
export class WorkerClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Client streaming: /armonik.api.grpc.v1.worker.Worker/Process
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Worker003.ProcessReply>>
     */
    process: (
      requestData: Observable<armonikApiGrpcV1Worker003.ProcessRequest>,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Worker003.ProcessReply>> => {
      return this.handler.handle({
        type: GrpcCallType.clientStream,
        client: this.client,
        path: '/armonik.api.grpc.v1.worker.Worker/Process',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Worker003.ProcessRequest,
        responseClass: armonikApiGrpcV1Worker003.ProcessReply
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.worker.Worker/HealthCheck
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Worker003.HealthCheckReply>>
     */
    healthCheck: (
      requestData: armonikApiGrpcV1002.Empty,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<armonikApiGrpcV1Worker003.HealthCheckReply>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.worker.Worker/HealthCheck',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1002.Empty,
        responseClass: armonikApiGrpcV1Worker003.HealthCheckReply
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_WORKER_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.worker.Worker',
      settings
    );
  }

  /**
   * Client streaming @/armonik.api.grpc.v1.worker.Worker/Process
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Worker003.ProcessReply>
   */
  process(
    requestData: Observable<armonikApiGrpcV1Worker003.ProcessRequest>,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Worker003.ProcessReply> {
    return this.$raw
      .process(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.worker.Worker/HealthCheck
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Worker003.HealthCheckReply>
   */
  healthCheck(
    requestData: armonikApiGrpcV1002.Empty,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Worker003.HealthCheckReply> {
    return this.$raw
      .healthCheck(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
