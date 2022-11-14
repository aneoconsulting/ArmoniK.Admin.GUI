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
import * as armonikApiGrpcV1002 from './objects.pb';
import * as armonikApiGrpcV1Result_status003 from './result-status.pb';
import * as armonikApiGrpcV1Session_status004 from './session-status.pb';
/**
 * Message implementation for armonik.api.grpc.v1.submitter.SessionList
 */
export class SessionList implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.SessionList';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionList();
    SessionList.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionList) {
    _instance.sessions = _instance.sessions || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionList,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new armonikApiGrpcV1002.Session();
          _reader.readMessage(
            messageInitializer1,
            armonikApiGrpcV1002.Session.deserializeBinaryFromReader
          );
          (_instance.sessions = _instance.sessions || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    SessionList.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SessionList,
    _writer: BinaryWriter
  ) {
    if (_instance.sessions && _instance.sessions.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.sessions as any,
        armonikApiGrpcV1002.Session.serializeBinaryToWriter
      );
    }
  }

  private _sessions?: armonikApiGrpcV1002.Session[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionList to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionList.AsObject>) {
    _value = _value || {};
    this.sessions = (_value.sessions || []).map(
      m => new armonikApiGrpcV1002.Session(m)
    );
    SessionList.refineValues(this);
  }
  get sessions(): armonikApiGrpcV1002.Session[] | undefined {
    return this._sessions;
  }
  set sessions(value: armonikApiGrpcV1002.Session[] | undefined) {
    this._sessions = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionList.AsObject {
    return {
      sessions: (this.sessions || []).map(m => m.toObject())
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
  ): SessionList.AsProtobufJSON {
    return {
      sessions: (this.sessions || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module SessionList {
  /**
   * Standard JavaScript object representation for SessionList
   */
  export interface AsObject {
    sessions?: armonikApiGrpcV1002.Session.AsObject[];
  }

  /**
   * Protobuf JSON representation for SessionList
   */
  export interface AsProtobufJSON {
    sessions?: armonikApiGrpcV1002.Session.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.SessionIdList
 */
export class SessionIdList implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.SessionIdList';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionIdList();
    SessionIdList.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionIdList) {
    _instance.sessionIds = _instance.sessionIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionIdList,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.sessionIds = _instance.sessionIds || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    SessionIdList.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SessionIdList,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionIds && _instance.sessionIds.length) {
      _writer.writeRepeatedString(1, _instance.sessionIds);
    }
  }

  private _sessionIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionIdList to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionIdList.AsObject>) {
    _value = _value || {};
    this.sessionIds = (_value.sessionIds || []).slice();
    SessionIdList.refineValues(this);
  }
  get sessionIds(): string[] | undefined {
    return this._sessionIds;
  }
  set sessionIds(value: string[] | undefined) {
    this._sessionIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionIdList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionIdList.AsObject {
    return {
      sessionIds: (this.sessionIds || []).slice()
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
  ): SessionIdList.AsProtobufJSON {
    return {
      sessionIds: (this.sessionIds || []).slice()
    };
  }
}
export module SessionIdList {
  /**
   * Standard JavaScript object representation for SessionIdList
   */
  export interface AsObject {
    sessionIds?: string[];
  }

  /**
   * Protobuf JSON representation for SessionIdList
   */
  export interface AsProtobufJSON {
    sessionIds?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.CreateSessionRequest
 */
export class CreateSessionRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.CreateSessionRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateSessionRequest();
    CreateSessionRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateSessionRequest) {
    _instance.defaultTaskOption = _instance.defaultTaskOption || undefined;
    _instance.partitionIds = _instance.partitionIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateSessionRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.defaultTaskOption = new armonikApiGrpcV1002.TaskOptions();
          _reader.readMessage(
            _instance.defaultTaskOption,
            armonikApiGrpcV1002.TaskOptions.deserializeBinaryFromReader
          );
          break;
        case 2:
          (_instance.partitionIds = _instance.partitionIds || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateSessionRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateSessionRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.defaultTaskOption) {
      _writer.writeMessage(
        1,
        _instance.defaultTaskOption as any,
        armonikApiGrpcV1002.TaskOptions.serializeBinaryToWriter
      );
    }
    if (_instance.partitionIds && _instance.partitionIds.length) {
      _writer.writeRepeatedString(2, _instance.partitionIds);
    }
  }

  private _defaultTaskOption?: armonikApiGrpcV1002.TaskOptions;
  private _partitionIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateSessionRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateSessionRequest.AsObject>) {
    _value = _value || {};
    this.defaultTaskOption = _value.defaultTaskOption
      ? new armonikApiGrpcV1002.TaskOptions(_value.defaultTaskOption)
      : undefined;
    this.partitionIds = (_value.partitionIds || []).slice();
    CreateSessionRequest.refineValues(this);
  }
  get defaultTaskOption(): armonikApiGrpcV1002.TaskOptions | undefined {
    return this._defaultTaskOption;
  }
  set defaultTaskOption(value: armonikApiGrpcV1002.TaskOptions | undefined) {
    this._defaultTaskOption = value;
  }
  get partitionIds(): string[] | undefined {
    return this._partitionIds;
  }
  set partitionIds(value: string[] | undefined) {
    this._partitionIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateSessionRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateSessionRequest.AsObject {
    return {
      defaultTaskOption: this.defaultTaskOption
        ? this.defaultTaskOption.toObject()
        : undefined,
      partitionIds: (this.partitionIds || []).slice()
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
  ): CreateSessionRequest.AsProtobufJSON {
    return {
      defaultTaskOption: this.defaultTaskOption
        ? this.defaultTaskOption.toProtobufJSON(options)
        : null,
      partitionIds: (this.partitionIds || []).slice()
    };
  }
}
export module CreateSessionRequest {
  /**
   * Standard JavaScript object representation for CreateSessionRequest
   */
  export interface AsObject {
    defaultTaskOption?: armonikApiGrpcV1002.TaskOptions.AsObject;
    partitionIds?: string[];
  }

  /**
   * Protobuf JSON representation for CreateSessionRequest
   */
  export interface AsProtobufJSON {
    defaultTaskOption?: armonikApiGrpcV1002.TaskOptions.AsProtobufJSON | null;
    partitionIds?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.CreateSessionReply
 */
export class CreateSessionReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.CreateSessionReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateSessionReply();
    CreateSessionReply.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateSessionReply) {
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateSessionReply,
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

    CreateSessionReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateSessionReply,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
  }

  private _sessionId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateSessionReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateSessionReply.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    CreateSessionReply.refineValues(this);
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
    CreateSessionReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateSessionReply.AsObject {
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
  ): CreateSessionReply.AsProtobufJSON {
    return {
      sessionId: this.sessionId
    };
  }
}
export module CreateSessionReply {
  /**
   * Standard JavaScript object representation for CreateSessionReply
   */
  export interface AsObject {
    sessionId?: string;
  }

  /**
   * Protobuf JSON representation for CreateSessionReply
   */
  export interface AsProtobufJSON {
    sessionId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.CreateSmallTaskRequest
 */
export class CreateSmallTaskRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.CreateSmallTaskRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateSmallTaskRequest();
    CreateSmallTaskRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateSmallTaskRequest) {
    _instance.sessionId = _instance.sessionId || '';
    _instance.taskOptions = _instance.taskOptions || undefined;
    _instance.taskRequests = _instance.taskRequests || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateSmallTaskRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.sessionId = _reader.readString();
          break;
        case 2:
          _instance.taskOptions = new armonikApiGrpcV1002.TaskOptions();
          _reader.readMessage(
            _instance.taskOptions,
            armonikApiGrpcV1002.TaskOptions.deserializeBinaryFromReader
          );
          break;
        case 3:
          const messageInitializer3 = new armonikApiGrpcV1002.TaskRequest();
          _reader.readMessage(
            messageInitializer3,
            armonikApiGrpcV1002.TaskRequest.deserializeBinaryFromReader
          );
          (_instance.taskRequests = _instance.taskRequests || []).push(
            messageInitializer3
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateSmallTaskRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateSmallTaskRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.sessionId) {
      _writer.writeString(1, _instance.sessionId);
    }
    if (_instance.taskOptions) {
      _writer.writeMessage(
        2,
        _instance.taskOptions as any,
        armonikApiGrpcV1002.TaskOptions.serializeBinaryToWriter
      );
    }
    if (_instance.taskRequests && _instance.taskRequests.length) {
      _writer.writeRepeatedMessage(
        3,
        _instance.taskRequests as any,
        armonikApiGrpcV1002.TaskRequest.serializeBinaryToWriter
      );
    }
  }

  private _sessionId?: string;
  private _taskOptions?: armonikApiGrpcV1002.TaskOptions;
  private _taskRequests?: armonikApiGrpcV1002.TaskRequest[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateSmallTaskRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateSmallTaskRequest.AsObject>) {
    _value = _value || {};
    this.sessionId = _value.sessionId;
    this.taskOptions = _value.taskOptions
      ? new armonikApiGrpcV1002.TaskOptions(_value.taskOptions)
      : undefined;
    this.taskRequests = (_value.taskRequests || []).map(
      m => new armonikApiGrpcV1002.TaskRequest(m)
    );
    CreateSmallTaskRequest.refineValues(this);
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get taskOptions(): armonikApiGrpcV1002.TaskOptions | undefined {
    return this._taskOptions;
  }
  set taskOptions(value: armonikApiGrpcV1002.TaskOptions | undefined) {
    this._taskOptions = value;
  }
  get taskRequests(): armonikApiGrpcV1002.TaskRequest[] | undefined {
    return this._taskRequests;
  }
  set taskRequests(value: armonikApiGrpcV1002.TaskRequest[] | undefined) {
    this._taskRequests = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateSmallTaskRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateSmallTaskRequest.AsObject {
    return {
      sessionId: this.sessionId,
      taskOptions: this.taskOptions ? this.taskOptions.toObject() : undefined,
      taskRequests: (this.taskRequests || []).map(m => m.toObject())
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
  ): CreateSmallTaskRequest.AsProtobufJSON {
    return {
      sessionId: this.sessionId,
      taskOptions: this.taskOptions
        ? this.taskOptions.toProtobufJSON(options)
        : null,
      taskRequests: (this.taskRequests || []).map(m =>
        m.toProtobufJSON(options)
      )
    };
  }
}
export module CreateSmallTaskRequest {
  /**
   * Standard JavaScript object representation for CreateSmallTaskRequest
   */
  export interface AsObject {
    sessionId?: string;
    taskOptions?: armonikApiGrpcV1002.TaskOptions.AsObject;
    taskRequests?: armonikApiGrpcV1002.TaskRequest.AsObject[];
  }

  /**
   * Protobuf JSON representation for CreateSmallTaskRequest
   */
  export interface AsProtobufJSON {
    sessionId?: string;
    taskOptions?: armonikApiGrpcV1002.TaskOptions.AsProtobufJSON | null;
    taskRequests?: armonikApiGrpcV1002.TaskRequest.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.CreateLargeTaskRequest
 */
export class CreateLargeTaskRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.CreateLargeTaskRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateLargeTaskRequest();
    CreateLargeTaskRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateLargeTaskRequest) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateLargeTaskRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.initRequest = new CreateLargeTaskRequest.InitRequest();
          _reader.readMessage(
            _instance.initRequest,
            CreateLargeTaskRequest.InitRequest.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.initTask = new armonikApiGrpcV1002.InitTaskRequest();
          _reader.readMessage(
            _instance.initTask,
            armonikApiGrpcV1002.InitTaskRequest.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.taskPayload = new armonikApiGrpcV1002.DataChunk();
          _reader.readMessage(
            _instance.taskPayload,
            armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    CreateLargeTaskRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateLargeTaskRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.initRequest) {
      _writer.writeMessage(
        1,
        _instance.initRequest as any,
        CreateLargeTaskRequest.InitRequest.serializeBinaryToWriter
      );
    }
    if (_instance.initTask) {
      _writer.writeMessage(
        2,
        _instance.initTask as any,
        armonikApiGrpcV1002.InitTaskRequest.serializeBinaryToWriter
      );
    }
    if (_instance.taskPayload) {
      _writer.writeMessage(
        3,
        _instance.taskPayload as any,
        armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
      );
    }
  }

  private _initRequest?: CreateLargeTaskRequest.InitRequest;
  private _initTask?: armonikApiGrpcV1002.InitTaskRequest;
  private _taskPayload?: armonikApiGrpcV1002.DataChunk;

  private _type: CreateLargeTaskRequest.TypeCase =
    CreateLargeTaskRequest.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateLargeTaskRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateLargeTaskRequest.AsObject>) {
    _value = _value || {};
    this.initRequest = _value.initRequest
      ? new CreateLargeTaskRequest.InitRequest(_value.initRequest)
      : undefined;
    this.initTask = _value.initTask
      ? new armonikApiGrpcV1002.InitTaskRequest(_value.initTask)
      : undefined;
    this.taskPayload = _value.taskPayload
      ? new armonikApiGrpcV1002.DataChunk(_value.taskPayload)
      : undefined;
    CreateLargeTaskRequest.refineValues(this);
  }
  get initRequest(): CreateLargeTaskRequest.InitRequest | undefined {
    return this._initRequest;
  }
  set initRequest(value: CreateLargeTaskRequest.InitRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._initTask = this._taskPayload = undefined;
      this._type = CreateLargeTaskRequest.TypeCase.initRequest;
    }
    this._initRequest = value;
  }
  get initTask(): armonikApiGrpcV1002.InitTaskRequest | undefined {
    return this._initTask;
  }
  set initTask(value: armonikApiGrpcV1002.InitTaskRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._initRequest = this._taskPayload = undefined;
      this._type = CreateLargeTaskRequest.TypeCase.initTask;
    }
    this._initTask = value;
  }
  get taskPayload(): armonikApiGrpcV1002.DataChunk | undefined {
    return this._taskPayload;
  }
  set taskPayload(value: armonikApiGrpcV1002.DataChunk | undefined) {
    if (value !== undefined && value !== null) {
      this._initRequest = this._initTask = undefined;
      this._type = CreateLargeTaskRequest.TypeCase.taskPayload;
    }
    this._taskPayload = value;
  }
  get type() {
    return this._type;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateLargeTaskRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateLargeTaskRequest.AsObject {
    return {
      initRequest: this.initRequest ? this.initRequest.toObject() : undefined,
      initTask: this.initTask ? this.initTask.toObject() : undefined,
      taskPayload: this.taskPayload ? this.taskPayload.toObject() : undefined
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
  ): CreateLargeTaskRequest.AsProtobufJSON {
    return {
      initRequest: this.initRequest
        ? this.initRequest.toProtobufJSON(options)
        : null,
      initTask: this.initTask ? this.initTask.toProtobufJSON(options) : null,
      taskPayload: this.taskPayload
        ? this.taskPayload.toProtobufJSON(options)
        : null
    };
  }
}
export module CreateLargeTaskRequest {
  /**
   * Standard JavaScript object representation for CreateLargeTaskRequest
   */
  export interface AsObject {
    initRequest?: CreateLargeTaskRequest.InitRequest.AsObject;
    initTask?: armonikApiGrpcV1002.InitTaskRequest.AsObject;
    taskPayload?: armonikApiGrpcV1002.DataChunk.AsObject;
  }

  /**
   * Protobuf JSON representation for CreateLargeTaskRequest
   */
  export interface AsProtobufJSON {
    initRequest?: CreateLargeTaskRequest.InitRequest.AsProtobufJSON | null;
    initTask?: armonikApiGrpcV1002.InitTaskRequest.AsProtobufJSON | null;
    taskPayload?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
  }
  export enum TypeCase {
    none = 0,
    initRequest = 1,
    initTask = 2,
    taskPayload = 3
  }
  /**
   * Message implementation for armonik.api.grpc.v1.submitter.CreateLargeTaskRequest.InitRequest
   */
  export class InitRequest implements GrpcMessage {
    static id =
      'armonik.api.grpc.v1.submitter.CreateLargeTaskRequest.InitRequest';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new InitRequest();
      InitRequest.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: InitRequest) {
      _instance.sessionId = _instance.sessionId || '';
      _instance.taskOptions = _instance.taskOptions || undefined;
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: InitRequest,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.sessionId = _reader.readString();
            break;
          case 2:
            _instance.taskOptions = new armonikApiGrpcV1002.TaskOptions();
            _reader.readMessage(
              _instance.taskOptions,
              armonikApiGrpcV1002.TaskOptions.deserializeBinaryFromReader
            );
            break;
          default:
            _reader.skipField();
        }
      }

      InitRequest.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: InitRequest,
      _writer: BinaryWriter
    ) {
      if (_instance.sessionId) {
        _writer.writeString(1, _instance.sessionId);
      }
      if (_instance.taskOptions) {
        _writer.writeMessage(
          2,
          _instance.taskOptions as any,
          armonikApiGrpcV1002.TaskOptions.serializeBinaryToWriter
        );
      }
    }

    private _sessionId?: string;
    private _taskOptions?: armonikApiGrpcV1002.TaskOptions;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of InitRequest to deeply clone from
     */
    constructor(_value?: RecursivePartial<InitRequest.AsObject>) {
      _value = _value || {};
      this.sessionId = _value.sessionId;
      this.taskOptions = _value.taskOptions
        ? new armonikApiGrpcV1002.TaskOptions(_value.taskOptions)
        : undefined;
      InitRequest.refineValues(this);
    }
    get sessionId(): string | undefined {
      return this._sessionId;
    }
    set sessionId(value: string | undefined) {
      this._sessionId = value;
    }
    get taskOptions(): armonikApiGrpcV1002.TaskOptions | undefined {
      return this._taskOptions;
    }
    set taskOptions(value: armonikApiGrpcV1002.TaskOptions | undefined) {
      this._taskOptions = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      InitRequest.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): InitRequest.AsObject {
      return {
        sessionId: this.sessionId,
        taskOptions: this.taskOptions ? this.taskOptions.toObject() : undefined
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
    ): InitRequest.AsProtobufJSON {
      return {
        sessionId: this.sessionId,
        taskOptions: this.taskOptions
          ? this.taskOptions.toProtobufJSON(options)
          : null
      };
    }
  }
  export module InitRequest {
    /**
     * Standard JavaScript object representation for InitRequest
     */
    export interface AsObject {
      sessionId?: string;
      taskOptions?: armonikApiGrpcV1002.TaskOptions.AsObject;
    }

    /**
     * Protobuf JSON representation for InitRequest
     */
    export interface AsProtobufJSON {
      sessionId?: string;
      taskOptions?: armonikApiGrpcV1002.TaskOptions.AsProtobufJSON | null;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.CreateTaskReply
 */
export class CreateTaskReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.CreateTaskReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateTaskReply();
    CreateTaskReply.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateTaskReply) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateTaskReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.creationStatusList = new CreateTaskReply.CreationStatusList();
          _reader.readMessage(
            _instance.creationStatusList,
            CreateTaskReply.CreationStatusList.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.error = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    CreateTaskReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateTaskReply,
    _writer: BinaryWriter
  ) {
    if (_instance.creationStatusList) {
      _writer.writeMessage(
        1,
        _instance.creationStatusList as any,
        CreateTaskReply.CreationStatusList.serializeBinaryToWriter
      );
    }
    if (_instance.error || _instance.error === '') {
      _writer.writeString(2, _instance.error);
    }
  }

  private _creationStatusList?: CreateTaskReply.CreationStatusList;
  private _error?: string;

  private _response: CreateTaskReply.ResponseCase =
    CreateTaskReply.ResponseCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateTaskReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateTaskReply.AsObject>) {
    _value = _value || {};
    this.creationStatusList = _value.creationStatusList
      ? new CreateTaskReply.CreationStatusList(_value.creationStatusList)
      : undefined;
    this.error = _value.error;
    CreateTaskReply.refineValues(this);
  }
  get creationStatusList(): CreateTaskReply.CreationStatusList | undefined {
    return this._creationStatusList;
  }
  set creationStatusList(
    value: CreateTaskReply.CreationStatusList | undefined
  ) {
    if (value !== undefined && value !== null) {
      this._error = undefined;
      this._response = CreateTaskReply.ResponseCase.creationStatusList;
    }
    this._creationStatusList = value;
  }
  get error(): string | undefined {
    return this._error;
  }
  set error(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._creationStatusList = undefined;
      this._response = CreateTaskReply.ResponseCase.error;
    }
    this._error = value;
  }
  get response() {
    return this._response;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CreateTaskReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateTaskReply.AsObject {
    return {
      creationStatusList: this.creationStatusList
        ? this.creationStatusList.toObject()
        : undefined,
      error: this.error
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
  ): CreateTaskReply.AsProtobufJSON {
    return {
      creationStatusList: this.creationStatusList
        ? this.creationStatusList.toProtobufJSON(options)
        : null,
      error: this.error === null || this.error === undefined ? null : this.error
    };
  }
}
export module CreateTaskReply {
  /**
   * Standard JavaScript object representation for CreateTaskReply
   */
  export interface AsObject {
    creationStatusList?: CreateTaskReply.CreationStatusList.AsObject;
    error?: string;
  }

  /**
   * Protobuf JSON representation for CreateTaskReply
   */
  export interface AsProtobufJSON {
    creationStatusList?: CreateTaskReply.CreationStatusList.AsProtobufJSON | null;
    error?: string | null;
  }
  export enum ResponseCase {
    none = 0,
    creationStatusList = 1,
    error = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.submitter.CreateTaskReply.TaskInfo
   */
  export class TaskInfo implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.CreateTaskReply.TaskInfo';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new TaskInfo();
      TaskInfo.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: TaskInfo) {
      _instance.taskId = _instance.taskId || '';
      _instance.expectedOutputKeys = _instance.expectedOutputKeys || [];
      _instance.dataDependencies = _instance.dataDependencies || [];
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: TaskInfo,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.taskId = _reader.readString();
            break;
          case 2:
            (_instance.expectedOutputKeys =
              _instance.expectedOutputKeys || []).push(_reader.readString());
            break;
          case 3:
            (_instance.dataDependencies =
              _instance.dataDependencies || []).push(_reader.readString());
            break;
          default:
            _reader.skipField();
        }
      }

      TaskInfo.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: TaskInfo, _writer: BinaryWriter) {
      if (_instance.taskId) {
        _writer.writeString(1, _instance.taskId);
      }
      if (_instance.expectedOutputKeys && _instance.expectedOutputKeys.length) {
        _writer.writeRepeatedString(2, _instance.expectedOutputKeys);
      }
      if (_instance.dataDependencies && _instance.dataDependencies.length) {
        _writer.writeRepeatedString(3, _instance.dataDependencies);
      }
    }

    private _taskId?: string;
    private _expectedOutputKeys?: string[];
    private _dataDependencies?: string[];

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of TaskInfo to deeply clone from
     */
    constructor(_value?: RecursivePartial<TaskInfo.AsObject>) {
      _value = _value || {};
      this.taskId = _value.taskId;
      this.expectedOutputKeys = (_value.expectedOutputKeys || []).slice();
      this.dataDependencies = (_value.dataDependencies || []).slice();
      TaskInfo.refineValues(this);
    }
    get taskId(): string | undefined {
      return this._taskId;
    }
    set taskId(value: string | undefined) {
      this._taskId = value;
    }
    get expectedOutputKeys(): string[] | undefined {
      return this._expectedOutputKeys;
    }
    set expectedOutputKeys(value: string[] | undefined) {
      this._expectedOutputKeys = value;
    }
    get dataDependencies(): string[] | undefined {
      return this._dataDependencies;
    }
    set dataDependencies(value: string[] | undefined) {
      this._dataDependencies = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      TaskInfo.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): TaskInfo.AsObject {
      return {
        taskId: this.taskId,
        expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
        dataDependencies: (this.dataDependencies || []).slice()
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
    ): TaskInfo.AsProtobufJSON {
      return {
        taskId: this.taskId,
        expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
        dataDependencies: (this.dataDependencies || []).slice()
      };
    }
  }
  export module TaskInfo {
    /**
     * Standard JavaScript object representation for TaskInfo
     */
    export interface AsObject {
      taskId?: string;
      expectedOutputKeys?: string[];
      dataDependencies?: string[];
    }

    /**
     * Protobuf JSON representation for TaskInfo
     */
    export interface AsProtobufJSON {
      taskId?: string;
      expectedOutputKeys?: string[];
      dataDependencies?: string[];
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.submitter.CreateTaskReply.CreationStatus
   */
  export class CreationStatus implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.CreateTaskReply.CreationStatus';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new CreationStatus();
      CreationStatus.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: CreationStatus) {}

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: CreationStatus,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.taskInfo = new CreateTaskReply.TaskInfo();
            _reader.readMessage(
              _instance.taskInfo,
              CreateTaskReply.TaskInfo.deserializeBinaryFromReader
            );
            break;
          case 2:
            _instance.error = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      CreationStatus.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: CreationStatus,
      _writer: BinaryWriter
    ) {
      if (_instance.taskInfo) {
        _writer.writeMessage(
          1,
          _instance.taskInfo as any,
          CreateTaskReply.TaskInfo.serializeBinaryToWriter
        );
      }
      if (_instance.error || _instance.error === '') {
        _writer.writeString(2, _instance.error);
      }
    }

    private _taskInfo?: CreateTaskReply.TaskInfo;
    private _error?: string;

    private _status: CreationStatus.StatusCase = CreationStatus.StatusCase.none;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of CreationStatus to deeply clone from
     */
    constructor(_value?: RecursivePartial<CreationStatus.AsObject>) {
      _value = _value || {};
      this.taskInfo = _value.taskInfo
        ? new CreateTaskReply.TaskInfo(_value.taskInfo)
        : undefined;
      this.error = _value.error;
      CreationStatus.refineValues(this);
    }
    get taskInfo(): CreateTaskReply.TaskInfo | undefined {
      return this._taskInfo;
    }
    set taskInfo(value: CreateTaskReply.TaskInfo | undefined) {
      if (value !== undefined && value !== null) {
        this._error = undefined;
        this._status = CreationStatus.StatusCase.taskInfo;
      }
      this._taskInfo = value;
    }
    get error(): string | undefined {
      return this._error;
    }
    set error(value: string | undefined) {
      if (value !== undefined && value !== null) {
        this._taskInfo = undefined;
        this._status = CreationStatus.StatusCase.error;
      }
      this._error = value;
    }
    get status() {
      return this._status;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      CreationStatus.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): CreationStatus.AsObject {
      return {
        taskInfo: this.taskInfo ? this.taskInfo.toObject() : undefined,
        error: this.error
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
    ): CreationStatus.AsProtobufJSON {
      return {
        taskInfo: this.taskInfo ? this.taskInfo.toProtobufJSON(options) : null,
        error:
          this.error === null || this.error === undefined ? null : this.error
      };
    }
  }
  export module CreationStatus {
    /**
     * Standard JavaScript object representation for CreationStatus
     */
    export interface AsObject {
      taskInfo?: CreateTaskReply.TaskInfo.AsObject;
      error?: string;
    }

    /**
     * Protobuf JSON representation for CreationStatus
     */
    export interface AsProtobufJSON {
      taskInfo?: CreateTaskReply.TaskInfo.AsProtobufJSON | null;
      error?: string | null;
    }
    export enum StatusCase {
      none = 0,
      taskInfo = 1,
      error = 2
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.submitter.CreateTaskReply.CreationStatusList
   */
  export class CreationStatusList implements GrpcMessage {
    static id =
      'armonik.api.grpc.v1.submitter.CreateTaskReply.CreationStatusList';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new CreationStatusList();
      CreationStatusList.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: CreationStatusList) {
      _instance.creationStatuses = _instance.creationStatuses || [];
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: CreationStatusList,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            const messageInitializer1 = new CreateTaskReply.CreationStatus();
            _reader.readMessage(
              messageInitializer1,
              CreateTaskReply.CreationStatus.deserializeBinaryFromReader
            );
            (_instance.creationStatuses =
              _instance.creationStatuses || []).push(messageInitializer1);
            break;
          default:
            _reader.skipField();
        }
      }

      CreationStatusList.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: CreationStatusList,
      _writer: BinaryWriter
    ) {
      if (_instance.creationStatuses && _instance.creationStatuses.length) {
        _writer.writeRepeatedMessage(
          1,
          _instance.creationStatuses as any,
          CreateTaskReply.CreationStatus.serializeBinaryToWriter
        );
      }
    }

    private _creationStatuses?: CreateTaskReply.CreationStatus[];

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of CreationStatusList to deeply clone from
     */
    constructor(_value?: RecursivePartial<CreationStatusList.AsObject>) {
      _value = _value || {};
      this.creationStatuses = (_value.creationStatuses || []).map(
        m => new CreateTaskReply.CreationStatus(m)
      );
      CreationStatusList.refineValues(this);
    }
    get creationStatuses(): CreateTaskReply.CreationStatus[] | undefined {
      return this._creationStatuses;
    }
    set creationStatuses(value: CreateTaskReply.CreationStatus[] | undefined) {
      this._creationStatuses = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      CreationStatusList.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): CreationStatusList.AsObject {
      return {
        creationStatuses: (this.creationStatuses || []).map(m => m.toObject())
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
    ): CreationStatusList.AsProtobufJSON {
      return {
        creationStatuses: (this.creationStatuses || []).map(m =>
          m.toProtobufJSON(options)
        )
      };
    }
  }
  export module CreationStatusList {
    /**
     * Standard JavaScript object representation for CreationStatusList
     */
    export interface AsObject {
      creationStatuses?: CreateTaskReply.CreationStatus.AsObject[];
    }

    /**
     * Protobuf JSON representation for CreationStatusList
     */
    export interface AsProtobufJSON {
      creationStatuses?: CreateTaskReply.CreationStatus.AsProtobufJSON[] | null;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.TaskFilter
 */
export class TaskFilter implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.TaskFilter';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskFilter();
    TaskFilter.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskFilter) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskFilter,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.session = new TaskFilter.IdsRequest();
          _reader.readMessage(
            _instance.session,
            TaskFilter.IdsRequest.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.task = new TaskFilter.IdsRequest();
          _reader.readMessage(
            _instance.task,
            TaskFilter.IdsRequest.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.included = new TaskFilter.StatusesRequest();
          _reader.readMessage(
            _instance.included,
            TaskFilter.StatusesRequest.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.excluded = new TaskFilter.StatusesRequest();
          _reader.readMessage(
            _instance.excluded,
            TaskFilter.StatusesRequest.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    TaskFilter.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: TaskFilter, _writer: BinaryWriter) {
    if (_instance.session) {
      _writer.writeMessage(
        1,
        _instance.session as any,
        TaskFilter.IdsRequest.serializeBinaryToWriter
      );
    }
    if (_instance.task) {
      _writer.writeMessage(
        3,
        _instance.task as any,
        TaskFilter.IdsRequest.serializeBinaryToWriter
      );
    }
    if (_instance.included) {
      _writer.writeMessage(
        4,
        _instance.included as any,
        TaskFilter.StatusesRequest.serializeBinaryToWriter
      );
    }
    if (_instance.excluded) {
      _writer.writeMessage(
        5,
        _instance.excluded as any,
        TaskFilter.StatusesRequest.serializeBinaryToWriter
      );
    }
  }

  private _session?: TaskFilter.IdsRequest;
  private _task?: TaskFilter.IdsRequest;
  private _included?: TaskFilter.StatusesRequest;
  private _excluded?: TaskFilter.StatusesRequest;

  private _ids: TaskFilter.IdsCase = TaskFilter.IdsCase.none;
  private _statuses: TaskFilter.StatusesCase = TaskFilter.StatusesCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskFilter to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskFilter.AsObject>) {
    _value = _value || {};
    this.session = _value.session
      ? new TaskFilter.IdsRequest(_value.session)
      : undefined;
    this.task = _value.task
      ? new TaskFilter.IdsRequest(_value.task)
      : undefined;
    this.included = _value.included
      ? new TaskFilter.StatusesRequest(_value.included)
      : undefined;
    this.excluded = _value.excluded
      ? new TaskFilter.StatusesRequest(_value.excluded)
      : undefined;
    TaskFilter.refineValues(this);
  }
  get session(): TaskFilter.IdsRequest | undefined {
    return this._session;
  }
  set session(value: TaskFilter.IdsRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._task = undefined;
      this._ids = TaskFilter.IdsCase.session;
    }
    this._session = value;
  }
  get task(): TaskFilter.IdsRequest | undefined {
    return this._task;
  }
  set task(value: TaskFilter.IdsRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._session = undefined;
      this._ids = TaskFilter.IdsCase.task;
    }
    this._task = value;
  }
  get included(): TaskFilter.StatusesRequest | undefined {
    return this._included;
  }
  set included(value: TaskFilter.StatusesRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._excluded = undefined;
      this._statuses = TaskFilter.StatusesCase.included;
    }
    this._included = value;
  }
  get excluded(): TaskFilter.StatusesRequest | undefined {
    return this._excluded;
  }
  set excluded(value: TaskFilter.StatusesRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._included = undefined;
      this._statuses = TaskFilter.StatusesCase.excluded;
    }
    this._excluded = value;
  }
  get ids() {
    return this._ids;
  }
  get statuses() {
    return this._statuses;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskFilter.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskFilter.AsObject {
    return {
      session: this.session ? this.session.toObject() : undefined,
      task: this.task ? this.task.toObject() : undefined,
      included: this.included ? this.included.toObject() : undefined,
      excluded: this.excluded ? this.excluded.toObject() : undefined
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
  ): TaskFilter.AsProtobufJSON {
    return {
      session: this.session ? this.session.toProtobufJSON(options) : null,
      task: this.task ? this.task.toProtobufJSON(options) : null,
      included: this.included ? this.included.toProtobufJSON(options) : null,
      excluded: this.excluded ? this.excluded.toProtobufJSON(options) : null
    };
  }
}
export module TaskFilter {
  /**
   * Standard JavaScript object representation for TaskFilter
   */
  export interface AsObject {
    session?: TaskFilter.IdsRequest.AsObject;
    task?: TaskFilter.IdsRequest.AsObject;
    included?: TaskFilter.StatusesRequest.AsObject;
    excluded?: TaskFilter.StatusesRequest.AsObject;
  }

  /**
   * Protobuf JSON representation for TaskFilter
   */
  export interface AsProtobufJSON {
    session?: TaskFilter.IdsRequest.AsProtobufJSON | null;
    task?: TaskFilter.IdsRequest.AsProtobufJSON | null;
    included?: TaskFilter.StatusesRequest.AsProtobufJSON | null;
    excluded?: TaskFilter.StatusesRequest.AsProtobufJSON | null;
  }
  export enum IdsCase {
    none = 0,
    session = 1,
    task = 2
  }
  export enum StatusesCase {
    none = 0,
    included = 1,
    excluded = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.submitter.TaskFilter.IdsRequest
   */
  export class IdsRequest implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.TaskFilter.IdsRequest';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new IdsRequest();
      IdsRequest.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: IdsRequest) {
      _instance.ids = _instance.ids || [];
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: IdsRequest,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            (_instance.ids = _instance.ids || []).push(_reader.readString());
            break;
          default:
            _reader.skipField();
        }
      }

      IdsRequest.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: IdsRequest,
      _writer: BinaryWriter
    ) {
      if (_instance.ids && _instance.ids.length) {
        _writer.writeRepeatedString(1, _instance.ids);
      }
    }

    private _ids?: string[];

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of IdsRequest to deeply clone from
     */
    constructor(_value?: RecursivePartial<IdsRequest.AsObject>) {
      _value = _value || {};
      this.ids = (_value.ids || []).slice();
      IdsRequest.refineValues(this);
    }
    get ids(): string[] | undefined {
      return this._ids;
    }
    set ids(value: string[] | undefined) {
      this._ids = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      IdsRequest.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): IdsRequest.AsObject {
      return {
        ids: (this.ids || []).slice()
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
    ): IdsRequest.AsProtobufJSON {
      return {
        ids: (this.ids || []).slice()
      };
    }
  }
  export module IdsRequest {
    /**
     * Standard JavaScript object representation for IdsRequest
     */
    export interface AsObject {
      ids?: string[];
    }

    /**
     * Protobuf JSON representation for IdsRequest
     */
    export interface AsProtobufJSON {
      ids?: string[];
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.submitter.TaskFilter.StatusesRequest
   */
  export class StatusesRequest implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.TaskFilter.StatusesRequest';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new StatusesRequest();
      StatusesRequest.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: StatusesRequest) {
      _instance.statuses = _instance.statuses || [];
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: StatusesRequest,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            (_instance.statuses = _instance.statuses || []).push(
              ...(_reader.readPackedEnum() || [])
            );
            break;
          default:
            _reader.skipField();
        }
      }

      StatusesRequest.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: StatusesRequest,
      _writer: BinaryWriter
    ) {
      if (_instance.statuses && _instance.statuses.length) {
        _writer.writePackedEnum(1, _instance.statuses);
      }
    }

    private _statuses?: armonikApiGrpcV1Task_status001.TaskStatus[];

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of StatusesRequest to deeply clone from
     */
    constructor(_value?: RecursivePartial<StatusesRequest.AsObject>) {
      _value = _value || {};
      this.statuses = (_value.statuses || []).slice();
      StatusesRequest.refineValues(this);
    }
    get statuses(): armonikApiGrpcV1Task_status001.TaskStatus[] | undefined {
      return this._statuses;
    }
    set statuses(
      value: armonikApiGrpcV1Task_status001.TaskStatus[] | undefined
    ) {
      this._statuses = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      StatusesRequest.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): StatusesRequest.AsObject {
      return {
        statuses: (this.statuses || []).slice()
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
    ): StatusesRequest.AsProtobufJSON {
      return {
        statuses: (this.statuses || []).map(
          v => armonikApiGrpcV1Task_status001.TaskStatus[v]
        )
      };
    }
  }
  export module StatusesRequest {
    /**
     * Standard JavaScript object representation for StatusesRequest
     */
    export interface AsObject {
      statuses?: armonikApiGrpcV1Task_status001.TaskStatus[];
    }

    /**
     * Protobuf JSON representation for StatusesRequest
     */
    export interface AsProtobufJSON {
      statuses?: string[];
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.SessionFilter
 */
export class SessionFilter implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.SessionFilter';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SessionFilter();
    SessionFilter.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SessionFilter) {
    _instance.sessions = _instance.sessions || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SessionFilter,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.sessions = _instance.sessions || []).push(
            _reader.readString()
          );
          break;
        case 4:
          _instance.included = new SessionFilter.StatusesRequest();
          _reader.readMessage(
            _instance.included,
            SessionFilter.StatusesRequest.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.excluded = new SessionFilter.StatusesRequest();
          _reader.readMessage(
            _instance.excluded,
            SessionFilter.StatusesRequest.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    SessionFilter.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SessionFilter,
    _writer: BinaryWriter
  ) {
    if (_instance.sessions && _instance.sessions.length) {
      _writer.writeRepeatedString(1, _instance.sessions);
    }
    if (_instance.included) {
      _writer.writeMessage(
        4,
        _instance.included as any,
        SessionFilter.StatusesRequest.serializeBinaryToWriter
      );
    }
    if (_instance.excluded) {
      _writer.writeMessage(
        5,
        _instance.excluded as any,
        SessionFilter.StatusesRequest.serializeBinaryToWriter
      );
    }
  }

  private _sessions?: string[];
  private _included?: SessionFilter.StatusesRequest;
  private _excluded?: SessionFilter.StatusesRequest;

  private _statuses: SessionFilter.StatusesCase =
    SessionFilter.StatusesCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SessionFilter to deeply clone from
   */
  constructor(_value?: RecursivePartial<SessionFilter.AsObject>) {
    _value = _value || {};
    this.sessions = (_value.sessions || []).slice();
    this.included = _value.included
      ? new SessionFilter.StatusesRequest(_value.included)
      : undefined;
    this.excluded = _value.excluded
      ? new SessionFilter.StatusesRequest(_value.excluded)
      : undefined;
    SessionFilter.refineValues(this);
  }
  get sessions(): string[] | undefined {
    return this._sessions;
  }
  set sessions(value: string[] | undefined) {
    this._sessions = value;
  }
  get included(): SessionFilter.StatusesRequest | undefined {
    return this._included;
  }
  set included(value: SessionFilter.StatusesRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._excluded = undefined;
      this._statuses = SessionFilter.StatusesCase.included;
    }
    this._included = value;
  }
  get excluded(): SessionFilter.StatusesRequest | undefined {
    return this._excluded;
  }
  set excluded(value: SessionFilter.StatusesRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._included = undefined;
      this._statuses = SessionFilter.StatusesCase.excluded;
    }
    this._excluded = value;
  }
  get statuses() {
    return this._statuses;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SessionFilter.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SessionFilter.AsObject {
    return {
      sessions: (this.sessions || []).slice(),
      included: this.included ? this.included.toObject() : undefined,
      excluded: this.excluded ? this.excluded.toObject() : undefined
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
  ): SessionFilter.AsProtobufJSON {
    return {
      sessions: (this.sessions || []).slice(),
      included: this.included ? this.included.toProtobufJSON(options) : null,
      excluded: this.excluded ? this.excluded.toProtobufJSON(options) : null
    };
  }
}
export module SessionFilter {
  /**
   * Standard JavaScript object representation for SessionFilter
   */
  export interface AsObject {
    sessions?: string[];
    included?: SessionFilter.StatusesRequest.AsObject;
    excluded?: SessionFilter.StatusesRequest.AsObject;
  }

  /**
   * Protobuf JSON representation for SessionFilter
   */
  export interface AsProtobufJSON {
    sessions?: string[];
    included?: SessionFilter.StatusesRequest.AsProtobufJSON | null;
    excluded?: SessionFilter.StatusesRequest.AsProtobufJSON | null;
  }
  export enum StatusesCase {
    none = 0,
    included = 1,
    excluded = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.submitter.SessionFilter.StatusesRequest
   */
  export class StatusesRequest implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.SessionFilter.StatusesRequest';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new StatusesRequest();
      StatusesRequest.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: StatusesRequest) {
      _instance.statuses = _instance.statuses || [];
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: StatusesRequest,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            (_instance.statuses = _instance.statuses || []).push(
              ...(_reader.readPackedEnum() || [])
            );
            break;
          default:
            _reader.skipField();
        }
      }

      StatusesRequest.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: StatusesRequest,
      _writer: BinaryWriter
    ) {
      if (_instance.statuses && _instance.statuses.length) {
        _writer.writePackedEnum(1, _instance.statuses);
      }
    }

    private _statuses?: armonikApiGrpcV1Session_status004.SessionStatus[];

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of StatusesRequest to deeply clone from
     */
    constructor(_value?: RecursivePartial<StatusesRequest.AsObject>) {
      _value = _value || {};
      this.statuses = (_value.statuses || []).slice();
      StatusesRequest.refineValues(this);
    }
    get statuses():
      | armonikApiGrpcV1Session_status004.SessionStatus[]
      | undefined {
      return this._statuses;
    }
    set statuses(
      value: armonikApiGrpcV1Session_status004.SessionStatus[] | undefined
    ) {
      this._statuses = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      StatusesRequest.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): StatusesRequest.AsObject {
      return {
        statuses: (this.statuses || []).slice()
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
    ): StatusesRequest.AsProtobufJSON {
      return {
        statuses: (this.statuses || []).map(
          v => armonikApiGrpcV1Session_status004.SessionStatus[v]
        )
      };
    }
  }
  export module StatusesRequest {
    /**
     * Standard JavaScript object representation for StatusesRequest
     */
    export interface AsObject {
      statuses?: armonikApiGrpcV1Session_status004.SessionStatus[];
    }

    /**
     * Protobuf JSON representation for StatusesRequest
     */
    export interface AsProtobufJSON {
      statuses?: string[];
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.GetTaskStatusRequest
 */
export class GetTaskStatusRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.GetTaskStatusRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetTaskStatusRequest();
    GetTaskStatusRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetTaskStatusRequest) {
    _instance.taskIds = _instance.taskIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetTaskStatusRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.taskIds = _instance.taskIds || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetTaskStatusRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetTaskStatusRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.taskIds && _instance.taskIds.length) {
      _writer.writeRepeatedString(1, _instance.taskIds);
    }
  }

  private _taskIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetTaskStatusRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetTaskStatusRequest.AsObject>) {
    _value = _value || {};
    this.taskIds = (_value.taskIds || []).slice();
    GetTaskStatusRequest.refineValues(this);
  }
  get taskIds(): string[] | undefined {
    return this._taskIds;
  }
  set taskIds(value: string[] | undefined) {
    this._taskIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetTaskStatusRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetTaskStatusRequest.AsObject {
    return {
      taskIds: (this.taskIds || []).slice()
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
  ): GetTaskStatusRequest.AsProtobufJSON {
    return {
      taskIds: (this.taskIds || []).slice()
    };
  }
}
export module GetTaskStatusRequest {
  /**
   * Standard JavaScript object representation for GetTaskStatusRequest
   */
  export interface AsObject {
    taskIds?: string[];
  }

  /**
   * Protobuf JSON representation for GetTaskStatusRequest
   */
  export interface AsProtobufJSON {
    taskIds?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.GetTaskStatusReply
 */
export class GetTaskStatusReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.GetTaskStatusReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetTaskStatusReply();
    GetTaskStatusReply.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetTaskStatusReply) {
    _instance.idStatuses = _instance.idStatuses || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetTaskStatusReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new GetTaskStatusReply.IdStatus();
          _reader.readMessage(
            messageInitializer1,
            GetTaskStatusReply.IdStatus.deserializeBinaryFromReader
          );
          (_instance.idStatuses = _instance.idStatuses || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetTaskStatusReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetTaskStatusReply,
    _writer: BinaryWriter
  ) {
    if (_instance.idStatuses && _instance.idStatuses.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.idStatuses as any,
        GetTaskStatusReply.IdStatus.serializeBinaryToWriter
      );
    }
  }

  private _idStatuses?: GetTaskStatusReply.IdStatus[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetTaskStatusReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetTaskStatusReply.AsObject>) {
    _value = _value || {};
    this.idStatuses = (_value.idStatuses || []).map(
      m => new GetTaskStatusReply.IdStatus(m)
    );
    GetTaskStatusReply.refineValues(this);
  }
  get idStatuses(): GetTaskStatusReply.IdStatus[] | undefined {
    return this._idStatuses;
  }
  set idStatuses(value: GetTaskStatusReply.IdStatus[] | undefined) {
    this._idStatuses = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetTaskStatusReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetTaskStatusReply.AsObject {
    return {
      idStatuses: (this.idStatuses || []).map(m => m.toObject())
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
  ): GetTaskStatusReply.AsProtobufJSON {
    return {
      idStatuses: (this.idStatuses || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module GetTaskStatusReply {
  /**
   * Standard JavaScript object representation for GetTaskStatusReply
   */
  export interface AsObject {
    idStatuses?: GetTaskStatusReply.IdStatus.AsObject[];
  }

  /**
   * Protobuf JSON representation for GetTaskStatusReply
   */
  export interface AsProtobufJSON {
    idStatuses?: GetTaskStatusReply.IdStatus.AsProtobufJSON[] | null;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.submitter.GetTaskStatusReply.IdStatus
   */
  export class IdStatus implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.GetTaskStatusReply.IdStatus';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new IdStatus();
      IdStatus.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: IdStatus) {
      _instance.taskId = _instance.taskId || '';
      _instance.status = _instance.status || 0;
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: IdStatus,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.taskId = _reader.readString();
            break;
          case 2:
            _instance.status = _reader.readEnum();
            break;
          default:
            _reader.skipField();
        }
      }

      IdStatus.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: IdStatus, _writer: BinaryWriter) {
      if (_instance.taskId) {
        _writer.writeString(1, _instance.taskId);
      }
      if (_instance.status) {
        _writer.writeEnum(2, _instance.status);
      }
    }

    private _taskId?: string;
    private _status?: armonikApiGrpcV1Task_status001.TaskStatus;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of IdStatus to deeply clone from
     */
    constructor(_value?: RecursivePartial<IdStatus.AsObject>) {
      _value = _value || {};
      this.taskId = _value.taskId;
      this.status = _value.status;
      IdStatus.refineValues(this);
    }
    get taskId(): string | undefined {
      return this._taskId;
    }
    set taskId(value: string | undefined) {
      this._taskId = value;
    }
    get status(): armonikApiGrpcV1Task_status001.TaskStatus | undefined {
      return this._status;
    }
    set status(value: armonikApiGrpcV1Task_status001.TaskStatus | undefined) {
      this._status = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      IdStatus.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): IdStatus.AsObject {
      return {
        taskId: this.taskId,
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
    ): IdStatus.AsProtobufJSON {
      return {
        taskId: this.taskId,
        status:
          armonikApiGrpcV1Task_status001.TaskStatus[
            this.status === null || this.status === undefined ? 0 : this.status
          ]
      };
    }
  }
  export module IdStatus {
    /**
     * Standard JavaScript object representation for IdStatus
     */
    export interface AsObject {
      taskId?: string;
      status?: armonikApiGrpcV1Task_status001.TaskStatus;
    }

    /**
     * Protobuf JSON representation for IdStatus
     */
    export interface AsProtobufJSON {
      taskId?: string;
      status?: string;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.GetResultStatusRequest
 */
export class GetResultStatusRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.GetResultStatusRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetResultStatusRequest();
    GetResultStatusRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetResultStatusRequest) {
    _instance.resultIds = _instance.resultIds || [];
    _instance.sessionId = _instance.sessionId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetResultStatusRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.resultIds = _instance.resultIds || []).push(
            _reader.readString()
          );
          break;
        case 2:
          _instance.sessionId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetResultStatusRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetResultStatusRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.resultIds && _instance.resultIds.length) {
      _writer.writeRepeatedString(1, _instance.resultIds);
    }
    if (_instance.sessionId) {
      _writer.writeString(2, _instance.sessionId);
    }
  }

  private _resultIds?: string[];
  private _sessionId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetResultStatusRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetResultStatusRequest.AsObject>) {
    _value = _value || {};
    this.resultIds = (_value.resultIds || []).slice();
    this.sessionId = _value.sessionId;
    GetResultStatusRequest.refineValues(this);
  }
  get resultIds(): string[] | undefined {
    return this._resultIds;
  }
  set resultIds(value: string[] | undefined) {
    this._resultIds = value;
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
    GetResultStatusRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetResultStatusRequest.AsObject {
    return {
      resultIds: (this.resultIds || []).slice(),
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
  ): GetResultStatusRequest.AsProtobufJSON {
    return {
      resultIds: (this.resultIds || []).slice(),
      sessionId: this.sessionId
    };
  }
}
export module GetResultStatusRequest {
  /**
   * Standard JavaScript object representation for GetResultStatusRequest
   */
  export interface AsObject {
    resultIds?: string[];
    sessionId?: string;
  }

  /**
   * Protobuf JSON representation for GetResultStatusRequest
   */
  export interface AsProtobufJSON {
    resultIds?: string[];
    sessionId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.GetResultStatusReply
 */
export class GetResultStatusReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.GetResultStatusReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetResultStatusReply();
    GetResultStatusReply.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetResultStatusReply) {
    _instance.idStatuses = _instance.idStatuses || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetResultStatusReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new GetResultStatusReply.IdStatus();
          _reader.readMessage(
            messageInitializer1,
            GetResultStatusReply.IdStatus.deserializeBinaryFromReader
          );
          (_instance.idStatuses = _instance.idStatuses || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetResultStatusReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetResultStatusReply,
    _writer: BinaryWriter
  ) {
    if (_instance.idStatuses && _instance.idStatuses.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.idStatuses as any,
        GetResultStatusReply.IdStatus.serializeBinaryToWriter
      );
    }
  }

  private _idStatuses?: GetResultStatusReply.IdStatus[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetResultStatusReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetResultStatusReply.AsObject>) {
    _value = _value || {};
    this.idStatuses = (_value.idStatuses || []).map(
      m => new GetResultStatusReply.IdStatus(m)
    );
    GetResultStatusReply.refineValues(this);
  }
  get idStatuses(): GetResultStatusReply.IdStatus[] | undefined {
    return this._idStatuses;
  }
  set idStatuses(value: GetResultStatusReply.IdStatus[] | undefined) {
    this._idStatuses = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetResultStatusReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetResultStatusReply.AsObject {
    return {
      idStatuses: (this.idStatuses || []).map(m => m.toObject())
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
  ): GetResultStatusReply.AsProtobufJSON {
    return {
      idStatuses: (this.idStatuses || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module GetResultStatusReply {
  /**
   * Standard JavaScript object representation for GetResultStatusReply
   */
  export interface AsObject {
    idStatuses?: GetResultStatusReply.IdStatus.AsObject[];
  }

  /**
   * Protobuf JSON representation for GetResultStatusReply
   */
  export interface AsProtobufJSON {
    idStatuses?: GetResultStatusReply.IdStatus.AsProtobufJSON[] | null;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.submitter.GetResultStatusReply.IdStatus
   */
  export class IdStatus implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.submitter.GetResultStatusReply.IdStatus';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new IdStatus();
      IdStatus.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: IdStatus) {
      _instance.resultId = _instance.resultId || '';
      _instance.status = _instance.status || 0;
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: IdStatus,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.resultId = _reader.readString();
            break;
          case 2:
            _instance.status = _reader.readEnum();
            break;
          default:
            _reader.skipField();
        }
      }

      IdStatus.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: IdStatus, _writer: BinaryWriter) {
      if (_instance.resultId) {
        _writer.writeString(1, _instance.resultId);
      }
      if (_instance.status) {
        _writer.writeEnum(2, _instance.status);
      }
    }

    private _resultId?: string;
    private _status?: armonikApiGrpcV1Result_status003.ResultStatus;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of IdStatus to deeply clone from
     */
    constructor(_value?: RecursivePartial<IdStatus.AsObject>) {
      _value = _value || {};
      this.resultId = _value.resultId;
      this.status = _value.status;
      IdStatus.refineValues(this);
    }
    get resultId(): string | undefined {
      return this._resultId;
    }
    set resultId(value: string | undefined) {
      this._resultId = value;
    }
    get status(): armonikApiGrpcV1Result_status003.ResultStatus | undefined {
      return this._status;
    }
    set status(
      value: armonikApiGrpcV1Result_status003.ResultStatus | undefined
    ) {
      this._status = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      IdStatus.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): IdStatus.AsObject {
      return {
        resultId: this.resultId,
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
    ): IdStatus.AsProtobufJSON {
      return {
        resultId: this.resultId,
        status:
          armonikApiGrpcV1Result_status003.ResultStatus[
            this.status === null || this.status === undefined ? 0 : this.status
          ]
      };
    }
  }
  export module IdStatus {
    /**
     * Standard JavaScript object representation for IdStatus
     */
    export interface AsObject {
      resultId?: string;
      status?: armonikApiGrpcV1Result_status003.ResultStatus;
    }

    /**
     * Protobuf JSON representation for IdStatus
     */
    export interface AsProtobufJSON {
      resultId?: string;
      status?: string;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.ResultReply
 */
export class ResultReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.ResultReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ResultReply();
    ResultReply.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ResultReply) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ResultReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.result = new armonikApiGrpcV1002.DataChunk();
          _reader.readMessage(
            _instance.result,
            armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.error = new armonikApiGrpcV1002.TaskError();
          _reader.readMessage(
            _instance.error,
            armonikApiGrpcV1002.TaskError.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.notCompletedTask = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ResultReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ResultReply,
    _writer: BinaryWriter
  ) {
    if (_instance.result) {
      _writer.writeMessage(
        1,
        _instance.result as any,
        armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
      );
    }
    if (_instance.error) {
      _writer.writeMessage(
        2,
        _instance.error as any,
        armonikApiGrpcV1002.TaskError.serializeBinaryToWriter
      );
    }
    if (_instance.notCompletedTask || _instance.notCompletedTask === '') {
      _writer.writeString(3, _instance.notCompletedTask);
    }
  }

  private _result?: armonikApiGrpcV1002.DataChunk;
  private _error?: armonikApiGrpcV1002.TaskError;
  private _notCompletedTask?: string;

  private _type: ResultReply.TypeCase = ResultReply.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ResultReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<ResultReply.AsObject>) {
    _value = _value || {};
    this.result = _value.result
      ? new armonikApiGrpcV1002.DataChunk(_value.result)
      : undefined;
    this.error = _value.error
      ? new armonikApiGrpcV1002.TaskError(_value.error)
      : undefined;
    this.notCompletedTask = _value.notCompletedTask;
    ResultReply.refineValues(this);
  }
  get result(): armonikApiGrpcV1002.DataChunk | undefined {
    return this._result;
  }
  set result(value: armonikApiGrpcV1002.DataChunk | undefined) {
    if (value !== undefined && value !== null) {
      this._error = this._notCompletedTask = undefined;
      this._type = ResultReply.TypeCase.result;
    }
    this._result = value;
  }
  get error(): armonikApiGrpcV1002.TaskError | undefined {
    return this._error;
  }
  set error(value: armonikApiGrpcV1002.TaskError | undefined) {
    if (value !== undefined && value !== null) {
      this._result = this._notCompletedTask = undefined;
      this._type = ResultReply.TypeCase.error;
    }
    this._error = value;
  }
  get notCompletedTask(): string | undefined {
    return this._notCompletedTask;
  }
  set notCompletedTask(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._result = this._error = undefined;
      this._type = ResultReply.TypeCase.notCompletedTask;
    }
    this._notCompletedTask = value;
  }
  get type() {
    return this._type;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ResultReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ResultReply.AsObject {
    return {
      result: this.result ? this.result.toObject() : undefined,
      error: this.error ? this.error.toObject() : undefined,
      notCompletedTask: this.notCompletedTask
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
  ): ResultReply.AsProtobufJSON {
    return {
      result: this.result ? this.result.toProtobufJSON(options) : null,
      error: this.error ? this.error.toProtobufJSON(options) : null,
      notCompletedTask:
        this.notCompletedTask === null || this.notCompletedTask === undefined
          ? null
          : this.notCompletedTask
    };
  }
}
export module ResultReply {
  /**
   * Standard JavaScript object representation for ResultReply
   */
  export interface AsObject {
    result?: armonikApiGrpcV1002.DataChunk.AsObject;
    error?: armonikApiGrpcV1002.TaskError.AsObject;
    notCompletedTask?: string;
  }

  /**
   * Protobuf JSON representation for ResultReply
   */
  export interface AsProtobufJSON {
    result?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
    error?: armonikApiGrpcV1002.TaskError.AsProtobufJSON | null;
    notCompletedTask?: string | null;
  }
  export enum TypeCase {
    none = 0,
    result = 1,
    error = 2,
    notCompletedTask = 3
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.AvailabilityReply
 */
export class AvailabilityReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.AvailabilityReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new AvailabilityReply();
    AvailabilityReply.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: AvailabilityReply) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: AvailabilityReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.ok = new armonikApiGrpcV1002.Empty();
          _reader.readMessage(
            _instance.ok,
            armonikApiGrpcV1002.Empty.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.error = new armonikApiGrpcV1002.TaskError();
          _reader.readMessage(
            _instance.error,
            armonikApiGrpcV1002.TaskError.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.notCompletedTask = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    AvailabilityReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: AvailabilityReply,
    _writer: BinaryWriter
  ) {
    if (_instance.ok) {
      _writer.writeMessage(
        1,
        _instance.ok as any,
        armonikApiGrpcV1002.Empty.serializeBinaryToWriter
      );
    }
    if (_instance.error) {
      _writer.writeMessage(
        2,
        _instance.error as any,
        armonikApiGrpcV1002.TaskError.serializeBinaryToWriter
      );
    }
    if (_instance.notCompletedTask || _instance.notCompletedTask === '') {
      _writer.writeString(3, _instance.notCompletedTask);
    }
  }

  private _ok?: armonikApiGrpcV1002.Empty;
  private _error?: armonikApiGrpcV1002.TaskError;
  private _notCompletedTask?: string;

  private _type: AvailabilityReply.TypeCase = AvailabilityReply.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of AvailabilityReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<AvailabilityReply.AsObject>) {
    _value = _value || {};
    this.ok = _value.ok ? new armonikApiGrpcV1002.Empty(_value.ok) : undefined;
    this.error = _value.error
      ? new armonikApiGrpcV1002.TaskError(_value.error)
      : undefined;
    this.notCompletedTask = _value.notCompletedTask;
    AvailabilityReply.refineValues(this);
  }
  get ok(): armonikApiGrpcV1002.Empty | undefined {
    return this._ok;
  }
  set ok(value: armonikApiGrpcV1002.Empty | undefined) {
    if (value !== undefined && value !== null) {
      this._error = this._notCompletedTask = undefined;
      this._type = AvailabilityReply.TypeCase.ok;
    }
    this._ok = value;
  }
  get error(): armonikApiGrpcV1002.TaskError | undefined {
    return this._error;
  }
  set error(value: armonikApiGrpcV1002.TaskError | undefined) {
    if (value !== undefined && value !== null) {
      this._ok = this._notCompletedTask = undefined;
      this._type = AvailabilityReply.TypeCase.error;
    }
    this._error = value;
  }
  get notCompletedTask(): string | undefined {
    return this._notCompletedTask;
  }
  set notCompletedTask(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._ok = this._error = undefined;
      this._type = AvailabilityReply.TypeCase.notCompletedTask;
    }
    this._notCompletedTask = value;
  }
  get type() {
    return this._type;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    AvailabilityReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): AvailabilityReply.AsObject {
    return {
      ok: this.ok ? this.ok.toObject() : undefined,
      error: this.error ? this.error.toObject() : undefined,
      notCompletedTask: this.notCompletedTask
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
  ): AvailabilityReply.AsProtobufJSON {
    return {
      ok: this.ok ? this.ok.toProtobufJSON(options) : null,
      error: this.error ? this.error.toProtobufJSON(options) : null,
      notCompletedTask:
        this.notCompletedTask === null || this.notCompletedTask === undefined
          ? null
          : this.notCompletedTask
    };
  }
}
export module AvailabilityReply {
  /**
   * Standard JavaScript object representation for AvailabilityReply
   */
  export interface AsObject {
    ok?: armonikApiGrpcV1002.Empty.AsObject;
    error?: armonikApiGrpcV1002.TaskError.AsObject;
    notCompletedTask?: string;
  }

  /**
   * Protobuf JSON representation for AvailabilityReply
   */
  export interface AsProtobufJSON {
    ok?: armonikApiGrpcV1002.Empty.AsProtobufJSON | null;
    error?: armonikApiGrpcV1002.TaskError.AsProtobufJSON | null;
    notCompletedTask?: string | null;
  }
  export enum TypeCase {
    none = 0,
    ok = 1,
    error = 2,
    notCompletedTask = 3
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.WaitRequest
 */
export class WaitRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.WaitRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new WaitRequest();
    WaitRequest.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: WaitRequest) {
    _instance.filter = _instance.filter || undefined;
    _instance.stopOnFirstTaskError = _instance.stopOnFirstTaskError || false;
    _instance.stopOnFirstTaskCancellation =
      _instance.stopOnFirstTaskCancellation || false;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: WaitRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.filter = new TaskFilter();
          _reader.readMessage(
            _instance.filter,
            TaskFilter.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.stopOnFirstTaskError = _reader.readBool();
          break;
        case 3:
          _instance.stopOnFirstTaskCancellation = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    WaitRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: WaitRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.filter) {
      _writer.writeMessage(
        1,
        _instance.filter as any,
        TaskFilter.serializeBinaryToWriter
      );
    }
    if (_instance.stopOnFirstTaskError) {
      _writer.writeBool(2, _instance.stopOnFirstTaskError);
    }
    if (_instance.stopOnFirstTaskCancellation) {
      _writer.writeBool(3, _instance.stopOnFirstTaskCancellation);
    }
  }

  private _filter?: TaskFilter;
  private _stopOnFirstTaskError?: boolean;
  private _stopOnFirstTaskCancellation?: boolean;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of WaitRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<WaitRequest.AsObject>) {
    _value = _value || {};
    this.filter = _value.filter ? new TaskFilter(_value.filter) : undefined;
    this.stopOnFirstTaskError = _value.stopOnFirstTaskError;
    this.stopOnFirstTaskCancellation = _value.stopOnFirstTaskCancellation;
    WaitRequest.refineValues(this);
  }
  get filter(): TaskFilter | undefined {
    return this._filter;
  }
  set filter(value: TaskFilter | undefined) {
    this._filter = value;
  }
  get stopOnFirstTaskError(): boolean | undefined {
    return this._stopOnFirstTaskError;
  }
  set stopOnFirstTaskError(value: boolean | undefined) {
    this._stopOnFirstTaskError = value;
  }
  get stopOnFirstTaskCancellation(): boolean | undefined {
    return this._stopOnFirstTaskCancellation;
  }
  set stopOnFirstTaskCancellation(value: boolean | undefined) {
    this._stopOnFirstTaskCancellation = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    WaitRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): WaitRequest.AsObject {
    return {
      filter: this.filter ? this.filter.toObject() : undefined,
      stopOnFirstTaskError: this.stopOnFirstTaskError,
      stopOnFirstTaskCancellation: this.stopOnFirstTaskCancellation
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
  ): WaitRequest.AsProtobufJSON {
    return {
      filter: this.filter ? this.filter.toProtobufJSON(options) : null,
      stopOnFirstTaskError: this.stopOnFirstTaskError,
      stopOnFirstTaskCancellation: this.stopOnFirstTaskCancellation
    };
  }
}
export module WaitRequest {
  /**
   * Standard JavaScript object representation for WaitRequest
   */
  export interface AsObject {
    filter?: TaskFilter.AsObject;
    stopOnFirstTaskError?: boolean;
    stopOnFirstTaskCancellation?: boolean;
  }

  /**
   * Protobuf JSON representation for WaitRequest
   */
  export interface AsProtobufJSON {
    filter?: TaskFilter.AsProtobufJSON | null;
    stopOnFirstTaskError?: boolean;
    stopOnFirstTaskCancellation?: boolean;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.WatchResultRequest
 */
export class WatchResultRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.WatchResultRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new WatchResultRequest();
    WatchResultRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: WatchResultRequest) {
    _instance.fetchStatuses = _instance.fetchStatuses || [];
    _instance.watchStatuses = _instance.watchStatuses || [];
    _instance.resultIds = _instance.resultIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: WatchResultRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.fetchStatuses = _instance.fetchStatuses || []).push(
            ...(_reader.readPackedEnum() || [])
          );
          break;
        case 2:
          (_instance.watchStatuses = _instance.watchStatuses || []).push(
            ...(_reader.readPackedEnum() || [])
          );
          break;
        case 3:
          (_instance.resultIds = _instance.resultIds || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    WatchResultRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: WatchResultRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.fetchStatuses && _instance.fetchStatuses.length) {
      _writer.writePackedEnum(1, _instance.fetchStatuses);
    }
    if (_instance.watchStatuses && _instance.watchStatuses.length) {
      _writer.writePackedEnum(2, _instance.watchStatuses);
    }
    if (_instance.resultIds && _instance.resultIds.length) {
      _writer.writeRepeatedString(3, _instance.resultIds);
    }
  }

  private _fetchStatuses?: armonikApiGrpcV1Result_status003.ResultStatus[];
  private _watchStatuses?: armonikApiGrpcV1Result_status003.ResultStatus[];
  private _resultIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of WatchResultRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<WatchResultRequest.AsObject>) {
    _value = _value || {};
    this.fetchStatuses = (_value.fetchStatuses || []).slice();
    this.watchStatuses = (_value.watchStatuses || []).slice();
    this.resultIds = (_value.resultIds || []).slice();
    WatchResultRequest.refineValues(this);
  }
  get fetchStatuses():
    | armonikApiGrpcV1Result_status003.ResultStatus[]
    | undefined {
    return this._fetchStatuses;
  }
  set fetchStatuses(
    value: armonikApiGrpcV1Result_status003.ResultStatus[] | undefined
  ) {
    this._fetchStatuses = value;
  }
  get watchStatuses():
    | armonikApiGrpcV1Result_status003.ResultStatus[]
    | undefined {
    return this._watchStatuses;
  }
  set watchStatuses(
    value: armonikApiGrpcV1Result_status003.ResultStatus[] | undefined
  ) {
    this._watchStatuses = value;
  }
  get resultIds(): string[] | undefined {
    return this._resultIds;
  }
  set resultIds(value: string[] | undefined) {
    this._resultIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    WatchResultRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): WatchResultRequest.AsObject {
    return {
      fetchStatuses: (this.fetchStatuses || []).slice(),
      watchStatuses: (this.watchStatuses || []).slice(),
      resultIds: (this.resultIds || []).slice()
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
  ): WatchResultRequest.AsProtobufJSON {
    return {
      fetchStatuses: (this.fetchStatuses || []).map(
        v => armonikApiGrpcV1Result_status003.ResultStatus[v]
      ),
      watchStatuses: (this.watchStatuses || []).map(
        v => armonikApiGrpcV1Result_status003.ResultStatus[v]
      ),
      resultIds: (this.resultIds || []).slice()
    };
  }
}
export module WatchResultRequest {
  /**
   * Standard JavaScript object representation for WatchResultRequest
   */
  export interface AsObject {
    fetchStatuses?: armonikApiGrpcV1Result_status003.ResultStatus[];
    watchStatuses?: armonikApiGrpcV1Result_status003.ResultStatus[];
    resultIds?: string[];
  }

  /**
   * Protobuf JSON representation for WatchResultRequest
   */
  export interface AsProtobufJSON {
    fetchStatuses?: string[];
    watchStatuses?: string[];
    resultIds?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.submitter.WatchResultStream
 */
export class WatchResultStream implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.submitter.WatchResultStream';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new WatchResultStream();
    WatchResultStream.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: WatchResultStream) {
    _instance.status = _instance.status || 0;
    _instance.resultIds = _instance.resultIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: WatchResultStream,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.status = _reader.readEnum();
          break;
        case 2:
          (_instance.resultIds = _instance.resultIds || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    WatchResultStream.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: WatchResultStream,
    _writer: BinaryWriter
  ) {
    if (_instance.status) {
      _writer.writeEnum(1, _instance.status);
    }
    if (_instance.resultIds && _instance.resultIds.length) {
      _writer.writeRepeatedString(2, _instance.resultIds);
    }
  }

  private _status?: armonikApiGrpcV1Result_status003.ResultStatus;
  private _resultIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of WatchResultStream to deeply clone from
   */
  constructor(_value?: RecursivePartial<WatchResultStream.AsObject>) {
    _value = _value || {};
    this.status = _value.status;
    this.resultIds = (_value.resultIds || []).slice();
    WatchResultStream.refineValues(this);
  }
  get status(): armonikApiGrpcV1Result_status003.ResultStatus | undefined {
    return this._status;
  }
  set status(value: armonikApiGrpcV1Result_status003.ResultStatus | undefined) {
    this._status = value;
  }
  get resultIds(): string[] | undefined {
    return this._resultIds;
  }
  set resultIds(value: string[] | undefined) {
    this._resultIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    WatchResultStream.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): WatchResultStream.AsObject {
    return {
      status: this.status,
      resultIds: (this.resultIds || []).slice()
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
  ): WatchResultStream.AsProtobufJSON {
    return {
      status:
        armonikApiGrpcV1Result_status003.ResultStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      resultIds: (this.resultIds || []).slice()
    };
  }
}
export module WatchResultStream {
  /**
   * Standard JavaScript object representation for WatchResultStream
   */
  export interface AsObject {
    status?: armonikApiGrpcV1Result_status003.ResultStatus;
    resultIds?: string[];
  }

  /**
   * Protobuf JSON representation for WatchResultStream
   */
  export interface AsProtobufJSON {
    status?: string;
    resultIds?: string[];
  }
}
