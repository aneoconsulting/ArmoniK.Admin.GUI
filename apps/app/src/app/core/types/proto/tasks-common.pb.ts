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
 * Message implementation for armonik.api.grpc.v1.tasks.TaskRaw
 */
export class TaskRaw implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.TaskRaw';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskRaw();
    TaskRaw.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskRaw) {
    _instance.id = _instance.id || '';
    _instance.sessionId = _instance.sessionId || '';
    _instance.ownerPodId = _instance.ownerPodId || '';
    _instance.parentTaskIds = _instance.parentTaskIds || [];
    _instance.dataDependencies = _instance.dataDependencies || [];
    _instance.expectedOutputIds = _instance.expectedOutputIds || [];
    _instance.retryOfIds = _instance.retryOfIds || [];
    _instance.status = _instance.status || 0;
    _instance.statusMessage = _instance.statusMessage || '';
    _instance.options = _instance.options || undefined;
    _instance.createdAt = _instance.createdAt || undefined;
    _instance.submittedAt = _instance.submittedAt || undefined;
    _instance.startedAt = _instance.startedAt || undefined;
    _instance.endedAt = _instance.endedAt || undefined;
    _instance.podTtl = _instance.podTtl || undefined;
    _instance.output = _instance.output || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskRaw,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readString();
          break;
        case 2:
          _instance.sessionId = _reader.readString();
          break;
        case 3:
          _instance.ownerPodId = _reader.readString();
          break;
        case 4:
          (_instance.parentTaskIds = _instance.parentTaskIds || []).push(
            _reader.readString()
          );
          break;
        case 5:
          (_instance.dataDependencies = _instance.dataDependencies || []).push(
            _reader.readString()
          );
          break;
        case 6:
          (_instance.expectedOutputIds =
            _instance.expectedOutputIds || []).push(_reader.readString());
          break;
        case 7:
          (_instance.retryOfIds = _instance.retryOfIds || []).push(
            _reader.readString()
          );
          break;
        case 8:
          _instance.status = _reader.readEnum();
          break;
        case 9:
          _instance.statusMessage = _reader.readString();
          break;
        case 10:
          _instance.options = new armonikApiGrpcV1003.TaskOptions();
          _reader.readMessage(
            _instance.options,
            armonikApiGrpcV1003.TaskOptions.deserializeBinaryFromReader
          );
          break;
        case 11:
          _instance.createdAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.createdAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 12:
          _instance.submittedAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.submittedAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 13:
          _instance.startedAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.startedAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 14:
          _instance.endedAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.endedAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 15:
          _instance.podTtl = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.podTtl,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 16:
          _instance.output = new TaskRaw.Output();
          _reader.readMessage(
            _instance.output,
            TaskRaw.Output.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    TaskRaw.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: TaskRaw, _writer: BinaryWriter) {
    if (_instance.id) {
      _writer.writeString(1, _instance.id);
    }
    if (_instance.sessionId) {
      _writer.writeString(2, _instance.sessionId);
    }
    if (_instance.ownerPodId) {
      _writer.writeString(3, _instance.ownerPodId);
    }
    if (_instance.parentTaskIds && _instance.parentTaskIds.length) {
      _writer.writeRepeatedString(4, _instance.parentTaskIds);
    }
    if (_instance.dataDependencies && _instance.dataDependencies.length) {
      _writer.writeRepeatedString(5, _instance.dataDependencies);
    }
    if (_instance.expectedOutputIds && _instance.expectedOutputIds.length) {
      _writer.writeRepeatedString(6, _instance.expectedOutputIds);
    }
    if (_instance.retryOfIds && _instance.retryOfIds.length) {
      _writer.writeRepeatedString(7, _instance.retryOfIds);
    }
    if (_instance.status) {
      _writer.writeEnum(8, _instance.status);
    }
    if (_instance.statusMessage) {
      _writer.writeString(9, _instance.statusMessage);
    }
    if (_instance.options) {
      _writer.writeMessage(
        10,
        _instance.options as any,
        armonikApiGrpcV1003.TaskOptions.serializeBinaryToWriter
      );
    }
    if (_instance.createdAt) {
      _writer.writeMessage(
        11,
        _instance.createdAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.submittedAt) {
      _writer.writeMessage(
        12,
        _instance.submittedAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.startedAt) {
      _writer.writeMessage(
        13,
        _instance.startedAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.endedAt) {
      _writer.writeMessage(
        14,
        _instance.endedAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.podTtl) {
      _writer.writeMessage(
        15,
        _instance.podTtl as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.output) {
      _writer.writeMessage(
        16,
        _instance.output as any,
        TaskRaw.Output.serializeBinaryToWriter
      );
    }
  }

  private _id?: string;
  private _sessionId?: string;
  private _ownerPodId?: string;
  private _parentTaskIds?: string[];
  private _dataDependencies?: string[];
  private _expectedOutputIds?: string[];
  private _retryOfIds?: string[];
  private _status?: armonikApiGrpcV1Task_status001.TaskStatus;
  private _statusMessage?: string;
  private _options?: armonikApiGrpcV1003.TaskOptions;
  private _createdAt?: googleProtobuf002.Timestamp;
  private _submittedAt?: googleProtobuf002.Timestamp;
  private _startedAt?: googleProtobuf002.Timestamp;
  private _endedAt?: googleProtobuf002.Timestamp;
  private _podTtl?: googleProtobuf002.Timestamp;
  private _output?: TaskRaw.Output;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskRaw to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskRaw.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.sessionId = _value.sessionId;
    this.ownerPodId = _value.ownerPodId;
    this.parentTaskIds = (_value.parentTaskIds || []).slice();
    this.dataDependencies = (_value.dataDependencies || []).slice();
    this.expectedOutputIds = (_value.expectedOutputIds || []).slice();
    this.retryOfIds = (_value.retryOfIds || []).slice();
    this.status = _value.status;
    this.statusMessage = _value.statusMessage;
    this.options = _value.options
      ? new armonikApiGrpcV1003.TaskOptions(_value.options)
      : undefined;
    this.createdAt = _value.createdAt
      ? new googleProtobuf002.Timestamp(_value.createdAt)
      : undefined;
    this.submittedAt = _value.submittedAt
      ? new googleProtobuf002.Timestamp(_value.submittedAt)
      : undefined;
    this.startedAt = _value.startedAt
      ? new googleProtobuf002.Timestamp(_value.startedAt)
      : undefined;
    this.endedAt = _value.endedAt
      ? new googleProtobuf002.Timestamp(_value.endedAt)
      : undefined;
    this.podTtl = _value.podTtl
      ? new googleProtobuf002.Timestamp(_value.podTtl)
      : undefined;
    this.output = _value.output ? new TaskRaw.Output(_value.output) : undefined;
    TaskRaw.refineValues(this);
  }
  get id(): string | undefined {
    return this._id;
  }
  set id(value: string | undefined) {
    this._id = value;
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get ownerPodId(): string | undefined {
    return this._ownerPodId;
  }
  set ownerPodId(value: string | undefined) {
    this._ownerPodId = value;
  }
  get parentTaskIds(): string[] | undefined {
    return this._parentTaskIds;
  }
  set parentTaskIds(value: string[] | undefined) {
    this._parentTaskIds = value;
  }
  get dataDependencies(): string[] | undefined {
    return this._dataDependencies;
  }
  set dataDependencies(value: string[] | undefined) {
    this._dataDependencies = value;
  }
  get expectedOutputIds(): string[] | undefined {
    return this._expectedOutputIds;
  }
  set expectedOutputIds(value: string[] | undefined) {
    this._expectedOutputIds = value;
  }
  get retryOfIds(): string[] | undefined {
    return this._retryOfIds;
  }
  set retryOfIds(value: string[] | undefined) {
    this._retryOfIds = value;
  }
  get status(): armonikApiGrpcV1Task_status001.TaskStatus | undefined {
    return this._status;
  }
  set status(value: armonikApiGrpcV1Task_status001.TaskStatus | undefined) {
    this._status = value;
  }
  get statusMessage(): string | undefined {
    return this._statusMessage;
  }
  set statusMessage(value: string | undefined) {
    this._statusMessage = value;
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
  get submittedAt(): googleProtobuf002.Timestamp | undefined {
    return this._submittedAt;
  }
  set submittedAt(value: googleProtobuf002.Timestamp | undefined) {
    this._submittedAt = value;
  }
  get startedAt(): googleProtobuf002.Timestamp | undefined {
    return this._startedAt;
  }
  set startedAt(value: googleProtobuf002.Timestamp | undefined) {
    this._startedAt = value;
  }
  get endedAt(): googleProtobuf002.Timestamp | undefined {
    return this._endedAt;
  }
  set endedAt(value: googleProtobuf002.Timestamp | undefined) {
    this._endedAt = value;
  }
  get podTtl(): googleProtobuf002.Timestamp | undefined {
    return this._podTtl;
  }
  set podTtl(value: googleProtobuf002.Timestamp | undefined) {
    this._podTtl = value;
  }
  get output(): TaskRaw.Output | undefined {
    return this._output;
  }
  set output(value: TaskRaw.Output | undefined) {
    this._output = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskRaw.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskRaw.AsObject {
    return {
      id: this.id,
      sessionId: this.sessionId,
      ownerPodId: this.ownerPodId,
      parentTaskIds: (this.parentTaskIds || []).slice(),
      dataDependencies: (this.dataDependencies || []).slice(),
      expectedOutputIds: (this.expectedOutputIds || []).slice(),
      retryOfIds: (this.retryOfIds || []).slice(),
      status: this.status,
      statusMessage: this.statusMessage,
      options: this.options ? this.options.toObject() : undefined,
      createdAt: this.createdAt ? this.createdAt.toObject() : undefined,
      submittedAt: this.submittedAt ? this.submittedAt.toObject() : undefined,
      startedAt: this.startedAt ? this.startedAt.toObject() : undefined,
      endedAt: this.endedAt ? this.endedAt.toObject() : undefined,
      podTtl: this.podTtl ? this.podTtl.toObject() : undefined,
      output: this.output ? this.output.toObject() : undefined
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
  ): TaskRaw.AsProtobufJSON {
    return {
      id: this.id,
      sessionId: this.sessionId,
      ownerPodId: this.ownerPodId,
      parentTaskIds: (this.parentTaskIds || []).slice(),
      dataDependencies: (this.dataDependencies || []).slice(),
      expectedOutputIds: (this.expectedOutputIds || []).slice(),
      retryOfIds: (this.retryOfIds || []).slice(),
      status:
        armonikApiGrpcV1Task_status001.TaskStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      statusMessage: this.statusMessage,
      options: this.options ? this.options.toProtobufJSON(options) : null,
      createdAt: this.createdAt ? this.createdAt.toProtobufJSON(options) : null,
      submittedAt: this.submittedAt
        ? this.submittedAt.toProtobufJSON(options)
        : null,
      startedAt: this.startedAt ? this.startedAt.toProtobufJSON(options) : null,
      endedAt: this.endedAt ? this.endedAt.toProtobufJSON(options) : null,
      podTtl: this.podTtl ? this.podTtl.toProtobufJSON(options) : null,
      output: this.output ? this.output.toProtobufJSON(options) : null
    };
  }
}
export module TaskRaw {
  /**
   * Standard JavaScript object representation for TaskRaw
   */
  export interface AsObject {
    id?: string;
    sessionId?: string;
    ownerPodId?: string;
    parentTaskIds?: string[];
    dataDependencies?: string[];
    expectedOutputIds?: string[];
    retryOfIds?: string[];
    status?: armonikApiGrpcV1Task_status001.TaskStatus;
    statusMessage?: string;
    options?: armonikApiGrpcV1003.TaskOptions.AsObject;
    createdAt?: googleProtobuf002.Timestamp.AsObject;
    submittedAt?: googleProtobuf002.Timestamp.AsObject;
    startedAt?: googleProtobuf002.Timestamp.AsObject;
    endedAt?: googleProtobuf002.Timestamp.AsObject;
    podTtl?: googleProtobuf002.Timestamp.AsObject;
    output?: TaskRaw.Output.AsObject;
  }

  /**
   * Protobuf JSON representation for TaskRaw
   */
  export interface AsProtobufJSON {
    id?: string;
    sessionId?: string;
    ownerPodId?: string;
    parentTaskIds?: string[];
    dataDependencies?: string[];
    expectedOutputIds?: string[];
    retryOfIds?: string[];
    status?: string;
    statusMessage?: string;
    options?: armonikApiGrpcV1003.TaskOptions.AsProtobufJSON | null;
    createdAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    submittedAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    startedAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    endedAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    podTtl?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    output?: TaskRaw.Output.AsProtobufJSON | null;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.tasks.TaskRaw.Output
   */
  export class Output implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.tasks.TaskRaw.Output';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new Output();
      Output.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: Output) {
      _instance.success = _instance.success || false;
      _instance.error = _instance.error || '';
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: Output,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.success = _reader.readBool();
            break;
          case 2:
            _instance.error = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      Output.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: Output, _writer: BinaryWriter) {
      if (_instance.success) {
        _writer.writeBool(1, _instance.success);
      }
      if (_instance.error) {
        _writer.writeString(2, _instance.error);
      }
    }

    private _success?: boolean;
    private _error?: string;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Output to deeply clone from
     */
    constructor(_value?: RecursivePartial<Output.AsObject>) {
      _value = _value || {};
      this.success = _value.success;
      this.error = _value.error;
      Output.refineValues(this);
    }
    get success(): boolean | undefined {
      return this._success;
    }
    set success(value: boolean | undefined) {
      this._success = value;
    }
    get error(): string | undefined {
      return this._error;
    }
    set error(value: string | undefined) {
      this._error = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      Output.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): Output.AsObject {
      return {
        success: this.success,
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
    ): Output.AsProtobufJSON {
      return {
        success: this.success,
        error: this.error
      };
    }
  }
  export module Output {
    /**
     * Standard JavaScript object representation for Output
     */
    export interface AsObject {
      success?: boolean;
      error?: string;
    }

    /**
     * Protobuf JSON representation for Output
     */
    export interface AsProtobufJSON {
      success?: boolean;
      error?: string;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.TaskSummary
 */
export class TaskSummary implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.TaskSummary';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskSummary();
    TaskSummary.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskSummary) {
    _instance.id = _instance.id || '';
    _instance.sessionId = _instance.sessionId || '';
    _instance.options = _instance.options || undefined;
    _instance.status = _instance.status || 0;
    _instance.createdAt = _instance.createdAt || undefined;
    _instance.startedAt = _instance.startedAt || undefined;
    _instance.endedAt = _instance.endedAt || undefined;
    _instance.error = _instance.error || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskSummary,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readString();
          break;
        case 2:
          _instance.sessionId = _reader.readString();
          break;
        case 3:
          _instance.options = new armonikApiGrpcV1003.TaskOptions();
          _reader.readMessage(
            _instance.options,
            armonikApiGrpcV1003.TaskOptions.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.status = _reader.readEnum();
          break;
        case 5:
          _instance.createdAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.createdAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 6:
          _instance.startedAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.startedAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 7:
          _instance.endedAt = new googleProtobuf002.Timestamp();
          _reader.readMessage(
            _instance.endedAt,
            googleProtobuf002.Timestamp.deserializeBinaryFromReader
          );
          break;
        case 8:
          _instance.error = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    TaskSummary.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: TaskSummary,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeString(1, _instance.id);
    }
    if (_instance.sessionId) {
      _writer.writeString(2, _instance.sessionId);
    }
    if (_instance.options) {
      _writer.writeMessage(
        3,
        _instance.options as any,
        armonikApiGrpcV1003.TaskOptions.serializeBinaryToWriter
      );
    }
    if (_instance.status) {
      _writer.writeEnum(4, _instance.status);
    }
    if (_instance.createdAt) {
      _writer.writeMessage(
        5,
        _instance.createdAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.startedAt) {
      _writer.writeMessage(
        6,
        _instance.startedAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.endedAt) {
      _writer.writeMessage(
        7,
        _instance.endedAt as any,
        googleProtobuf002.Timestamp.serializeBinaryToWriter
      );
    }
    if (_instance.error) {
      _writer.writeString(8, _instance.error);
    }
  }

  private _id?: string;
  private _sessionId?: string;
  private _options?: armonikApiGrpcV1003.TaskOptions;
  private _status?: armonikApiGrpcV1Task_status001.TaskStatus;
  private _createdAt?: googleProtobuf002.Timestamp;
  private _startedAt?: googleProtobuf002.Timestamp;
  private _endedAt?: googleProtobuf002.Timestamp;
  private _error?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskSummary to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskSummary.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.sessionId = _value.sessionId;
    this.options = _value.options
      ? new armonikApiGrpcV1003.TaskOptions(_value.options)
      : undefined;
    this.status = _value.status;
    this.createdAt = _value.createdAt
      ? new googleProtobuf002.Timestamp(_value.createdAt)
      : undefined;
    this.startedAt = _value.startedAt
      ? new googleProtobuf002.Timestamp(_value.startedAt)
      : undefined;
    this.endedAt = _value.endedAt
      ? new googleProtobuf002.Timestamp(_value.endedAt)
      : undefined;
    this.error = _value.error;
    TaskSummary.refineValues(this);
  }
  get id(): string | undefined {
    return this._id;
  }
  set id(value: string | undefined) {
    this._id = value;
  }
  get sessionId(): string | undefined {
    return this._sessionId;
  }
  set sessionId(value: string | undefined) {
    this._sessionId = value;
  }
  get options(): armonikApiGrpcV1003.TaskOptions | undefined {
    return this._options;
  }
  set options(value: armonikApiGrpcV1003.TaskOptions | undefined) {
    this._options = value;
  }
  get status(): armonikApiGrpcV1Task_status001.TaskStatus | undefined {
    return this._status;
  }
  set status(value: armonikApiGrpcV1Task_status001.TaskStatus | undefined) {
    this._status = value;
  }
  get createdAt(): googleProtobuf002.Timestamp | undefined {
    return this._createdAt;
  }
  set createdAt(value: googleProtobuf002.Timestamp | undefined) {
    this._createdAt = value;
  }
  get startedAt(): googleProtobuf002.Timestamp | undefined {
    return this._startedAt;
  }
  set startedAt(value: googleProtobuf002.Timestamp | undefined) {
    this._startedAt = value;
  }
  get endedAt(): googleProtobuf002.Timestamp | undefined {
    return this._endedAt;
  }
  set endedAt(value: googleProtobuf002.Timestamp | undefined) {
    this._endedAt = value;
  }
  get error(): string | undefined {
    return this._error;
  }
  set error(value: string | undefined) {
    this._error = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskSummary.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskSummary.AsObject {
    return {
      id: this.id,
      sessionId: this.sessionId,
      options: this.options ? this.options.toObject() : undefined,
      status: this.status,
      createdAt: this.createdAt ? this.createdAt.toObject() : undefined,
      startedAt: this.startedAt ? this.startedAt.toObject() : undefined,
      endedAt: this.endedAt ? this.endedAt.toObject() : undefined,
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
  ): TaskSummary.AsProtobufJSON {
    return {
      id: this.id,
      sessionId: this.sessionId,
      options: this.options ? this.options.toProtobufJSON(options) : null,
      status:
        armonikApiGrpcV1Task_status001.TaskStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      createdAt: this.createdAt ? this.createdAt.toProtobufJSON(options) : null,
      startedAt: this.startedAt ? this.startedAt.toProtobufJSON(options) : null,
      endedAt: this.endedAt ? this.endedAt.toProtobufJSON(options) : null,
      error: this.error
    };
  }
}
export module TaskSummary {
  /**
   * Standard JavaScript object representation for TaskSummary
   */
  export interface AsObject {
    id?: string;
    sessionId?: string;
    options?: armonikApiGrpcV1003.TaskOptions.AsObject;
    status?: armonikApiGrpcV1Task_status001.TaskStatus;
    createdAt?: googleProtobuf002.Timestamp.AsObject;
    startedAt?: googleProtobuf002.Timestamp.AsObject;
    endedAt?: googleProtobuf002.Timestamp.AsObject;
    error?: string;
  }

  /**
   * Protobuf JSON representation for TaskSummary
   */
  export interface AsProtobufJSON {
    id?: string;
    sessionId?: string;
    options?: armonikApiGrpcV1003.TaskOptions.AsProtobufJSON | null;
    status?: string;
    createdAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    startedAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    endedAt?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    error?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.ListTasksRequest
 */
export class ListTasksRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.ListTasksRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListTasksRequest();
    ListTasksRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListTasksRequest) {
    _instance.page = _instance.page || 0;
    _instance.pageSize = _instance.pageSize || 0;
    _instance.filter = _instance.filter || undefined;
    _instance.sort = _instance.sort || undefined;
    _instance.withErrors = _instance.withErrors || false;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ListTasksRequest,
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
          _instance.filter = new ListTasksRequest.Filter();
          _reader.readMessage(
            _instance.filter,
            ListTasksRequest.Filter.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.sort = new ListTasksRequest.Sort();
          _reader.readMessage(
            _instance.sort,
            ListTasksRequest.Sort.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.withErrors = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    ListTasksRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListTasksRequest,
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
        ListTasksRequest.Filter.serializeBinaryToWriter
      );
    }
    if (_instance.sort) {
      _writer.writeMessage(
        4,
        _instance.sort as any,
        ListTasksRequest.Sort.serializeBinaryToWriter
      );
    }
    if (_instance.withErrors) {
      _writer.writeBool(5, _instance.withErrors);
    }
  }

  private _page?: number;
  private _pageSize?: number;
  private _filter?: ListTasksRequest.Filter;
  private _sort?: ListTasksRequest.Sort;
  private _withErrors?: boolean;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListTasksRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListTasksRequest.AsObject>) {
    _value = _value || {};
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.filter = _value.filter
      ? new ListTasksRequest.Filter(_value.filter)
      : undefined;
    this.sort = _value.sort
      ? new ListTasksRequest.Sort(_value.sort)
      : undefined;
    this.withErrors = _value.withErrors;
    ListTasksRequest.refineValues(this);
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
  get filter(): ListTasksRequest.Filter | undefined {
    return this._filter;
  }
  set filter(value: ListTasksRequest.Filter | undefined) {
    this._filter = value;
  }
  get sort(): ListTasksRequest.Sort | undefined {
    return this._sort;
  }
  set sort(value: ListTasksRequest.Sort | undefined) {
    this._sort = value;
  }
  get withErrors(): boolean | undefined {
    return this._withErrors;
  }
  set withErrors(value: boolean | undefined) {
    this._withErrors = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ListTasksRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListTasksRequest.AsObject {
    return {
      page: this.page,
      pageSize: this.pageSize,
      filter: this.filter ? this.filter.toObject() : undefined,
      sort: this.sort ? this.sort.toObject() : undefined,
      withErrors: this.withErrors
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
  ): ListTasksRequest.AsProtobufJSON {
    return {
      page: this.page,
      pageSize: this.pageSize,
      filter: this.filter ? this.filter.toProtobufJSON(options) : null,
      sort: this.sort ? this.sort.toProtobufJSON(options) : null,
      withErrors: this.withErrors
    };
  }
}
export module ListTasksRequest {
  /**
   * Standard JavaScript object representation for ListTasksRequest
   */
  export interface AsObject {
    page?: number;
    pageSize?: number;
    filter?: ListTasksRequest.Filter.AsObject;
    sort?: ListTasksRequest.Sort.AsObject;
    withErrors?: boolean;
  }

  /**
   * Protobuf JSON representation for ListTasksRequest
   */
  export interface AsProtobufJSON {
    page?: number;
    pageSize?: number;
    filter?: ListTasksRequest.Filter.AsProtobufJSON | null;
    sort?: ListTasksRequest.Sort.AsProtobufJSON | null;
    withErrors?: boolean;
  }
  export enum OrderByField {
    ORDER_BY_FIELD_UNSPECIFIED = 0,
    ORDER_BY_FIELD_TASK_ID = 1,
    ORDER_BY_FIELD_SESSION_ID = 2,
    ORDER_BY_FIELD_STATUS = 3,
    ORDER_BY_FIELD_CREATED_AT = 4,
    ORDER_BY_FIELD_STARTED_AT = 5,
    ORDER_BY_FIELD_ENDED_AT = 6
  }
  export enum OrderDirection {
    ORDER_DIRECTION_UNSPECIFIED = 0,
    ORDER_DIRECTION_ASC = 1,
    ORDER_DIRECTION_DESC = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.tasks.ListTasksRequest.Filter
   */
  export class Filter implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.tasks.ListTasksRequest.Filter';

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
      _instance.status = _instance.status || 0;
      _instance.createdAfter = _instance.createdAfter || undefined;
      _instance.createdBefore = _instance.createdBefore || undefined;
      _instance.startedAfter = _instance.startedAfter || undefined;
      _instance.startedBefore = _instance.startedBefore || undefined;
      _instance.endedAfter = _instance.endedAfter || undefined;
      _instance.endedBefore = _instance.endedBefore || undefined;
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
            _instance.status = _reader.readEnum();
            break;
          case 3:
            _instance.createdAfter = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.createdAfter,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 4:
            _instance.createdBefore = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.createdBefore,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 5:
            _instance.startedAfter = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.startedAfter,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 6:
            _instance.startedBefore = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.startedBefore,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 7:
            _instance.endedAfter = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.endedAfter,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
            );
            break;
          case 8:
            _instance.endedBefore = new googleProtobuf002.Timestamp();
            _reader.readMessage(
              _instance.endedBefore,
              googleProtobuf002.Timestamp.deserializeBinaryFromReader
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
      if (_instance.status) {
        _writer.writeEnum(2, _instance.status);
      }
      if (_instance.createdAfter) {
        _writer.writeMessage(
          3,
          _instance.createdAfter as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.createdBefore) {
        _writer.writeMessage(
          4,
          _instance.createdBefore as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.startedAfter) {
        _writer.writeMessage(
          5,
          _instance.startedAfter as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.startedBefore) {
        _writer.writeMessage(
          6,
          _instance.startedBefore as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.endedAfter) {
        _writer.writeMessage(
          7,
          _instance.endedAfter as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
      if (_instance.endedBefore) {
        _writer.writeMessage(
          8,
          _instance.endedBefore as any,
          googleProtobuf002.Timestamp.serializeBinaryToWriter
        );
      }
    }

    private _sessionId?: string;
    private _status?: armonikApiGrpcV1Task_status001.TaskStatus;
    private _createdAfter?: googleProtobuf002.Timestamp;
    private _createdBefore?: googleProtobuf002.Timestamp;
    private _startedAfter?: googleProtobuf002.Timestamp;
    private _startedBefore?: googleProtobuf002.Timestamp;
    private _endedAfter?: googleProtobuf002.Timestamp;
    private _endedBefore?: googleProtobuf002.Timestamp;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Filter to deeply clone from
     */
    constructor(_value?: RecursivePartial<Filter.AsObject>) {
      _value = _value || {};
      this.sessionId = _value.sessionId;
      this.status = _value.status;
      this.createdAfter = _value.createdAfter
        ? new googleProtobuf002.Timestamp(_value.createdAfter)
        : undefined;
      this.createdBefore = _value.createdBefore
        ? new googleProtobuf002.Timestamp(_value.createdBefore)
        : undefined;
      this.startedAfter = _value.startedAfter
        ? new googleProtobuf002.Timestamp(_value.startedAfter)
        : undefined;
      this.startedBefore = _value.startedBefore
        ? new googleProtobuf002.Timestamp(_value.startedBefore)
        : undefined;
      this.endedAfter = _value.endedAfter
        ? new googleProtobuf002.Timestamp(_value.endedAfter)
        : undefined;
      this.endedBefore = _value.endedBefore
        ? new googleProtobuf002.Timestamp(_value.endedBefore)
        : undefined;
      Filter.refineValues(this);
    }
    get sessionId(): string | undefined {
      return this._sessionId;
    }
    set sessionId(value: string | undefined) {
      this._sessionId = value;
    }
    get status(): armonikApiGrpcV1Task_status001.TaskStatus | undefined {
      return this._status;
    }
    set status(value: armonikApiGrpcV1Task_status001.TaskStatus | undefined) {
      this._status = value;
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
    get startedAfter(): googleProtobuf002.Timestamp | undefined {
      return this._startedAfter;
    }
    set startedAfter(value: googleProtobuf002.Timestamp | undefined) {
      this._startedAfter = value;
    }
    get startedBefore(): googleProtobuf002.Timestamp | undefined {
      return this._startedBefore;
    }
    set startedBefore(value: googleProtobuf002.Timestamp | undefined) {
      this._startedBefore = value;
    }
    get endedAfter(): googleProtobuf002.Timestamp | undefined {
      return this._endedAfter;
    }
    set endedAfter(value: googleProtobuf002.Timestamp | undefined) {
      this._endedAfter = value;
    }
    get endedBefore(): googleProtobuf002.Timestamp | undefined {
      return this._endedBefore;
    }
    set endedBefore(value: googleProtobuf002.Timestamp | undefined) {
      this._endedBefore = value;
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
        status: this.status,
        createdAfter: this.createdAfter
          ? this.createdAfter.toObject()
          : undefined,
        createdBefore: this.createdBefore
          ? this.createdBefore.toObject()
          : undefined,
        startedAfter: this.startedAfter
          ? this.startedAfter.toObject()
          : undefined,
        startedBefore: this.startedBefore
          ? this.startedBefore.toObject()
          : undefined,
        endedAfter: this.endedAfter ? this.endedAfter.toObject() : undefined,
        endedBefore: this.endedBefore ? this.endedBefore.toObject() : undefined
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
        status:
          armonikApiGrpcV1Task_status001.TaskStatus[
            this.status === null || this.status === undefined ? 0 : this.status
          ],
        createdAfter: this.createdAfter
          ? this.createdAfter.toProtobufJSON(options)
          : null,
        createdBefore: this.createdBefore
          ? this.createdBefore.toProtobufJSON(options)
          : null,
        startedAfter: this.startedAfter
          ? this.startedAfter.toProtobufJSON(options)
          : null,
        startedBefore: this.startedBefore
          ? this.startedBefore.toProtobufJSON(options)
          : null,
        endedAfter: this.endedAfter
          ? this.endedAfter.toProtobufJSON(options)
          : null,
        endedBefore: this.endedBefore
          ? this.endedBefore.toProtobufJSON(options)
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
      status?: armonikApiGrpcV1Task_status001.TaskStatus;
      createdAfter?: googleProtobuf002.Timestamp.AsObject;
      createdBefore?: googleProtobuf002.Timestamp.AsObject;
      startedAfter?: googleProtobuf002.Timestamp.AsObject;
      startedBefore?: googleProtobuf002.Timestamp.AsObject;
      endedAfter?: googleProtobuf002.Timestamp.AsObject;
      endedBefore?: googleProtobuf002.Timestamp.AsObject;
    }

    /**
     * Protobuf JSON representation for Filter
     */
    export interface AsProtobufJSON {
      sessionId?: string;
      status?: string;
      createdAfter?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      createdBefore?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      startedAfter?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      startedBefore?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      endedAfter?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
      endedBefore?: googleProtobuf002.Timestamp.AsProtobufJSON | null;
    }
  }

  /**
   * Message implementation for armonik.api.grpc.v1.tasks.ListTasksRequest.Sort
   */
  export class Sort implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.tasks.ListTasksRequest.Sort';

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

    private _field?: ListTasksRequest.OrderByField;
    private _direction?: ListTasksRequest.OrderDirection;

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
    get field(): ListTasksRequest.OrderByField | undefined {
      return this._field;
    }
    set field(value: ListTasksRequest.OrderByField | undefined) {
      this._field = value;
    }
    get direction(): ListTasksRequest.OrderDirection | undefined {
      return this._direction;
    }
    set direction(value: ListTasksRequest.OrderDirection | undefined) {
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
          ListTasksRequest.OrderByField[
            this.field === null || this.field === undefined ? 0 : this.field
          ],
        direction:
          ListTasksRequest.OrderDirection[
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
      field?: ListTasksRequest.OrderByField;
      direction?: ListTasksRequest.OrderDirection;
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
 * Message implementation for armonik.api.grpc.v1.tasks.ListTasksResponse
 */
export class ListTasksResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.ListTasksResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ListTasksResponse();
    ListTasksResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ListTasksResponse) {
    _instance.tasks = _instance.tasks || [];
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
    _instance: ListTasksResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new TaskSummary();
          _reader.readMessage(
            messageInitializer1,
            TaskSummary.deserializeBinaryFromReader
          );
          (_instance.tasks = _instance.tasks || []).push(messageInitializer1);
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

    ListTasksResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ListTasksResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.tasks && _instance.tasks.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.tasks as any,
        TaskSummary.serializeBinaryToWriter
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

  private _tasks?: TaskSummary[];
  private _page?: number;
  private _pageSize?: number;
  private _total?: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ListTasksResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<ListTasksResponse.AsObject>) {
    _value = _value || {};
    this.tasks = (_value.tasks || []).map(m => new TaskSummary(m));
    this.page = _value.page;
    this.pageSize = _value.pageSize;
    this.total = _value.total;
    ListTasksResponse.refineValues(this);
  }
  get tasks(): TaskSummary[] | undefined {
    return this._tasks;
  }
  set tasks(value: TaskSummary[] | undefined) {
    this._tasks = value;
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
    ListTasksResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ListTasksResponse.AsObject {
    return {
      tasks: (this.tasks || []).map(m => m.toObject()),
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
  ): ListTasksResponse.AsProtobufJSON {
    return {
      tasks: (this.tasks || []).map(m => m.toProtobufJSON(options)),
      page: this.page,
      pageSize: this.pageSize,
      total: this.total
    };
  }
}
export module ListTasksResponse {
  /**
   * Standard JavaScript object representation for ListTasksResponse
   */
  export interface AsObject {
    tasks?: TaskSummary.AsObject[];
    page?: number;
    pageSize?: number;
    total?: number;
  }

  /**
   * Protobuf JSON representation for ListTasksResponse
   */
  export interface AsProtobufJSON {
    tasks?: TaskSummary.AsProtobufJSON[] | null;
    page?: number;
    pageSize?: number;
    total?: number;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.GetTaskRequest
 */
export class GetTaskRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.GetTaskRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetTaskRequest();
    GetTaskRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetTaskRequest) {
    _instance.taskId = _instance.taskId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetTaskRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.taskId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    GetTaskRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetTaskRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.taskId) {
      _writer.writeString(1, _instance.taskId);
    }
  }

  private _taskId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetTaskRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetTaskRequest.AsObject>) {
    _value = _value || {};
    this.taskId = _value.taskId;
    GetTaskRequest.refineValues(this);
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
    GetTaskRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetTaskRequest.AsObject {
    return {
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
  ): GetTaskRequest.AsProtobufJSON {
    return {
      taskId: this.taskId
    };
  }
}
export module GetTaskRequest {
  /**
   * Standard JavaScript object representation for GetTaskRequest
   */
  export interface AsObject {
    taskId?: string;
  }

  /**
   * Protobuf JSON representation for GetTaskRequest
   */
  export interface AsProtobufJSON {
    taskId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.GetTaskResponse
 */
export class GetTaskResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.GetTaskResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetTaskResponse();
    GetTaskResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetTaskResponse) {
    _instance.task = _instance.task || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetTaskResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.task = new TaskRaw();
          _reader.readMessage(
            _instance.task,
            TaskRaw.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetTaskResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetTaskResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.task) {
      _writer.writeMessage(
        1,
        _instance.task as any,
        TaskRaw.serializeBinaryToWriter
      );
    }
  }

  private _task?: TaskRaw;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetTaskResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetTaskResponse.AsObject>) {
    _value = _value || {};
    this.task = _value.task ? new TaskRaw(_value.task) : undefined;
    GetTaskResponse.refineValues(this);
  }
  get task(): TaskRaw | undefined {
    return this._task;
  }
  set task(value: TaskRaw | undefined) {
    this._task = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetTaskResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetTaskResponse.AsObject {
    return {
      task: this.task ? this.task.toObject() : undefined
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
  ): GetTaskResponse.AsProtobufJSON {
    return {
      task: this.task ? this.task.toProtobufJSON(options) : null
    };
  }
}
export module GetTaskResponse {
  /**
   * Standard JavaScript object representation for GetTaskResponse
   */
  export interface AsObject {
    task?: TaskRaw.AsObject;
  }

  /**
   * Protobuf JSON representation for GetTaskResponse
   */
  export interface AsProtobufJSON {
    task?: TaskRaw.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.CancelTasksRequest
 */
export class CancelTasksRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.CancelTasksRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CancelTasksRequest();
    CancelTasksRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CancelTasksRequest) {
    _instance.taskIds = _instance.taskIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CancelTasksRequest,
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

    CancelTasksRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CancelTasksRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.taskIds && _instance.taskIds.length) {
      _writer.writeRepeatedString(1, _instance.taskIds);
    }
  }

  private _taskIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CancelTasksRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CancelTasksRequest.AsObject>) {
    _value = _value || {};
    this.taskIds = (_value.taskIds || []).slice();
    CancelTasksRequest.refineValues(this);
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
    CancelTasksRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CancelTasksRequest.AsObject {
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
  ): CancelTasksRequest.AsProtobufJSON {
    return {
      taskIds: (this.taskIds || []).slice()
    };
  }
}
export module CancelTasksRequest {
  /**
   * Standard JavaScript object representation for CancelTasksRequest
   */
  export interface AsObject {
    taskIds?: string[];
  }

  /**
   * Protobuf JSON representation for CancelTasksRequest
   */
  export interface AsProtobufJSON {
    taskIds?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.CancelTasksResponse
 */
export class CancelTasksResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.CancelTasksResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CancelTasksResponse();
    CancelTasksResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CancelTasksResponse) {
    _instance.tasks = _instance.tasks || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CancelTasksResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new TaskSummary();
          _reader.readMessage(
            messageInitializer1,
            TaskSummary.deserializeBinaryFromReader
          );
          (_instance.tasks = _instance.tasks || []).push(messageInitializer1);
          break;
        default:
          _reader.skipField();
      }
    }

    CancelTasksResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CancelTasksResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.tasks && _instance.tasks.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.tasks as any,
        TaskSummary.serializeBinaryToWriter
      );
    }
  }

  private _tasks?: TaskSummary[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CancelTasksResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<CancelTasksResponse.AsObject>) {
    _value = _value || {};
    this.tasks = (_value.tasks || []).map(m => new TaskSummary(m));
    CancelTasksResponse.refineValues(this);
  }
  get tasks(): TaskSummary[] | undefined {
    return this._tasks;
  }
  set tasks(value: TaskSummary[] | undefined) {
    this._tasks = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CancelTasksResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CancelTasksResponse.AsObject {
    return {
      tasks: (this.tasks || []).map(m => m.toObject())
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
  ): CancelTasksResponse.AsProtobufJSON {
    return {
      tasks: (this.tasks || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module CancelTasksResponse {
  /**
   * Standard JavaScript object representation for CancelTasksResponse
   */
  export interface AsObject {
    tasks?: TaskSummary.AsObject[];
  }

  /**
   * Protobuf JSON representation for CancelTasksResponse
   */
  export interface AsProtobufJSON {
    tasks?: TaskSummary.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.GetResultIdsRequest
 */
export class GetResultIdsRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.GetResultIdsRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetResultIdsRequest();
    GetResultIdsRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetResultIdsRequest) {
    _instance.taskId = _instance.taskId || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetResultIdsRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.taskId = _instance.taskId || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetResultIdsRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetResultIdsRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.taskId && _instance.taskId.length) {
      _writer.writeRepeatedString(1, _instance.taskId);
    }
  }

  private _taskId?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetResultIdsRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetResultIdsRequest.AsObject>) {
    _value = _value || {};
    this.taskId = (_value.taskId || []).slice();
    GetResultIdsRequest.refineValues(this);
  }
  get taskId(): string[] | undefined {
    return this._taskId;
  }
  set taskId(value: string[] | undefined) {
    this._taskId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetResultIdsRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetResultIdsRequest.AsObject {
    return {
      taskId: (this.taskId || []).slice()
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
  ): GetResultIdsRequest.AsProtobufJSON {
    return {
      taskId: (this.taskId || []).slice()
    };
  }
}
export module GetResultIdsRequest {
  /**
   * Standard JavaScript object representation for GetResultIdsRequest
   */
  export interface AsObject {
    taskId?: string[];
  }

  /**
   * Protobuf JSON representation for GetResultIdsRequest
   */
  export interface AsProtobufJSON {
    taskId?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.tasks.GetResultIdsResponse
 */
export class GetResultIdsResponse implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.tasks.GetResultIdsResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new GetResultIdsResponse();
    GetResultIdsResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: GetResultIdsResponse) {
    _instance.taskResults = _instance.taskResults || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: GetResultIdsResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new GetResultIdsResponse.MapTaskResult();
          _reader.readMessage(
            messageInitializer1,
            GetResultIdsResponse.MapTaskResult.deserializeBinaryFromReader
          );
          (_instance.taskResults = _instance.taskResults || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    GetResultIdsResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: GetResultIdsResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.taskResults && _instance.taskResults.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.taskResults as any,
        GetResultIdsResponse.MapTaskResult.serializeBinaryToWriter
      );
    }
  }

  private _taskResults?: GetResultIdsResponse.MapTaskResult[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of GetResultIdsResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<GetResultIdsResponse.AsObject>) {
    _value = _value || {};
    this.taskResults = (_value.taskResults || []).map(
      m => new GetResultIdsResponse.MapTaskResult(m)
    );
    GetResultIdsResponse.refineValues(this);
  }
  get taskResults(): GetResultIdsResponse.MapTaskResult[] | undefined {
    return this._taskResults;
  }
  set taskResults(value: GetResultIdsResponse.MapTaskResult[] | undefined) {
    this._taskResults = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    GetResultIdsResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): GetResultIdsResponse.AsObject {
    return {
      taskResults: (this.taskResults || []).map(m => m.toObject())
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
  ): GetResultIdsResponse.AsProtobufJSON {
    return {
      taskResults: (this.taskResults || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module GetResultIdsResponse {
  /**
   * Standard JavaScript object representation for GetResultIdsResponse
   */
  export interface AsObject {
    taskResults?: GetResultIdsResponse.MapTaskResult.AsObject[];
  }

  /**
   * Protobuf JSON representation for GetResultIdsResponse
   */
  export interface AsProtobufJSON {
    taskResults?: GetResultIdsResponse.MapTaskResult.AsProtobufJSON[] | null;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.tasks.GetResultIdsResponse.MapTaskResult
   */
  export class MapTaskResult implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.tasks.GetResultIdsResponse.MapTaskResult';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new MapTaskResult();
      MapTaskResult.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: MapTaskResult) {
      _instance.taskId = _instance.taskId || '';
      _instance.resultIds = _instance.resultIds || [];
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: MapTaskResult,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.taskId = _reader.readString();
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

      MapTaskResult.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: MapTaskResult,
      _writer: BinaryWriter
    ) {
      if (_instance.taskId) {
        _writer.writeString(1, _instance.taskId);
      }
      if (_instance.resultIds && _instance.resultIds.length) {
        _writer.writeRepeatedString(2, _instance.resultIds);
      }
    }

    private _taskId?: string;
    private _resultIds?: string[];

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of MapTaskResult to deeply clone from
     */
    constructor(_value?: RecursivePartial<MapTaskResult.AsObject>) {
      _value = _value || {};
      this.taskId = _value.taskId;
      this.resultIds = (_value.resultIds || []).slice();
      MapTaskResult.refineValues(this);
    }
    get taskId(): string | undefined {
      return this._taskId;
    }
    set taskId(value: string | undefined) {
      this._taskId = value;
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
      MapTaskResult.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): MapTaskResult.AsObject {
      return {
        taskId: this.taskId,
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
    ): MapTaskResult.AsProtobufJSON {
      return {
        taskId: this.taskId,
        resultIds: (this.resultIds || []).slice()
      };
    }
  }
  export module MapTaskResult {
    /**
     * Standard JavaScript object representation for MapTaskResult
     */
    export interface AsObject {
      taskId?: string;
      resultIds?: string[];
    }

    /**
     * Protobuf JSON representation for MapTaskResult
     */
    export interface AsProtobufJSON {
      taskId?: string;
      resultIds?: string[];
    }
  }
}
