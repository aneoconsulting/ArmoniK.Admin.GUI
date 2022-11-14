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
import * as thisProto from './results-service.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Result_status001 from './result-status.pb';
import * as armonikApiGrpcV1Results002 from './results-common.pb';
import { GRPC_RESULTS_CLIENT_SETTINGS } from './results-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.results.Results
 */
@Injectable({ providedIn: 'any' })
export class ResultsClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /armonik.api.grpc.v1.results.Results/ListResults
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Results002.ListResultsResponse>>
     */
    listResults: (
      requestData: armonikApiGrpcV1Results002.ListResultsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Results002.ListResultsResponse>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.results.Results/ListResults',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Results002.ListResultsRequest,
        responseClass: armonikApiGrpcV1Results002.ListResultsResponse
      });
    },
    /**
     * Unary call: /armonik.api.grpc.v1.results.Results/GetOwnerTaskId
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Results002.GetOwnerTaskIdResponse>>
     */
    getOwnerTaskId: (
      requestData: armonikApiGrpcV1Results002.GetOwnerTaskIdRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Results002.GetOwnerTaskIdResponse>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.results.Results/GetOwnerTaskId',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Results002.GetOwnerTaskIdRequest,
        responseClass: armonikApiGrpcV1Results002.GetOwnerTaskIdResponse
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_RESULTS_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.results.Results',
      settings
    );
  }

  /**
   * Unary call @/armonik.api.grpc.v1.results.Results/ListResults
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Results002.ListResultsResponse>
   */
  listResults(
    requestData: armonikApiGrpcV1Results002.ListResultsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Results002.ListResultsResponse> {
    return this.$raw
      .listResults(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/armonik.api.grpc.v1.results.Results/GetOwnerTaskId
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Results002.GetOwnerTaskIdResponse>
   */
  getOwnerTaskId(
    requestData: armonikApiGrpcV1Results002.GetOwnerTaskIdRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Results002.GetOwnerTaskIdResponse> {
    return this.$raw
      .getOwnerTaskId(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
