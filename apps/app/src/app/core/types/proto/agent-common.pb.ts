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
/**
 * Message implementation for armonik.api.grpc.v1.agent.CreateTaskRequest
 */
export class CreateTaskRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.agent.CreateTaskRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CreateTaskRequest();
    CreateTaskRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CreateTaskRequest) {
    _instance.communicationToken = _instance.communicationToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CreateTaskRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.initRequest = new CreateTaskRequest.InitRequest();
          _reader.readMessage(
            _instance.initRequest,
            CreateTaskRequest.InitRequest.deserializeBinaryFromReader
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
        case 4:
          _instance.communicationToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    CreateTaskRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CreateTaskRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.initRequest) {
      _writer.writeMessage(
        1,
        _instance.initRequest as any,
        CreateTaskRequest.InitRequest.serializeBinaryToWriter
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
    if (_instance.communicationToken) {
      _writer.writeString(4, _instance.communicationToken);
    }
  }

  private _initRequest?: CreateTaskRequest.InitRequest;
  private _initTask?: armonikApiGrpcV1002.InitTaskRequest;
  private _taskPayload?: armonikApiGrpcV1002.DataChunk;
  private _communicationToken?: string;

  private _type: CreateTaskRequest.TypeCase = CreateTaskRequest.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CreateTaskRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CreateTaskRequest.AsObject>) {
    _value = _value || {};
    this.initRequest = _value.initRequest
      ? new CreateTaskRequest.InitRequest(_value.initRequest)
      : undefined;
    this.initTask = _value.initTask
      ? new armonikApiGrpcV1002.InitTaskRequest(_value.initTask)
      : undefined;
    this.taskPayload = _value.taskPayload
      ? new armonikApiGrpcV1002.DataChunk(_value.taskPayload)
      : undefined;
    this.communicationToken = _value.communicationToken;
    CreateTaskRequest.refineValues(this);
  }
  get initRequest(): CreateTaskRequest.InitRequest | undefined {
    return this._initRequest;
  }
  set initRequest(value: CreateTaskRequest.InitRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._initTask = this._taskPayload = undefined;
      this._type = CreateTaskRequest.TypeCase.initRequest;
    }
    this._initRequest = value;
  }
  get initTask(): armonikApiGrpcV1002.InitTaskRequest | undefined {
    return this._initTask;
  }
  set initTask(value: armonikApiGrpcV1002.InitTaskRequest | undefined) {
    if (value !== undefined && value !== null) {
      this._initRequest = this._taskPayload = undefined;
      this._type = CreateTaskRequest.TypeCase.initTask;
    }
    this._initTask = value;
  }
  get taskPayload(): armonikApiGrpcV1002.DataChunk | undefined {
    return this._taskPayload;
  }
  set taskPayload(value: armonikApiGrpcV1002.DataChunk | undefined) {
    if (value !== undefined && value !== null) {
      this._initRequest = this._initTask = undefined;
      this._type = CreateTaskRequest.TypeCase.taskPayload;
    }
    this._taskPayload = value;
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
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
    CreateTaskRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CreateTaskRequest.AsObject {
    return {
      initRequest: this.initRequest ? this.initRequest.toObject() : undefined,
      initTask: this.initTask ? this.initTask.toObject() : undefined,
      taskPayload: this.taskPayload ? this.taskPayload.toObject() : undefined,
      communicationToken: this.communicationToken
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
  ): CreateTaskRequest.AsProtobufJSON {
    return {
      initRequest: this.initRequest
        ? this.initRequest.toProtobufJSON(options)
        : null,
      initTask: this.initTask ? this.initTask.toProtobufJSON(options) : null,
      taskPayload: this.taskPayload
        ? this.taskPayload.toProtobufJSON(options)
        : null,
      communicationToken: this.communicationToken
    };
  }
}
export module CreateTaskRequest {
  /**
   * Standard JavaScript object representation for CreateTaskRequest
   */
  export interface AsObject {
    initRequest?: CreateTaskRequest.InitRequest.AsObject;
    initTask?: armonikApiGrpcV1002.InitTaskRequest.AsObject;
    taskPayload?: armonikApiGrpcV1002.DataChunk.AsObject;
    communicationToken?: string;
  }

  /**
   * Protobuf JSON representation for CreateTaskRequest
   */
  export interface AsProtobufJSON {
    initRequest?: CreateTaskRequest.InitRequest.AsProtobufJSON | null;
    initTask?: armonikApiGrpcV1002.InitTaskRequest.AsProtobufJSON | null;
    taskPayload?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
    communicationToken?: string;
  }
  export enum TypeCase {
    none = 0,
    initRequest = 1,
    initTask = 2,
    taskPayload = 3
  }
  /**
   * Message implementation for armonik.api.grpc.v1.agent.CreateTaskRequest.InitRequest
   */
  export class InitRequest implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.agent.CreateTaskRequest.InitRequest';

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
      if (_instance.taskOptions) {
        _writer.writeMessage(
          1,
          _instance.taskOptions as any,
          armonikApiGrpcV1002.TaskOptions.serializeBinaryToWriter
        );
      }
    }

    private _taskOptions?: armonikApiGrpcV1002.TaskOptions;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of InitRequest to deeply clone from
     */
    constructor(_value?: RecursivePartial<InitRequest.AsObject>) {
      _value = _value || {};
      this.taskOptions = _value.taskOptions
        ? new armonikApiGrpcV1002.TaskOptions(_value.taskOptions)
        : undefined;
      InitRequest.refineValues(this);
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
      taskOptions?: armonikApiGrpcV1002.TaskOptions.AsObject;
    }

    /**
     * Protobuf JSON representation for InitRequest
     */
    export interface AsProtobufJSON {
      taskOptions?: armonikApiGrpcV1002.TaskOptions.AsProtobufJSON | null;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.agent.CreateTaskReply
 */
export class CreateTaskReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.agent.CreateTaskReply';

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
  static refineValues(_instance: CreateTaskReply) {
    _instance.communicationToken = _instance.communicationToken || '';
  }

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
        case 4:
          _instance.communicationToken = _reader.readString();
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
    if (_instance.communicationToken) {
      _writer.writeString(4, _instance.communicationToken);
    }
  }

  private _creationStatusList?: CreateTaskReply.CreationStatusList;
  private _error?: string;
  private _communicationToken?: string;

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
    this.communicationToken = _value.communicationToken;
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
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
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
      error: this.error,
      communicationToken: this.communicationToken
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
      error:
        this.error === null || this.error === undefined ? null : this.error,
      communicationToken: this.communicationToken
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
    communicationToken?: string;
  }

  /**
   * Protobuf JSON representation for CreateTaskReply
   */
  export interface AsProtobufJSON {
    creationStatusList?: CreateTaskReply.CreationStatusList.AsProtobufJSON | null;
    error?: string | null;
    communicationToken?: string;
  }
  export enum ResponseCase {
    none = 0,
    creationStatusList = 1,
    error = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.agent.CreateTaskReply.TaskInfo
   */
  export class TaskInfo implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.agent.CreateTaskReply.TaskInfo';

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
   * Message implementation for armonik.api.grpc.v1.agent.CreateTaskReply.CreationStatus
   */
  export class CreationStatus implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.agent.CreateTaskReply.CreationStatus';

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
   * Message implementation for armonik.api.grpc.v1.agent.CreateTaskReply.CreationStatusList
   */
  export class CreationStatusList implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.agent.CreateTaskReply.CreationStatusList';

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
 * Message implementation for armonik.api.grpc.v1.agent.DataRequest
 */
export class DataRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.agent.DataRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DataRequest();
    DataRequest.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DataRequest) {
    _instance.communicationToken = _instance.communicationToken || '';
    _instance.key = _instance.key || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DataRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.communicationToken = _reader.readString();
          break;
        case 2:
          _instance.key = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DataRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DataRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.communicationToken) {
      _writer.writeString(1, _instance.communicationToken);
    }
    if (_instance.key) {
      _writer.writeString(2, _instance.key);
    }
  }

  private _communicationToken?: string;
  private _key?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DataRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DataRequest.AsObject>) {
    _value = _value || {};
    this.communicationToken = _value.communicationToken;
    this.key = _value.key;
    DataRequest.refineValues(this);
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
  }
  get key(): string | undefined {
    return this._key;
  }
  set key(value: string | undefined) {
    this._key = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DataRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DataRequest.AsObject {
    return {
      communicationToken: this.communicationToken,
      key: this.key
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
  ): DataRequest.AsProtobufJSON {
    return {
      communicationToken: this.communicationToken,
      key: this.key
    };
  }
}
export module DataRequest {
  /**
   * Standard JavaScript object representation for DataRequest
   */
  export interface AsObject {
    communicationToken?: string;
    key?: string;
  }

  /**
   * Protobuf JSON representation for DataRequest
   */
  export interface AsProtobufJSON {
    communicationToken?: string;
    key?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.agent.DataReply
 */
export class DataReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.agent.DataReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DataReply();
    DataReply.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DataReply) {
    _instance.communicationToken = _instance.communicationToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DataReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.communicationToken = _reader.readString();
          break;
        case 2:
          _instance.init = new DataReply.Init();
          _reader.readMessage(
            _instance.init,
            DataReply.Init.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.data = new armonikApiGrpcV1002.DataChunk();
          _reader.readMessage(
            _instance.data,
            armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.error = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DataReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: DataReply, _writer: BinaryWriter) {
    if (_instance.communicationToken) {
      _writer.writeString(1, _instance.communicationToken);
    }
    if (_instance.init) {
      _writer.writeMessage(
        2,
        _instance.init as any,
        DataReply.Init.serializeBinaryToWriter
      );
    }
    if (_instance.data) {
      _writer.writeMessage(
        3,
        _instance.data as any,
        armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
      );
    }
    if (_instance.error || _instance.error === '') {
      _writer.writeString(4, _instance.error);
    }
  }

  private _communicationToken?: string;
  private _init?: DataReply.Init;
  private _data?: armonikApiGrpcV1002.DataChunk;
  private _error?: string;

  private _type: DataReply.TypeCase = DataReply.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DataReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<DataReply.AsObject>) {
    _value = _value || {};
    this.communicationToken = _value.communicationToken;
    this.init = _value.init ? new DataReply.Init(_value.init) : undefined;
    this.data = _value.data
      ? new armonikApiGrpcV1002.DataChunk(_value.data)
      : undefined;
    this.error = _value.error;
    DataReply.refineValues(this);
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
  }
  get init(): DataReply.Init | undefined {
    return this._init;
  }
  set init(value: DataReply.Init | undefined) {
    if (value !== undefined && value !== null) {
      this._data = this._error = undefined;
      this._type = DataReply.TypeCase.init;
    }
    this._init = value;
  }
  get data(): armonikApiGrpcV1002.DataChunk | undefined {
    return this._data;
  }
  set data(value: armonikApiGrpcV1002.DataChunk | undefined) {
    if (value !== undefined && value !== null) {
      this._init = this._error = undefined;
      this._type = DataReply.TypeCase.data;
    }
    this._data = value;
  }
  get error(): string | undefined {
    return this._error;
  }
  set error(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._init = this._data = undefined;
      this._type = DataReply.TypeCase.error;
    }
    this._error = value;
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
    DataReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DataReply.AsObject {
    return {
      communicationToken: this.communicationToken,
      init: this.init ? this.init.toObject() : undefined,
      data: this.data ? this.data.toObject() : undefined,
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
  ): DataReply.AsProtobufJSON {
    return {
      communicationToken: this.communicationToken,
      init: this.init ? this.init.toProtobufJSON(options) : null,
      data: this.data ? this.data.toProtobufJSON(options) : null,
      error: this.error === null || this.error === undefined ? null : this.error
    };
  }
}
export module DataReply {
  /**
   * Standard JavaScript object representation for DataReply
   */
  export interface AsObject {
    communicationToken?: string;
    init?: DataReply.Init.AsObject;
    data?: armonikApiGrpcV1002.DataChunk.AsObject;
    error?: string;
  }

  /**
   * Protobuf JSON representation for DataReply
   */
  export interface AsProtobufJSON {
    communicationToken?: string;
    init?: DataReply.Init.AsProtobufJSON | null;
    data?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
    error?: string | null;
  }
  export enum TypeCase {
    none = 0,
    init = 1,
    data = 2,
    error = 3
  }
  /**
   * Message implementation for armonik.api.grpc.v1.agent.DataReply.Init
   */
  export class Init implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.agent.DataReply.Init';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new Init();
      Init.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: Init) {
      _instance.key = _instance.key || '';
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(_instance: Init, _reader: BinaryReader) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.key = _reader.readString();
            break;
          case 2:
            _instance.data = new armonikApiGrpcV1002.DataChunk();
            _reader.readMessage(
              _instance.data,
              armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
            );
            break;
          case 3:
            _instance.error = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      Init.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: Init, _writer: BinaryWriter) {
      if (_instance.key) {
        _writer.writeString(1, _instance.key);
      }
      if (_instance.data) {
        _writer.writeMessage(
          2,
          _instance.data as any,
          armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
        );
      }
      if (_instance.error || _instance.error === '') {
        _writer.writeString(3, _instance.error);
      }
    }

    private _key?: string;
    private _data?: armonikApiGrpcV1002.DataChunk;
    private _error?: string;

    private _hasResult: Init.HasResultCase = Init.HasResultCase.none;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Init to deeply clone from
     */
    constructor(_value?: RecursivePartial<Init.AsObject>) {
      _value = _value || {};
      this.key = _value.key;
      this.data = _value.data
        ? new armonikApiGrpcV1002.DataChunk(_value.data)
        : undefined;
      this.error = _value.error;
      Init.refineValues(this);
    }
    get key(): string | undefined {
      return this._key;
    }
    set key(value: string | undefined) {
      this._key = value;
    }
    get data(): armonikApiGrpcV1002.DataChunk | undefined {
      return this._data;
    }
    set data(value: armonikApiGrpcV1002.DataChunk | undefined) {
      if (value !== undefined && value !== null) {
        this._error = undefined;
        this._hasResult = Init.HasResultCase.data;
      }
      this._data = value;
    }
    get error(): string | undefined {
      return this._error;
    }
    set error(value: string | undefined) {
      if (value !== undefined && value !== null) {
        this._data = undefined;
        this._hasResult = Init.HasResultCase.error;
      }
      this._error = value;
    }
    get hasResult() {
      return this._hasResult;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      Init.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): Init.AsObject {
      return {
        key: this.key,
        data: this.data ? this.data.toObject() : undefined,
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
    ): Init.AsProtobufJSON {
      return {
        key: this.key,
        data: this.data ? this.data.toProtobufJSON(options) : null,
        error:
          this.error === null || this.error === undefined ? null : this.error
      };
    }
  }
  export module Init {
    /**
     * Standard JavaScript object representation for Init
     */
    export interface AsObject {
      key?: string;
      data?: armonikApiGrpcV1002.DataChunk.AsObject;
      error?: string;
    }

    /**
     * Protobuf JSON representation for Init
     */
    export interface AsProtobufJSON {
      key?: string;
      data?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
      error?: string | null;
    }
    export enum HasResultCase {
      none = 0,
      data = 1,
      error = 2
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.agent.Result
 */
export class Result implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.agent.Result';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Result();
    Result.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Result) {
    _instance.communicationToken = _instance.communicationToken || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Result, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.init = new armonikApiGrpcV1002.InitKeyedDataStream();
          _reader.readMessage(
            _instance.init,
            armonikApiGrpcV1002.InitKeyedDataStream.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.data = new armonikApiGrpcV1002.DataChunk();
          _reader.readMessage(
            _instance.data,
            armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.communicationToken = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Result.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Result, _writer: BinaryWriter) {
    if (_instance.init) {
      _writer.writeMessage(
        1,
        _instance.init as any,
        armonikApiGrpcV1002.InitKeyedDataStream.serializeBinaryToWriter
      );
    }
    if (_instance.data) {
      _writer.writeMessage(
        2,
        _instance.data as any,
        armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
      );
    }
    if (_instance.communicationToken) {
      _writer.writeString(3, _instance.communicationToken);
    }
  }

  private _init?: armonikApiGrpcV1002.InitKeyedDataStream;
  private _data?: armonikApiGrpcV1002.DataChunk;
  private _communicationToken?: string;

  private _type: Result.TypeCase = Result.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Result to deeply clone from
   */
  constructor(_value?: RecursivePartial<Result.AsObject>) {
    _value = _value || {};
    this.init = _value.init
      ? new armonikApiGrpcV1002.InitKeyedDataStream(_value.init)
      : undefined;
    this.data = _value.data
      ? new armonikApiGrpcV1002.DataChunk(_value.data)
      : undefined;
    this.communicationToken = _value.communicationToken;
    Result.refineValues(this);
  }
  get init(): armonikApiGrpcV1002.InitKeyedDataStream | undefined {
    return this._init;
  }
  set init(value: armonikApiGrpcV1002.InitKeyedDataStream | undefined) {
    if (value !== undefined && value !== null) {
      this._data = undefined;
      this._type = Result.TypeCase.init;
    }
    this._init = value;
  }
  get data(): armonikApiGrpcV1002.DataChunk | undefined {
    return this._data;
  }
  set data(value: armonikApiGrpcV1002.DataChunk | undefined) {
    if (value !== undefined && value !== null) {
      this._init = undefined;
      this._type = Result.TypeCase.data;
    }
    this._data = value;
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
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
    Result.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Result.AsObject {
    return {
      init: this.init ? this.init.toObject() : undefined,
      data: this.data ? this.data.toObject() : undefined,
      communicationToken: this.communicationToken
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
  ): Result.AsProtobufJSON {
    return {
      init: this.init ? this.init.toProtobufJSON(options) : null,
      data: this.data ? this.data.toProtobufJSON(options) : null,
      communicationToken: this.communicationToken
    };
  }
}
export module Result {
  /**
   * Standard JavaScript object representation for Result
   */
  export interface AsObject {
    init?: armonikApiGrpcV1002.InitKeyedDataStream.AsObject;
    data?: armonikApiGrpcV1002.DataChunk.AsObject;
    communicationToken?: string;
  }

  /**
   * Protobuf JSON representation for Result
   */
  export interface AsProtobufJSON {
    init?: armonikApiGrpcV1002.InitKeyedDataStream.AsProtobufJSON | null;
    data?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
    communicationToken?: string;
  }
  export enum TypeCase {
    none = 0,
    init = 1,
    data = 2
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.agent.ResultReply
 */
export class ResultReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.agent.ResultReply';

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
  static refineValues(_instance: ResultReply) {
    _instance.communicationToken = _instance.communicationToken || '';
  }

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
        case 3:
          _instance.communicationToken = _reader.readString();
          break;
        case 1:
          _instance.ok = new armonikApiGrpcV1002.Empty();
          _reader.readMessage(
            _instance.ok,
            armonikApiGrpcV1002.Empty.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.error = _reader.readString();
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
    if (_instance.communicationToken) {
      _writer.writeString(3, _instance.communicationToken);
    }
    if (_instance.ok) {
      _writer.writeMessage(
        1,
        _instance.ok as any,
        armonikApiGrpcV1002.Empty.serializeBinaryToWriter
      );
    }
    if (_instance.error || _instance.error === '') {
      _writer.writeString(2, _instance.error);
    }
  }

  private _communicationToken?: string;
  private _ok?: armonikApiGrpcV1002.Empty;
  private _error?: string;

  private _type: ResultReply.TypeCase = ResultReply.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ResultReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<ResultReply.AsObject>) {
    _value = _value || {};
    this.communicationToken = _value.communicationToken;
    this.ok = _value.ok ? new armonikApiGrpcV1002.Empty(_value.ok) : undefined;
    this.error = _value.error;
    ResultReply.refineValues(this);
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
  }
  get ok(): armonikApiGrpcV1002.Empty | undefined {
    return this._ok;
  }
  set ok(value: armonikApiGrpcV1002.Empty | undefined) {
    if (value !== undefined && value !== null) {
      this._error = undefined;
      this._type = ResultReply.TypeCase.ok;
    }
    this._ok = value;
  }
  get error(): string | undefined {
    return this._error;
  }
  set error(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._ok = undefined;
      this._type = ResultReply.TypeCase.error;
    }
    this._error = value;
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
      communicationToken: this.communicationToken,
      ok: this.ok ? this.ok.toObject() : undefined,
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
  ): ResultReply.AsProtobufJSON {
    return {
      communicationToken: this.communicationToken,
      ok: this.ok ? this.ok.toProtobufJSON(options) : null,
      error: this.error === null || this.error === undefined ? null : this.error
    };
  }
}
export module ResultReply {
  /**
   * Standard JavaScript object representation for ResultReply
   */
  export interface AsObject {
    communicationToken?: string;
    ok?: armonikApiGrpcV1002.Empty.AsObject;
    error?: string;
  }

  /**
   * Protobuf JSON representation for ResultReply
   */
  export interface AsProtobufJSON {
    communicationToken?: string;
    ok?: armonikApiGrpcV1002.Empty.AsProtobufJSON | null;
    error?: string | null;
  }
  export enum TypeCase {
    none = 0,
    ok = 1,
    error = 2
  }
}
