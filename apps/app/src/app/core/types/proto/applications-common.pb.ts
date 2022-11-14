/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import {
  GrpcMessage,
  RecursivePartial,
  ToProtobufJSONOptions
} from '@ngx-grpc/common';
import { BinaryReader, BinaryWriter, ByteSource } from 'google-protobuf';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status001 from './task-status.pb';
import * as googleProtobuf002 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1003 from './objects.pb';
/**
 * Message implementation for armonik.api.grpc.v1.applications.ApplicationRaw
 */
export class ApplicationRaw implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.applications.ApplicationRaw';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ApplicationRaw();
    ApplicationRaw.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ApplicationRaw) {
    _instance.name = _instance.name || '';
    _instance.version = _instance.version || '';
    _instance.namespace = _instance.namespace || '';
    _instance.service = _instance.service || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ApplicationRaw,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.name = _reader.readString();
          break;
        case 2:
          _instance.version = _reader.readString();
          break;
        case 3:
          _instance.namespace = _reader.readString();
          break;
        case 4:
          _instance.service = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ApplicationRaw.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ApplicationRaw,
    _writer: BinaryWriter
  ) {
    if (_instance.name) {
      _writer.writeString(1, _instance.name);
    }
    if (_instance.version) {
      _writer.writeString(2, _instance.version);
    }
    if (_instance.namespace) {
      _writer.writeString(3, _instance.namespace);
    }
    if (_instance.service) {
      _writer.writeString(4, _instance.service);
    }
  }

  private _name?: string;
  private _version?: string;
  private _namespace?: string;
  private _service?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ApplicationRaw to deeply clone from
   */
  constructor(_value?: RecursivePartial<ApplicationRaw.AsObject>) {
    _value = _value || {};
    this.name = _value.name;
    this.version = _value.version;
    this.namespace = _value.namespace;
    this.service = _value.service;
    ApplicationRaw.refineValues(this);
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get version(): string | undefined {
    return this._version;
  }
  set version(value: string | undefined) {
    this._version = value;
  }
  get namespace(): string | undefined {
    return this._namespace;
  }
  set namespace(value: string | undefined) {
    this._namespace = value;
  }
  get service(): string | undefined {
    return this._service;
  }
  set service(value: string | undefined) {
    this._service = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ApplicationRaw.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ApplicationRaw.AsObject {
    return {
      name: this.name,
      version: this.version,
      namespace: this.namespace,
      service: this.service
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ApplicationRaw.AsProtobufJSON {
    return {
      name: this.name,
      version: this.version,
      namespace: this.namespace,
      service: this.service
    };
  }
}
export module ApplicationRaw {
  /**
   * Standard JavaScript object representation for ApplicationRaw
   */
  export interface AsObject {
    name?: string;
    version?: string;
    namespace?: string;
    service?: string;
  }

  /**
   * Protobuf JSON representation for ApplicationRaw
   */
  export interface AsProtobufJSON {
    name?: string;
    version?: string;
    namespace?: string;
    service?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.applications.ListApplicationsRequest
 */
export class ListApplicationsRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.applications.ListApplicationsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListApplicationsRequest();
    ListApplicationsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListApplicationsRequest) {
    _instance.page = _instance.page || 0;
    _instance.pageSize = _instance.pageSize || 0;
    _instance.filter = _instance.filter || undefined;
    _instance.sort = _instance.sort || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListApplicationsRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.page = _reader.readInt32();
          break;
        case 2:
          _instance.pageSize = _reader.readInt32();
          break;
        case 3:
          _instance.filter = new ListApplicationsRequest.Filter();
          _reader.readMessage(
            _instance.filter,
            ListApplicationsRequest.Filter.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.sort = new ListApplicationsRequest.Sort();
          _reader.readMessage(
            _instance.sort,
            ListApplicationsRequest.Sort.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListApplicationsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListApplicationsRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.page) {
      _writer.writeInt32(1, _instance.page);
    }
    if (_instance.pageSize) {
      _writer.writeInt32(2, _instance.pageSize);
    }
    if (_instance.filter) {
      _writer.writeMessage(
        3,
        _instance.filter as any,
        ListApplicationsRequest.Filter.serializeBinaryToWriter
      );
    }
    if (_instance.sort) {
      _writer.writeMessage(
        4,
        _instance.sort as any,
        ListApplicationsRequest.Sort.serializeBinaryToWriter
      );
    }
  }

  private _page?: number;
  private _pageSize?: number;
  private _filter?: ListApplicationsRequest.Filter;
  private _sort?: ListApplicationsRequest.Sort;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListApplicationsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListApplicationsRequest.AsObject>) {
    _value = _value || {};
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.filter = _value.filter
      ? new ListApplicationsRequest.Filter(_value.filter)
      : undefined;
    this.sort = _value.sort
      ? new ListApplicationsRequest.Sort(_value.sort)
      : undefined;
    ListApplicationsRequest.refineValues(this);
  }
  get page(): number | undefined {
    return this._page;
  }
  set page(value: number | undefined) {
    this._page = value;
  }
  get pageSize(): number | undefined {
    return this._pageSize;
  }
  set pageSize(value: number | undefined) {
    this._pageSize = value;
  }
  get filter(): ListApplicationsRequest.Filter | undefined {
    return this._filter;
  }
  set filter(value: ListApplicationsRequest.Filter | undefined) {
    this._filter = value;
  }
  get sort(): ListApplicationsRequest.Sort | undefined {
    return this._sort;
  }
  set sort(value: ListApplicationsRequest.Sort | undefined) {
    this._sort = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListApplicationsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListApplicationsRequest.AsObject {
    return {
      page: this.page,
      pageSize: this.pageSize,
      filter: this.filter ? this.filter.toObject() : undefined,
      sort: this.sort ? this.sort.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ListApplicationsRequest.AsProtobufJSON {
    return {
      page: this.page,
      pageSize: this.pageSize,
      filter: this.filter ? this.filter.toProtobufJSON(options) : null,
      sort: this.sort ? this.sort.toProtobufJSON(options) : null
    };
  }
}
export module ListApplicationsRequest {
  /**
   * Standard JavaScript object representation for ListApplicationsRequest
   */
  export interface AsObject {
    page?: number;
    pageSize?: number;
    filter?: ListApplicationsRequest.Filter.AsObject;
    sort?: ListApplicationsRequest.Sort.AsObject;
  }

  /**
   * Protobuf JSON representation for ListApplicationsRequest
   */
  export interface AsProtobufJSON {
    page?: number;
    pageSize?: number;
    filter?: ListApplicationsRequest.Filter.AsProtobufJSON | null;
    sort?: ListApplicationsRequest.Sort.AsProtobufJSON | null;
  }
  export enum OrderByField {
    ORDER_BY_FIELD_UNSPECIFIED = 0,
    ORDER_BY_FIELD_NAME = 1,
    ORDER_BY_FIELD_VERSION = 2,
    ORDER_BY_FIELD_NAMESPACE = 3,
    ORDER_BY_FIELD_SERVICE = 4
  }
  export enum OrderDirection {
    ORDER_DIRECTION_UNSPECIFIED = 0,
    ORDER_DIRECTION_ASC = 1,
    ORDER_DIRECTION_DESC = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.applications.ListApplicationsRequest.Filter
   */
  export class Filter implements GrpcMessage {
    static id =
      'armonik.api.grpc.v1.applications.ListApplicationsRequest.Filter';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new Filter();
      Filter.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: Filter) {
      _instance.name = _instance.name || '';
      _instance.version = _instance.version || '';
      _instance.namespace = _instance.namespace || '';
      _instance.service = _instance.service || '';
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: Filter,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.name = _reader.readString();
            break;
          case 2:
            _instance.version = _reader.readString();
            break;
          case 3:
            _instance.namespace = _reader.readString();
            break;
          case 4:
            _instance.service = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      Filter.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: Filter, _writer: BinaryWriter) {
      if (_instance.name) {
        _writer.writeString(1, _instance.name);
      }
      if (_instance.version) {
        _writer.writeString(2, _instance.version);
      }
      if (_instance.namespace) {
        _writer.writeString(3, _instance.namespace);
      }
      if (_instance.service) {
        _writer.writeString(4, _instance.service);
      }
    }

    private _name?: string;
    private _version?: string;
    private _namespace?: string;
    private _service?: string;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Filter to deeply clone from
     */
    constructor(_value?: RecursivePartial<Filter.AsObject>) {
      _value = _value || {};
      this.name = _value.name;
      this.version = _value.version;
      this.namespace = _value.namespace;
      this.service = _value.service;
      Filter.refineValues(this);
    }
    get name(): string | undefined {
      return this._name;
    }
    set name(value: string | undefined) {
      this._name = value;
    }
    get version(): string | undefined {
      return this._version;
    }
    set version(value: string | undefined) {
      this._version = value;
    }
    get namespace(): string | undefined {
      return this._namespace;
    }
    set namespace(value: string | undefined) {
      this._namespace = value;
    }
    get service(): string | undefined {
      return this._service;
    }
    set service(value: string | undefined) {
      this._service = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      Filter.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): Filter.AsObject {
      return {
        name: this.name,
        version: this.version,
        namespace: this.namespace,
        service: this.service
      };
    }

    /**
     * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
     */
    toJSON() {
      return this.toObject();
    }

    /**
     * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
     * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
     * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
     */
    toProtobufJSON(
      // @ts-ignore
      options?: ToProtobufJSONOptions
    ): Filter.AsProtobufJSON {
      return {
        name: this.name,
        version: this.version,
        namespace: this.namespace,
        service: this.service
      };
    }
  }
  export module Filter {
    /**
     * Standard JavaScript object representation for Filter
     */
    export interface AsObject {
      name?: string;
      version?: string;
      namespace?: string;
      service?: string;
    }

    /**
     * Protobuf JSON representation for Filter
     */
    export interface AsProtobufJSON {
      name?: string;
      version?: string;
      namespace?: string;
      service?: string;
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.applications.ListApplicationsRequest.Sort
   */
  export class Sort implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.applications.ListApplicationsRequest.Sort';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new Sort();
      Sort.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: Sort) {
      _instance.field = _instance.field || 0;
      _instance.direction = _instance.direction || 0;
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(_instance: Sort, _reader: BinaryReader) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.field = _reader.readEnum();
            break;
          case 2:
            _instance.direction = _reader.readEnum();
            break;
          default:
            _reader.skipField();
        }
      }

      Sort.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: Sort, _writer: BinaryWriter) {
      if (_instance.field) {
        _writer.writeEnum(1, _instance.field);
      }
      if (_instance.direction) {
        _writer.writeEnum(2, _instance.direction);
      }
    }

    private _field?: ListApplicationsRequest.OrderByField;
    private _direction?: ListApplicationsRequest.OrderDirection;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Sort to deeply clone from
     */
    constructor(_value?: RecursivePartial<Sort.AsObject>) {
      _value = _value || {};
      this.field = _value.field;
      this.direction = _value.direction;
      Sort.refineValues(this);
    }
    get field(): ListApplicationsRequest.OrderByField | undefined {
      return this._field;
    }
    set field(value: ListApplicationsRequest.OrderByField | undefined) {
      this._field = value;
    }
    get direction(): ListApplicationsRequest.OrderDirection | undefined {
      return this._direction;
    }
    set direction(value: ListApplicationsRequest.OrderDirection | undefined) {
      this._direction = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      Sort.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): Sort.AsObject {
      return {
        field: this.field,
        direction: this.direction
      };
    }

    /**
     * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
     */
    toJSON() {
      return this.toObject();
    }

    /**
     * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
     * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
     * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
     */
    toProtobufJSON(
      // @ts-ignore
      options?: ToProtobufJSONOptions
    ): Sort.AsProtobufJSON {
      return {
        field:
          ListApplicationsRequest.OrderByField[
            this.field === null || this.field === undefined ? 0 : this.field
          ],
        direction:
          ListApplicationsRequest.OrderDirection[
            this.direction === null || this.direction === undefined
              ? 0
              : this.direction
          ]
      };
    }
  }
  export module Sort {
    /**
     * Standard JavaScript object representation for Sort
     */
    export interface AsObject {
      field?: ListApplicationsRequest.OrderByField;
      direction?: ListApplicationsRequest.OrderDirection;
    }

    /**
     * Protobuf JSON representation for Sort
     */
    export interface AsProtobufJSON {
      field?: string;
      direction?: string;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.applications.ListApplicationsResponse
 */
export class ListApplicationsResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.applications.ListApplicationsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListApplicationsResponse();
    ListApplicationsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListApplicationsResponse) {
    _instance.application = _instance.application || [];
    _instance.page = _instance.page || 0;
    _instance.pageSize = _instance.pageSize || 0;
    _instance.total = _instance.total || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListApplicationsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new ApplicationRaw();
          _reader.readMessage(
            messageInitializer1,
            ApplicationRaw.deserializeBinaryFromReader
          );
          (_instance.application = _instance.application || []).push(
            messageInitializer1
          );
          break;
        case 2:
          _instance.page = _reader.readInt32();
          break;
        case 3:
          _instance.pageSize = _reader.readInt32();
          break;
        case 4:
          _instance.total = _reader.readInt32();
          break;
        default:
          _reader.skipField();
      }
    }

    ListApplicationsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListApplicationsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.application && _instance.application.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.application as any,
        ApplicationRaw.serializeBinaryToWriter
      );
    }
    if (_instance.page) {
      _writer.writeInt32(2, _instance.page);
    }
    if (_instance.pageSize) {
      _writer.writeInt32(3, _instance.pageSize);
    }
    if (_instance.total) {
      _writer.writeInt32(4, _instance.total);
    }
  }

  private _application?: ApplicationRaw[];
  private _page?: number;
  private _pageSize?: number;
  private _total?: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListApplicationsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListApplicationsResponse.AsObject>) {
    _value = _value || {};
    this.application = (_value.application || []).map(
      m => new ApplicationRaw(m)
    );
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.total = _value.total;
    ListApplicationsResponse.refineValues(this);
  }
  get application(): ApplicationRaw[] | undefined {
    return this._application;
  }
  set application(value: ApplicationRaw[] | undefined) {
    this._application = value;
  }
  get page(): number | undefined {
    return this._page;
  }
  set page(value: number | undefined) {
    this._page = value;
  }
  get pageSize(): number | undefined {
    return this._pageSize;
  }
  set pageSize(value: number | undefined) {
    this._pageSize = value;
  }
  get total(): number | undefined {
    return this._total;
  }
  set total(value: number | undefined) {
    this._total = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListApplicationsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListApplicationsResponse.AsObject {
    return {
      application: (this.application || []).map(m => m.toObject()),
      page: this.page,
      pageSize: this.pageSize,
      total: this.total
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): ListApplicationsResponse.AsProtobufJSON {
    return {
      application: (this.application || []).map(m => m.toProtobufJSON(options)),
      page: this.page,
      pageSize: this.pageSize,
      total: this.total
    };
  }
}
export module ListApplicationsResponse {
  /**
   * Standard JavaScript object representation for ListApplicationsResponse
   */
  export interface AsObject {
    application?: ApplicationRaw.AsObject[];
    page?: number;
    pageSize?: number;
    total?: number;
  }

  /**
   * Protobuf JSON representation for ListApplicationsResponse
   */
  export interface AsProtobufJSON {
    application?: ApplicationRaw.AsProtobufJSON[] | null;
    page?: number;
    pageSize?: number;
    total?: number;
  }
}
