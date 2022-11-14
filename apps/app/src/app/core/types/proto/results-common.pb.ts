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
import * as armonikApiGrpcV1Result_status001 from './result-status.pb';
/**
 * Message implementation for armonik.api.grpc.v1.results.ResultRaw
 */
export class ResultRaw implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.results.ResultRaw';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ResultRaw();
    ResultRaw.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ResultRaw) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.name = _instance.name || '';
    _instance.ownerTaskId = _instance.ownerTaskId || '';
    _instance.status = _instance.status || 0;
    _instance.createdAt = _instance.createdAt || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ResultRaw,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          _instance.name = _reader.readString();
          break;
        case 3:
          _instance.ownerTaskId = _reader.readString();
          break;
        case 4:
          _instance.status = _reader.readEnum();
          break;
        case 5:
          _instance.createdAt = new googleProtobuf000.Timestamp();
          _reader.readMessage(
            _instance.createdAt,
            googleProtobuf000.Timestamp.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ResultRaw.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: ResultRaw, _writer: BinaryWriter) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.name) {
      _writer.writeString(2, _instance.name);
    }
    if (_instance.ownerTaskId) {
      _writer.writeString(3, _instance.ownerTaskId);
    }
    if (_instance.status) {
      _writer.writeEnum(4, _instance.status);
    }
    if (_instance.createdAt) {
      _writer.writeMessage(
        5,
        _instance.createdAt as any,
        googleProtobuf000.Timestamp.serializeBinaryToWriter
      );
    }
  }

  private _sessionId?: string;
  private _name?: string;
  private _ownerTaskId?: string;
  private _status?: armonikApiGrpcV1Result_status001.ResultStatus;
  private _createdAt?: googleProtobuf000.Timestamp;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ResultRaw to deeply clone from
   */
  constructor(_value?: RecursivePartial<ResultRaw.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.name = _value.name;
    this.ownerTaskId = _value.ownerTaskId;
    this.status = _value.status;
    this.createdAt = _value.createdAt
      ? new googleProtobuf000.Timestamp(_value.createdAt)
      : undefined;
    ResultRaw.refineValues(this);
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get name(): string | undefined {
    return this._name;
  }
  set name(value: string | undefined) {
    this._name = value;
  }
  get ownerTaskId(): string | undefined {
    return this._ownerTaskId;
  }
  set ownerTaskId(value: string | undefined) {
    this._ownerTaskId = value;
  }
  get status(): armonikApiGrpcV1Result_status001.ResultStatus | undefined {
    return this._status;
  }
  set status(value: armonikApiGrpcV1Result_status001.ResultStatus | undefined) {
    this._status = value;
  }
  get createdAt(): googleProtobuf000.Timestamp | undefined {
    return this._createdAt;
  }
  set createdAt(value: googleProtobuf000.Timestamp | undefined) {
    this._createdAt = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ResultRaw.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ResultRaw.AsObject {
    return {
      sessionId: this.sessionId,
      name: this.name,
      ownerTaskId: this.ownerTaskId,
      status: this.status,
      createdAt: this.createdAt ? this.createdAt.toObject() : undefined
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
  ): ResultRaw.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      name: this.name,
      ownerTaskId: this.ownerTaskId,
      status:
        armonikApiGrpcV1Result_status001.ResultStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      createdAt: this.createdAt ? this.createdAt.toProtobufJSON(options) : null
    };
  }
}
export module ResultRaw {
  /**
   * Standard JavaScript object representation for ResultRaw
   */
  export interface AsObject {
    sessionId?: string;
    name?: string;
    ownerTaskId?: string;
    status?: armonikApiGrpcV1Result_status001.ResultStatus;
    createdAt?: googleProtobuf000.Timestamp.AsObject;
  }

  /**
   * Protobuf JSON representation for ResultRaw
   */
  export interface AsProtobufJSON {
    sessionId?: string;
    name?: string;
    ownerTaskId?: string;
    status?: string;
    createdAt?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.results.ListResultsRequest
 */
export class ListResultsRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.results.ListResultsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListResultsRequest();
    ListResultsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListResultsRequest) {
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
    _instance: ListResultsRequest,
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
          _instance.filter = new ListResultsRequest.Filter();
          _reader.readMessage(
            _instance.filter,
            ListResultsRequest.Filter.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.sort = new ListResultsRequest.Sort();
          _reader.readMessage(
            _instance.sort,
            ListResultsRequest.Sort.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListResultsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListResultsRequest,
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
        ListResultsRequest.Filter.serializeBinaryToWriter
      );
    }
    if (_instance.sort) {
      _writer.writeMessage(
        4,
        _instance.sort as any,
        ListResultsRequest.Sort.serializeBinaryToWriter
      );
    }
  }

  private _page?: number;
  private _pageSize?: number;
  private _filter?: ListResultsRequest.Filter;
  private _sort?: ListResultsRequest.Sort;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListResultsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListResultsRequest.AsObject>) {
    _value = _value || {};
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.filter = _value.filter
      ? new ListResultsRequest.Filter(_value.filter)
      : undefined;
    this.sort = _value.sort
      ? new ListResultsRequest.Sort(_value.sort)
      : undefined;
    ListResultsRequest.refineValues(this);
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
  get filter(): ListResultsRequest.Filter | undefined {
    return this._filter;
  }
  set filter(value: ListResultsRequest.Filter | undefined) {
    this._filter = value;
  }
  get sort(): ListResultsRequest.Sort | undefined {
    return this._sort;
  }
  set sort(value: ListResultsRequest.Sort | undefined) {
    this._sort = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListResultsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListResultsRequest.AsObject {
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
  ): ListResultsRequest.AsProtobufJSON {
    return {
      page: this.page,
      pageSize: this.pageSize,
      filter: this.filter ? this.filter.toProtobufJSON(options) : null,
      sort: this.sort ? this.sort.toProtobufJSON(options) : null
    };
  }
}
export module ListResultsRequest {
  /**
   * Standard JavaScript object representation for ListResultsRequest
   */
  export interface AsObject {
    page?: number;
    pageSize?: number;
    filter?: ListResultsRequest.Filter.AsObject;
    sort?: ListResultsRequest.Sort.AsObject;
  }

  /**
   * Protobuf JSON representation for ListResultsRequest
   */
  export interface AsProtobufJSON {
    page?: number;
    pageSize?: number;
    filter?: ListResultsRequest.Filter.AsProtobufJSON | null;
    sort?: ListResultsRequest.Sort.AsProtobufJSON | null;
  }
  export enum OrderByField {
    ORDER_BY_FIELD_UNSPECIFIED = 0,
    ORDER_BY_FIELD_SESSION_ID = 1,
    ORDER_BY_FIELD_NAME = 2,
    ORDER_BY_FIELD_OWNER_TASK_ID = 3,
    ORDER_BY_FIELD_STATUS = 4,
    ORDER_BY_FIELD_CREATED_AT = 5
  }
  export enum OrderDirection {
    ORDER_DIRECTION_UNSPECIFIED = 0,
    ORDER_DIRECTION_ASC = 1,
    ORDER_DIRECTION_DESC = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.results.ListResultsRequest.Filter
   */
  export class Filter implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.results.ListResultsRequest.Filter';

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
      _instance.sessionId = _instance.sessionId || '';
      _instance.name = _instance.name || '';
      _instance.ownerTaskId = _instance.ownerTaskId || '';
      _instance.status = _instance.status || 0;
      _instance.createdAfter = _instance.createdAfter || undefined;
      _instance.createdBefore = _instance.createdBefore || undefined;
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
            _instance.sessionId = _reader.readString();
            break;
          case 2:
            _instance.name = _reader.readString();
            break;
          case 3:
            _instance.ownerTaskId = _reader.readString();
            break;
          case 4:
            _instance.status = _reader.readEnum();
            break;
          case 5:
            _instance.createdAfter = new googleProtobuf000.Timestamp();
            _reader.readMessage(
              _instance.createdAfter,
              googleProtobuf000.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 6:
            _instance.createdBefore = new googleProtobuf000.Timestamp();
            _reader.readMessage(
              _instance.createdBefore,
              googleProtobuf000.Timestamp.deserializeBinaryFromReader
            );
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
      if (_instance.sessionId) {
        _writer.writeString(1, _instance.sessionId);
      }
      if (_instance.name) {
        _writer.writeString(2, _instance.name);
      }
      if (_instance.ownerTaskId) {
        _writer.writeString(3, _instance.ownerTaskId);
      }
      if (_instance.status) {
        _writer.writeEnum(4, _instance.status);
      }
      if (_instance.createdAfter) {
        _writer.writeMessage(
          5,
          _instance.createdAfter as any,
          googleProtobuf000.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.createdBefore) {
        _writer.writeMessage(
          6,
          _instance.createdBefore as any,
          googleProtobuf000.Timestamp.serializeBinaryToWriter
        );
      }
    }

    private _sessionId?: string;
    private _name?: string;
    private _ownerTaskId?: string;
    private _status?: armonikApiGrpcV1Result_status001.ResultStatus;
    private _createdAfter?: googleProtobuf000.Timestamp;
    private _createdBefore?: googleProtobuf000.Timestamp;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Filter to deeply clone from
     */
    constructor(_value?: RecursivePartial<Filter.AsObject>) {
      _value = _value || {};
      this.sessionId = _value.sessionId;
      this.name = _value.name;
      this.ownerTaskId = _value.ownerTaskId;
      this.status = _value.status;
      this.createdAfter = _value.createdAfter
        ? new googleProtobuf000.Timestamp(_value.createdAfter)
        : undefined;
      this.createdBefore = _value.createdBefore
        ? new googleProtobuf000.Timestamp(_value.createdBefore)
        : undefined;
      Filter.refineValues(this);
    }
    get sessionId(): string | undefined {
      return this._sessionId;
    }
    set sessionId(value: string | undefined) {
      this._sessionId = value;
    }
    get name(): string | undefined {
      return this._name;
    }
    set name(value: string | undefined) {
      this._name = value;
    }
    get ownerTaskId(): string | undefined {
      return this._ownerTaskId;
    }
    set ownerTaskId(value: string | undefined) {
      this._ownerTaskId = value;
    }
    get status(): armonikApiGrpcV1Result_status001.ResultStatus | undefined {
      return this._status;
    }
    set status(
      value: armonikApiGrpcV1Result_status001.ResultStatus | undefined
    ) {
      this._status = value;
    }
    get createdAfter(): googleProtobuf000.Timestamp | undefined {
      return this._createdAfter;
    }
    set createdAfter(value: googleProtobuf000.Timestamp | undefined) {
      this._createdAfter = value;
    }
    get createdBefore(): googleProtobuf000.Timestamp | undefined {
      return this._createdBefore;
    }
    set createdBefore(value: googleProtobuf000.Timestamp | undefined) {
      this._createdBefore = value;
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
        sessionId: this.sessionId,
        name: this.name,
        ownerTaskId: this.ownerTaskId,
        status: this.status,
        createdAfter: this.createdAfter
          ? this.createdAfter.toObject()
          : undefined,
        createdBefore: this.createdBefore
          ? this.createdBefore.toObject()
          : undefined
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
        sessionId: this.sessionId,
        name: this.name,
        ownerTaskId: this.ownerTaskId,
        status:
          armonikApiGrpcV1Result_status001.ResultStatus[
            this.status === null || this.status === undefined ? 0 : this.status
          ],
        createdAfter: this.createdAfter
          ? this.createdAfter.toProtobufJSON(options)
          : null,
        createdBefore: this.createdBefore
          ? this.createdBefore.toProtobufJSON(options)
          : null
      };
    }
  }
  export module Filter {
    /**
     * Standard JavaScript object representation for Filter
     */
    export interface AsObject {
      sessionId?: string;
      name?: string;
      ownerTaskId?: string;
      status?: armonikApiGrpcV1Result_status001.ResultStatus;
      createdAfter?: googleProtobuf000.Timestamp.AsObject;
      createdBefore?: googleProtobuf000.Timestamp.AsObject;
    }

    /**
     * Protobuf JSON representation for Filter
     */
    export interface AsProtobufJSON {
      sessionId?: string;
      name?: string;
      ownerTaskId?: string;
      status?: string;
      createdAfter?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
      createdBefore?: googleProtobuf000.Timestamp.AsProtobufJSON | null;
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.results.ListResultsRequest.Sort
   */
  export class Sort implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.results.ListResultsRequest.Sort';

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

    private _field?: ListResultsRequest.OrderByField;
    private _direction?: ListResultsRequest.OrderDirection;

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
    get field(): ListResultsRequest.OrderByField | undefined {
      return this._field;
    }
    set field(value: ListResultsRequest.OrderByField | undefined) {
      this._field = value;
    }
    get direction(): ListResultsRequest.OrderDirection | undefined {
      return this._direction;
    }
    set direction(value: ListResultsRequest.OrderDirection | undefined) {
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
          ListResultsRequest.OrderByField[
            this.field === null || this.field === undefined ? 0 : this.field
          ],
        direction:
          ListResultsRequest.OrderDirection[
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
      field?: ListResultsRequest.OrderByField;
      direction?: ListResultsRequest.OrderDirection;
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
 * Message implementation for armonik.api.grpc.v1.results.ListResultsResponse
 */
export class ListResultsResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.results.ListResultsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListResultsResponse();
    ListResultsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListResultsResponse) {
    _instance.results = _instance.results || [];
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
    _instance: ListResultsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new ResultRaw();
          _reader.readMessage(
            messageInitializer1,
            ResultRaw.deserializeBinaryFromReader
          );
          (_instance.results = _instance.results || []).push(
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

    ListResultsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListResultsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.results && _instance.results.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.results as any,
        ResultRaw.serializeBinaryToWriter
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

  private _results?: ResultRaw[];
  private _page?: number;
  private _pageSize?: number;
  private _total?: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListResultsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListResultsResponse.AsObject>) {
    _value = _value || {};
    this.results = (_value.results || []).map(m => new ResultRaw(m));
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.total = _value.total;
    ListResultsResponse.refineValues(this);
  }
  get results(): ResultRaw[] | undefined {
    return this._results;
  }
  set results(value: ResultRaw[] | undefined) {
    this._results = value;
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
    ListResultsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListResultsResponse.AsObject {
    return {
      results: (this.results || []).map(m => m.toObject()),
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
  ): ListResultsResponse.AsProtobufJSON {
    return {
      results: (this.results || []).map(m => m.toProtobufJSON(options)),
      page: this.page,
      pageSize: this.pageSize,
      total: this.total
    };
  }
}
export module ListResultsResponse {
  /**
   * Standard JavaScript object representation for ListResultsResponse
   */
  export interface AsObject {
    results?: ResultRaw.AsObject[];
    page?: number;
    pageSize?: number;
    total?: number;
  }

  /**
   * Protobuf JSON representation for ListResultsResponse
   */
  export interface AsProtobufJSON {
    results?: ResultRaw.AsProtobufJSON[] | null;
    page?: number;
    pageSize?: number;
    total?: number;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.results.GetOwnerTaskIdRequest
 */
export class GetOwnerTaskIdRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.results.GetOwnerTaskIdRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetOwnerTaskIdRequest();
    GetOwnerTaskIdRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetOwnerTaskIdRequest) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.resultId = _instance.resultId || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetOwnerTaskIdRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          (_instance.resultId = _instance.resultId || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetOwnerTaskIdRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetOwnerTaskIdRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.resultId && _instance.resultId.length) {
      _writer.writeRepeatedString(2, _instance.resultId);
    }
  }

  private _sessionId?: string;
  private _resultId?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetOwnerTaskIdRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetOwnerTaskIdRequest.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.resultId = (_value.resultId || []).slice();
    GetOwnerTaskIdRequest.refineValues(this);
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get resultId(): string[] | undefined {
    return this._resultId;
  }
  set resultId(value: string[] | undefined) {
    this._resultId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetOwnerTaskIdRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetOwnerTaskIdRequest.AsObject {
    return {
      sessionId: this.sessionId,
      resultId: (this.resultId || []).slice()
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
  ): GetOwnerTaskIdRequest.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      resultId: (this.resultId || []).slice()
    };
  }
}
export module GetOwnerTaskIdRequest {
  /**
   * Standard JavaScript object representation for GetOwnerTaskIdRequest
   */
  export interface AsObject {
    sessionId?: string;
    resultId?: string[];
  }

  /**
   * Protobuf JSON representation for GetOwnerTaskIdRequest
   */
  export interface AsProtobufJSON {
    sessionId?: string;
    resultId?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.results.GetOwnerTaskIdResponse
 */
export class GetOwnerTaskIdResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.results.GetOwnerTaskIdResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetOwnerTaskIdResponse();
    GetOwnerTaskIdResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetOwnerTaskIdResponse) {
    _instance.resultTask = _instance.resultTask || [];
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetOwnerTaskIdResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new GetOwnerTaskIdResponse.MapResultTask();
          _reader.readMessage(
            messageInitializer1,
            GetOwnerTaskIdResponse.MapResultTask.deserializeBinaryFromReader
          );
          (_instance.resultTask = _instance.resultTask || []).push(
            messageInitializer1
          );
          break;
        case 2:
          _instance.sessionId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetOwnerTaskIdResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetOwnerTaskIdResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.resultTask && _instance.resultTask.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.resultTask as any,
        GetOwnerTaskIdResponse.MapResultTask.serializeBinaryToWriter
      );
    }
    if (_instance.sessionId) {
      _writer.writeString(2, _instance.sessionId);
    }
  }

  private _resultTask?: GetOwnerTaskIdResponse.MapResultTask[];
  private _sessionId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetOwnerTaskIdResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetOwnerTaskIdResponse.AsObject>) {
    _value = _value || {};
    this.resultTask = (_value.resultTask || []).map(
      m => new GetOwnerTaskIdResponse.MapResultTask(m)
    );
    this.sessionId = _value.sessionId;
    GetOwnerTaskIdResponse.refineValues(this);
  }
  get resultTask(): GetOwnerTaskIdResponse.MapResultTask[] | undefined {
    return this._resultTask;
  }
  set resultTask(value: GetOwnerTaskIdResponse.MapResultTask[] | undefined) {
    this._resultTask = value;
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetOwnerTaskIdResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetOwnerTaskIdResponse.AsObject {
    return {
      resultTask: (this.resultTask || []).map(m => m.toObject()),
      sessionId: this.sessionId
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
  ): GetOwnerTaskIdResponse.AsProtobufJSON {
    return {
      resultTask: (this.resultTask || []).map(m => m.toProtobufJSON(options)),
      sessionId: this.sessionId
    };
  }
}
export module GetOwnerTaskIdResponse {
  /**
   * Standard JavaScript object representation for GetOwnerTaskIdResponse
   */
  export interface AsObject {
    resultTask?: GetOwnerTaskIdResponse.MapResultTask.AsObject[];
    sessionId?: string;
  }

  /**
   * Protobuf JSON representation for GetOwnerTaskIdResponse
   */
  export interface AsProtobufJSON {
    resultTask?: GetOwnerTaskIdResponse.MapResultTask.AsProtobufJSON[] | null;
    sessionId?: string;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.results.GetOwnerTaskIdResponse.MapResultTask
   */
  export class MapResultTask implements GrpcMessage {
    static id =
      'armonik.api.grpc.v1.results.GetOwnerTaskIdResponse.MapResultTask';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new MapResultTask();
      MapResultTask.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: MapResultTask) {
      _instance.resultId = _instance.resultId || '';
      _instance.taskId = _instance.taskId || '';
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: MapResultTask,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.resultId = _reader.readString();
            break;
          case 2:
            _instance.taskId = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      MapResultTask.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: MapResultTask,
      _writer: BinaryWriter
    ) {
      if (_instance.resultId) {
        _writer.writeString(1, _instance.resultId);
      }
      if (_instance.taskId) {
        _writer.writeString(2, _instance.taskId);
      }
    }

    private _resultId?: string;
    private _taskId?: string;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of MapResultTask to deeply clone from
     */
    constructor(_value?: RecursivePartial<MapResultTask.AsObject>) {
      _value = _value || {};
      this.resultId = _value.resultId;
      this.taskId = _value.taskId;
      MapResultTask.refineValues(this);
    }
    get resultId(): string | undefined {
      return this._resultId;
    }
    set resultId(value: string | undefined) {
      this._resultId = value;
    }
    get taskId(): string | undefined {
      return this._taskId;
    }
    set taskId(value: string | undefined) {
      this._taskId = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      MapResultTask.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): MapResultTask.AsObject {
      return {
        resultId: this.resultId,
        taskId: this.taskId
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
    ): MapResultTask.AsProtobufJSON {
      return {
        resultId: this.resultId,
        taskId: this.taskId
      };
    }
  }
  export module MapResultTask {
    /**
     * Standard JavaScript object representation for MapResultTask
     */
    export interface AsObject {
      resultId?: string;
      taskId?: string;
    }

    /**
     * Protobuf JSON representation for MapResultTask
     */
    export interface AsProtobufJSON {
      resultId?: string;
      taskId?: string;
    }
  }
}
