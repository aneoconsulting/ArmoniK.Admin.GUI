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
import * as thisProto from './applications-service.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1001 from './objects.pb';
import * as armonikApiGrpcV1Applications002 from './applications-common.pb';
import { GRPC_APPLICATIONS_CLIENT_SETTINGS } from './applications-service.pbconf';
/**
 * Service client implementation for armonik.api.grpc.v1.applications.Applications
 */
@Injectable({ providedIn: 'any' })
export class ApplicationsClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /armonik.api.grpc.v1.applications.Applications/ListApplications
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<armonikApiGrpcV1Applications002.ListApplicationsResponse>>
     */
    listApplications: (
      requestData: armonikApiGrpcV1Applications002.ListApplicationsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<
      GrpcEvent<armonikApiGrpcV1Applications002.ListApplicationsResponse>
    > => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/armonik.api.grpc.v1.applications.Applications/ListApplications',
        requestData,
        requestMetadata,
        requestClass: armonikApiGrpcV1Applications002.ListApplicationsRequest,
        responseClass: armonikApiGrpcV1Applications002.ListApplicationsResponse
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_APPLICATIONS_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'armonik.api.grpc.v1.applications.Applications',
      settings
    );
  }

  /**
   * Unary call @/armonik.api.grpc.v1.applications.Applications/ListApplications
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<armonikApiGrpcV1Applications002.ListApplicationsResponse>
   */
  listApplications(
    requestData: armonikApiGrpcV1Applications002.ListApplicationsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<armonikApiGrpcV1Applications002.ListApplicationsResponse> {
    return this.$raw
      .listApplications(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
