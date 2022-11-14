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
import * as armonikApiGrpcV1Session_status004 from './session-status.pb';
/**
 * Message implementation for armonik.api.grpc.v1.sessions.SessionRaw
 */
export class SessionRaw implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.SessionRaw';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionRaw();
    SessionRaw.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionRaw) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.status = _instance.status || 0;
    _instance.partitionIds = _instance.partitionIds || [];
    _instance.options = _instance.options || undefined;
    _instance.createdAt = _instance.createdAt || undefined;
    _instance.cancelledAt = _instance.cancelledAt || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionRaw,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          _instance.status = _reader.readEnum();
          break;
        case 3:
          (_instance.partitionIds = _instance.partitionIds || []).push(
            _reader.readString()
          );
          break;
        case 4:
          _instance.options = new armonikApiGrpcV1003.TaskOptions();
          _reader.readMessage(
            _instance.options,
            armonikApiGrpcV1003.TaskOptions.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.createdAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.createdAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 6:
          _instance.cancelledAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.cancelledAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    SessionRaw.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: SessionRaw, _writer: BinaryWriter) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.status) {
      _writer.writeEnum(2, _instance.status);
    }
    if (_instance.partitionIds && _instance.partitionIds.length) {
      _writer.writeRepeatedString(3, _instance.partitionIds);
    }
    if (_instance.options) {
      _writer.writeMessage(
        4,
        _instance.options as any,
        armonikApiGrpcV1003.TaskOptions.serializeBinaryToWriter
      );
    }
    if (_instance.createdAt) {
      _writer.writeMessage(
        5,
        _instance.createdAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.cancelledAt) {
      _writer.writeMessage(
        6,
        _instance.cancelledAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
  }

  private _sessionId?: string;
  private _status?: armonikApiGrpcV1Session_status004.SessionStatus;
  private _partitionIds?: string[];
  private _options?: armonikApiGrpcV1003.TaskOptions;
  private _createdAt?: googleProtobuf002.Timestamp;
  private _cancelledAt?: googleProtobuf002.Timestamp;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionRaw to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionRaw.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.status = _value.status;
    this.partitionIds = (_value.partitionIds || []).slice();
    this.options = _value.options
      ? new armonikApiGrpcV1003.TaskOptions(_value.options)
      : undefined;
    this.createdAt = _value.createdAt
      ? new googleProtobuf002.Timestamp(_value.createdAt)
      : undefined;
    this.cancelledAt = _value.cancelledAt
      ? new googleProtobuf002.Timestamp(_value.cancelledAt)
      : undefined;
    SessionRaw.refineValues(this);
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get status(): armonikApiGrpcV1Session_status004.SessionStatus | undefined {
    return this._status;
  }
  set status(
    value: armonikApiGrpcV1Session_status004.SessionStatus | undefined
  ) {
    this._status = value;
  }
  get partitionIds(): string[] | undefined {
    return this._partitionIds;
  }
  set partitionIds(value: string[] | undefined) {
    this._partitionIds = value;
  }
  get options(): armonikApiGrpcV1003.TaskOptions | undefined {
    return this._options;
  }
  set options(value: armonikApiGrpcV1003.TaskOptions | undefined) {
    this._options = value;
  }
  get createdAt(): googleProtobuf002.Timestamp | undefined {
    return this._createdAt;
  }
  set createdAt(value: googleProtobuf002.Timestamp | undefined) {
    this._createdAt = value;
  }
  get cancelledAt(): googleProtobuf002.Timestamp | undefined {
    return this._cancelledAt;
  }
  set cancelledAt(value: googleProtobuf002.Timestamp | undefined) {
    this._cancelledAt = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionRaw.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionRaw.AsObject {
    return {
      sessionId: this.sessionId,
      status: this.status,
      partitionIds: (this.partitionIds || []).slice(),
      options: this.options ? this.options.toObject() : undefined,
      createdAt: this.createdAt ? this.createdAt.toObject() : undefined,
      cancelledAt: this.cancelledAt ? this.cancelledAt.toObject() : undefined
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
  ): SessionRaw.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      status:
        armonikApiGrpcV1Session_status004.SessionStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      partitionIds: (this.partitionIds || []).slice(),
      options: this.options ? this.options.toProtobufJSON(options) : null,
      createdAt: this.createdAt ? this.createdAt.toProtobufJSON(options) : null,
      cancelledAt: this.cancelledAt
        ? this.cancelledAt.toProtobufJSON(options)
        : null
    };
  }
}
export module SessionRaw {
  /**
   * Standard JavaScript object representation for SessionRaw
   */
  export interface AsObject {
    sessionId?: string;
    status?: armonikApiGrpcV1Session_status004.SessionStatus;
    partitionIds?: string[];
    options?: armonikApiGrpcV1003.TaskOptions.AsObject;
    createdAt?: googleProtobuf002.Timestamp.AsObject;
    cancelledAt?: googleProtobuf002.Timestamp.AsObject;
  }

  /**
   * Protobuf JSON representation for SessionRaw
   */
  export interface AsProtobufJSON {
    sessionId?: string;
    status?: string;
    partitionIds?: string[];
    options?: armonikApiGrpcV1003.TaskOptions.AsProtobufJSON | null;
    createdAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    cancelledAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.sessions.SessionSummary
 */
export class SessionSummary implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.SessionSummary';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionSummary();
    SessionSummary.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionSummary) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.status = _instance.status || 0;
    _instance.createdAt = _instance.createdAt || undefined;
    _instance.cancelledAt = _instance.cancelledAt || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionSummary,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          _instance.status = _reader.readEnum();
          break;
        case 3:
          _instance.createdAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.createdAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.cancelledAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.cancelledAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    SessionSummary.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SessionSummary,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.status) {
      _writer.writeEnum(2, _instance.status);
    }
    if (_instance.createdAt) {
      _writer.writeMessage(
        3,
        _instance.createdAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.cancelledAt) {
      _writer.writeMessage(
        4,
        _instance.cancelledAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
  }

  private _sessionId?: string;
  private _status?: armonikApiGrpcV1Session_status004.SessionStatus;
  private _createdAt?: googleProtobuf002.Timestamp;
  private _cancelledAt?: googleProtobuf002.Timestamp;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionSummary to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionSummary.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.status = _value.status;
    this.createdAt = _value.createdAt
      ? new googleProtobuf002.Timestamp(_value.createdAt)
      : undefined;
    this.cancelledAt = _value.cancelledAt
      ? new googleProtobuf002.Timestamp(_value.cancelledAt)
      : undefined;
    SessionSummary.refineValues(this);
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get status(): armonikApiGrpcV1Session_status004.SessionStatus | undefined {
    return this._status;
  }
  set status(
    value: armonikApiGrpcV1Session_status004.SessionStatus | undefined
  ) {
    this._status = value;
  }
  get createdAt(): googleProtobuf002.Timestamp | undefined {
    return this._createdAt;
  }
  set createdAt(value: googleProtobuf002.Timestamp | undefined) {
    this._createdAt = value;
  }
  get cancelledAt(): googleProtobuf002.Timestamp | undefined {
    return this._cancelledAt;
  }
  set cancelledAt(value: googleProtobuf002.Timestamp | undefined) {
    this._cancelledAt = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionSummary.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionSummary.AsObject {
    return {
      sessionId: this.sessionId,
      status: this.status,
      createdAt: this.createdAt ? this.createdAt.toObject() : undefined,
      cancelledAt: this.cancelledAt ? this.cancelledAt.toObject() : undefined
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
  ): SessionSummary.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      status:
        armonikApiGrpcV1Session_status004.SessionStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      createdAt: this.createdAt ? this.createdAt.toProtobufJSON(options) : null,
      cancelledAt: this.cancelledAt
        ? this.cancelledAt.toProtobufJSON(options)
        : null
    };
  }
}
export module SessionSummary {
  /**
   * Standard JavaScript object representation for SessionSummary
   */
  export interface AsObject {
    sessionId?: string;
    status?: armonikApiGrpcV1Session_status004.SessionStatus;
    createdAt?: googleProtobuf002.Timestamp.AsObject;
    cancelledAt?: googleProtobuf002.Timestamp.AsObject;
  }

  /**
   * Protobuf JSON representation for SessionSummary
   */
  export interface AsProtobufJSON {
    sessionId?: string;
    status?: string;
    createdAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    cancelledAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.sessions.ListSessionsRequest
 */
export class ListSessionsRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.ListSessionsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListSessionsRequest();
    ListSessionsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListSessionsRequest) {
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
    _instance: ListSessionsRequest,
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
          _instance.filter = new ListSessionsRequest.Filter();
          _reader.readMessage(
            _instance.filter,
            ListSessionsRequest.Filter.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.sort = new ListSessionsRequest.Sort();
          _reader.readMessage(
            _instance.sort,
            ListSessionsRequest.Sort.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ListSessionsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListSessionsRequest,
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
        ListSessionsRequest.Filter.serializeBinaryToWriter
      );
    }
    if (_instance.sort) {
      _writer.writeMessage(
        4,
        _instance.sort as any,
        ListSessionsRequest.Sort.serializeBinaryToWriter
      );
    }
  }

  private _page?: number;
  private _pageSize?: number;
  private _filter?: ListSessionsRequest.Filter;
  private _sort?: ListSessionsRequest.Sort;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListSessionsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListSessionsRequest.AsObject>) {
    _value = _value || {};
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.filter = _value.filter
      ? new ListSessionsRequest.Filter(_value.filter)
      : undefined;
    this.sort = _value.sort
      ? new ListSessionsRequest.Sort(_value.sort)
      : undefined;
    ListSessionsRequest.refineValues(this);
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
  get filter(): ListSessionsRequest.Filter | undefined {
    return this._filter;
  }
  set filter(value: ListSessionsRequest.Filter | undefined) {
    this._filter = value;
  }
  get sort(): ListSessionsRequest.Sort | undefined {
    return this._sort;
  }
  set sort(value: ListSessionsRequest.Sort | undefined) {
    this._sort = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListSessionsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListSessionsRequest.AsObject {
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
  ): ListSessionsRequest.AsProtobufJSON {
    return {
      page: this.page,
      pageSize: this.pageSize,
      filter: this.filter ? this.filter.toProtobufJSON(options) : null,
      sort: this.sort ? this.sort.toProtobufJSON(options) : null
    };
  }
}
export module ListSessionsRequest {
  /**
   * Standard JavaScript object representation for ListSessionsRequest
   */
  export interface AsObject {
    page?: number;
    pageSize?: number;
    filter?: ListSessionsRequest.Filter.AsObject;
    sort?: ListSessionsRequest.Sort.AsObject;
  }

  /**
   * Protobuf JSON representation for ListSessionsRequest
   */
  export interface AsProtobufJSON {
    page?: number;
    pageSize?: number;
    filter?: ListSessionsRequest.Filter.AsProtobufJSON | null;
    sort?: ListSessionsRequest.Sort.AsProtobufJSON | null;
  }
  export enum OrderByField {
    ORDER_BY_FIELD_UNSPECIFIED = 0,
    ORDER_BY_FIELD_SESSION_ID = 1,
    ORDER_BY_FIELD_STATUS = 2,
    ORDER_BY_FIELD_CREATED_AT = 3,
    ORDER_BY_FIELD_CANCELLED_AT = 4
  }
  export enum OrderDirection {
    ORDER_DIRECTION_UNSPECIFIED = 0,
    ORDER_DIRECTION_ASC = 1,
    ORDER_DIRECTION_DESC = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.sessions.ListSessionsRequest.Filter
   */
  export class Filter implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.sessions.ListSessionsRequest.Filter';

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
      _instance.applicationName = _instance.applicationName || '';
      _instance.applicationVersion = _instance.applicationVersion || '';
      _instance.sessionId = _instance.sessionId || '';
      _instance.createdAfter = _instance.createdAfter || undefined;
      _instance.createdBefore = _instance.createdBefore || undefined;
      _instance.cancelledAfter = _instance.cancelledAfter || undefined;
      _instance.cancelledBefore = _instance.cancelledBefore || undefined;
      _instance.status = _instance.status || 0;
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
            _instance.applicationName = _reader.readString();
            break;
          case 2:
            _instance.applicationVersion = _reader.readString();
            break;
          case 3:
            _instance.sessionId = _reader.readString();
            break;
          case 4:
            _instance.createdAfter = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.createdAfter,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 5:
            _instance.createdBefore = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.createdBefore,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 6:
            _instance.cancelledAfter = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.cancelledAfter,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 7:
            _instance.cancelledBefore = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.cancelledBefore,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 8:
            _instance.status = _reader.readEnum();
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
      if (_instance.applicationName) {
        _writer.writeString(1, _instance.applicationName);
      }
      if (_instance.applicationVersion) {
        _writer.writeString(2, _instance.applicationVersion);
      }
      if (_instance.sessionId) {
        _writer.writeString(3, _instance.sessionId);
      }
      if (_instance.createdAfter) {
        _writer.writeMessage(
          4,
          _instance.createdAfter as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.createdBefore) {
        _writer.writeMessage(
          5,
          _instance.createdBefore as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.cancelledAfter) {
        _writer.writeMessage(
          6,
          _instance.cancelledAfter as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.cancelledBefore) {
        _writer.writeMessage(
          7,
          _instance.cancelledBefore as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.status) {
        _writer.writeEnum(8, _instance.status);
      }
    }

    private _applicationName?: string;
    private _applicationVersion?: string;
    private _sessionId?: string;
    private _createdAfter?: googleProtobuf002.Timestamp;
    private _createdBefore?: googleProtobuf002.Timestamp;
    private _cancelledAfter?: googleProtobuf002.Timestamp;
    private _cancelledBefore?: googleProtobuf002.Timestamp;
    private _status?: armonikApiGrpcV1Session_status004.SessionStatus;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Filter to deeply clone from
     */
    constructor(_value?: RecursivePartial<Filter.AsObject>) {
      _value = _value || {};
      this.applicationName = _value.applicationName;
      this.applicationVersion = _value.applicationVersion;
      this.sessionId = _value.sessionId;
      this.createdAfter = _value.createdAfter
        ? new googleProtobuf002.Timestamp(_value.createdAfter)
        : undefined;
      this.createdBefore = _value.createdBefore
        ? new googleProtobuf002.Timestamp(_value.createdBefore)
        : undefined;
      this.cancelledAfter = _value.cancelledAfter
        ? new googleProtobuf002.Timestamp(_value.cancelledAfter)
        : undefined;
      this.cancelledBefore = _value.cancelledBefore
        ? new googleProtobuf002.Timestamp(_value.cancelledBefore)
        : undefined;
      this.status = _value.status;
      Filter.refineValues(this);
    }
    get applicationName(): string | undefined {
      return this._applicationName;
    }
    set applicationName(value: string | undefined) {
      this._applicationName = value;
    }
    get applicationVersion(): string | undefined {
      return this._applicationVersion;
    }
    set applicationVersion(value: string | undefined) {
      this._applicationVersion = value;
    }
    get sessionId(): string | undefined {
      return this._sessionId;
    }
    set sessionId(value: string | undefined) {
      this._sessionId = value;
    }
    get createdAfter(): googleProtobuf002.Timestamp | undefined {
      return this._createdAfter;
    }
    set createdAfter(value: googleProtobuf002.Timestamp | undefined) {
      this._createdAfter = value;
    }
    get createdBefore(): googleProtobuf002.Timestamp | undefined {
      return this._createdBefore;
    }
    set createdBefore(value: googleProtobuf002.Timestamp | undefined) {
      this._createdBefore = value;
    }
    get cancelledAfter(): googleProtobuf002.Timestamp | undefined {
      return this._cancelledAfter;
    }
    set cancelledAfter(value: googleProtobuf002.Timestamp | undefined) {
      this._cancelledAfter = value;
    }
    get cancelledBefore(): googleProtobuf002.Timestamp | undefined {
      return this._cancelledBefore;
    }
    set cancelledBefore(value: googleProtobuf002.Timestamp | undefined) {
      this._cancelledBefore = value;
    }
    get status(): armonikApiGrpcV1Session_status004.SessionStatus | undefined {
      return this._status;
    }
    set status(
      value: armonikApiGrpcV1Session_status004.SessionStatus | undefined
    ) {
      this._status = value;
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
        applicationName: this.applicationName,
        applicationVersion: this.applicationVersion,
        sessionId: this.sessionId,
        createdAfter: this.createdAfter
          ? this.createdAfter.toObject()
          : undefined,
        createdBefore: this.createdBefore
          ? this.createdBefore.toObject()
          : undefined,
        cancelledAfter: this.cancelledAfter
          ? this.cancelledAfter.toObject()
          : undefined,
        cancelledBefore: this.cancelledBefore
          ? this.cancelledBefore.toObject()
          : undefined,
        status: this.status
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
        applicationName: this.applicationName,
        applicationVersion: this.applicationVersion,
        sessionId: this.sessionId,
        createdAfter: this.createdAfter
          ? this.createdAfter.toProtobufJSON(options)
          : null,
        createdBefore: this.createdBefore
          ? this.createdBefore.toProtobufJSON(options)
          : null,
        cancelledAfter: this.cancelledAfter
          ? this.cancelledAfter.toProtobufJSON(options)
          : null,
        cancelledBefore: this.cancelledBefore
          ? this.cancelledBefore.toProtobufJSON(options)
          : null,
        status:
          armonikApiGrpcV1Session_status004.SessionStatus[
            this.status === null || this.status === undefined ? 0 : this.status
          ]
      };
    }
  }
  export module Filter {
    /**
     * Standard JavaScript object representation for Filter
     */
    export interface AsObject {
      applicationName?: string;
      applicationVersion?: string;
      sessionId?: string;
      createdAfter?: googleProtobuf002.Timestamp.AsObject;
      createdBefore?: googleProtobuf002.Timestamp.AsObject;
      cancelledAfter?: googleProtobuf002.Timestamp.AsObject;
      cancelledBefore?: googleProtobuf002.Timestamp.AsObject;
      status?: armonikApiGrpcV1Session_status004.SessionStatus;
    }

    /**
     * Protobuf JSON representation for Filter
     */
    export interface AsProtobufJSON {
      applicationName?: string;
      applicationVersion?: string;
      sessionId?: string;
      createdAfter?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      createdBefore?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      cancelledAfter?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      cancelledBefore?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      status?: string;
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.sessions.ListSessionsRequest.Sort
   */
  export class Sort implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.sessions.ListSessionsRequest.Sort';

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

    private _field?: ListSessionsRequest.OrderByField;
    private _direction?: ListSessionsRequest.OrderDirection;

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
    get field(): ListSessionsRequest.OrderByField | undefined {
      return this._field;
    }
    set field(value: ListSessionsRequest.OrderByField | undefined) {
      this._field = value;
    }
    get direction(): ListSessionsRequest.OrderDirection | undefined {
      return this._direction;
    }
    set direction(value: ListSessionsRequest.OrderDirection | undefined) {
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
          ListSessionsRequest.OrderByField[
            this.field === null || this.field === undefined ? 0 : this.field
          ],
        direction:
          ListSessionsRequest.OrderDirection[
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
      field?: ListSessionsRequest.OrderByField;
      direction?: ListSessionsRequest.OrderDirection;
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
 * Message implementation for armonik.api.grpc.v1.sessions.ListSessionsResponse
 */
export class ListSessionsResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.ListSessionsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListSessionsResponse();
    ListSessionsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListSessionsResponse) {
    _instance.sessions = _instance.sessions || [];
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
    _instance: ListSessionsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new SessionSummary();
          _reader.readMessage(
            messageInitializer1,
            SessionSummary.deserializeBinaryFromReader
          );
          (_instance.sessions = _instance.sessions || []).push(
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

    ListSessionsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListSessionsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.sessions && _instance.sessions.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.sessions as any,
        SessionSummary.serializeBinaryToWriter
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

  private _sessions?: SessionSummary[];
  private _page?: number;
  private _pageSize?: number;
  private _total?: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListSessionsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListSessionsResponse.AsObject>) {
    _value = _value || {};
    this.sessions = (_value.sessions || []).map(m => new SessionSummary(m));
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.total = _value.total;
    ListSessionsResponse.refineValues(this);
  }
  get sessions(): SessionSummary[] | undefined {
    return this._sessions;
  }
  set sessions(value: SessionSummary[] | undefined) {
    this._sessions = value;
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
    ListSessionsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListSessionsResponse.AsObject {
    return {
      sessions: (this.sessions || []).map(m => m.toObject()),
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
  ): ListSessionsResponse.AsProtobufJSON {
    return {
      sessions: (this.sessions || []).map(m => m.toProtobufJSON(options)),
      page: this.page,
      pageSize: this.pageSize,
      total: this.total
    };
  }
}
export module ListSessionsResponse {
  /**
   * Standard JavaScript object representation for ListSessionsResponse
   */
  export interface AsObject {
    sessions?: SessionSummary.AsObject[];
    page?: number;
    pageSize?: number;
    total?: number;
  }

  /**
   * Protobuf JSON representation for ListSessionsResponse
   */
  export interface AsProtobufJSON {
    sessions?: SessionSummary.AsProtobufJSON[] | null;
    page?: number;
    pageSize?: number;
    total?: number;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.sessions.GetSessionRequest
 */
export class GetSessionRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.GetSessionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetSessionRequest();
    GetSessionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetSessionRequest) {
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetSessionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetSessionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetSessionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
  }

  private _sessionId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetSessionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetSessionRequest.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    GetSessionRequest.refineValues(this);
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
    GetSessionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetSessionRequest.AsObject {
    return {
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
  ): GetSessionRequest.AsProtobufJSON {
    return {
      sessionId: this.sessionId
    };
  }
}
export module GetSessionRequest {
  /**
   * Standard JavaScript object representation for GetSessionRequest
   */
  export interface AsObject {
    sessionId?: string;
  }

  /**
   * Protobuf JSON representation for GetSessionRequest
   */
  export interface AsProtobufJSON {
    sessionId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.sessions.GetSessionResponse
 */
export class GetSessionResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.GetSessionResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetSessionResponse();
    GetSessionResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetSessionResponse) {
    _instance.session = _instance.session || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetSessionResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.session = new SessionRaw();
          _reader.readMessage(
            _instance.session,
            SessionRaw.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetSessionResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetSessionResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.session) {
      _writer.writeMessage(
        1,
        _instance.session as any,
        SessionRaw.serializeBinaryToWriter
      );
    }
  }

  private _session?: SessionRaw;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetSessionResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetSessionResponse.AsObject>) {
    _value = _value || {};
    this.session = _value.session ? new SessionRaw(_value.session) : undefined;
    GetSessionResponse.refineValues(this);
  }
  get session(): SessionRaw | undefined {
    return this._session;
  }
  set session(value: SessionRaw | undefined) {
    this._session = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetSessionResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetSessionResponse.AsObject {
    return {
      session: this.session ? this.session.toObject() : undefined
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
  ): GetSessionResponse.AsProtobufJSON {
    return {
      session: this.session ? this.session.toProtobufJSON(options) : null
    };
  }
}
export module GetSessionResponse {
  /**
   * Standard JavaScript object representation for GetSessionResponse
   */
  export interface AsObject {
    session?: SessionRaw.AsObject;
  }

  /**
   * Protobuf JSON representation for GetSessionResponse
   */
  export interface AsProtobufJSON {
    session?: SessionRaw.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.sessions.CancelSessionRequest
 */
export class CancelSessionRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.CancelSessionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CancelSessionRequest();
    CancelSessionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CancelSessionRequest) {
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CancelSessionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    CancelSessionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CancelSessionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
  }

  private _sessionId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CancelSessionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CancelSessionRequest.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    CancelSessionRequest.refineValues(this);
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
    CancelSessionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CancelSessionRequest.AsObject {
    return {
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
  ): CancelSessionRequest.AsProtobufJSON {
    return {
      sessionId: this.sessionId
    };
  }
}
export module CancelSessionRequest {
  /**
   * Standard JavaScript object representation for CancelSessionRequest
   */
  export interface AsObject {
    sessionId?: string;
  }

  /**
   * Protobuf JSON representation for CancelSessionRequest
   */
  export interface AsProtobufJSON {
    sessionId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.sessions.CancelSessionResponse
 */
export class CancelSessionResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.sessions.CancelSessionResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CancelSessionResponse();
    CancelSessionResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CancelSessionResponse) {
    _instance.session = _instance.session || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CancelSessionResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.session = new SessionRaw();
          _reader.readMessage(
            _instance.session,
            SessionRaw.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CancelSessionResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CancelSessionResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.session) {
      _writer.writeMessage(
        1,
        _instance.session as any,
        SessionRaw.serializeBinaryToWriter
      );
    }
  }

  private _session?: SessionRaw;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CancelSessionResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<CancelSessionResponse.AsObject>) {
    _value = _value || {};
    this.session = _value.session ? new SessionRaw(_value.session) : undefined;
    CancelSessionResponse.refineValues(this);
  }
  get session(): SessionRaw | undefined {
    return this._session;
  }
  set session(value: SessionRaw | undefined) {
    this._session = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CancelSessionResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CancelSessionResponse.AsObject {
    return {
      session: this.session ? this.session.toObject() : undefined
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
  ): CancelSessionResponse.AsProtobufJSON {
    return {
      session: this.session ? this.session.toProtobufJSON(options) : null
    };
  }
}
export module CancelSessionResponse {
  /**
   * Standard JavaScript object representation for CancelSessionResponse
   */
  export interface AsObject {
    session?: SessionRaw.AsObject;
  }

  /**
   * Protobuf JSON representation for CancelSessionResponse
   */
  export interface AsProtobufJSON {
    session?: SessionRaw.AsProtobufJSON | null;
  }
}
