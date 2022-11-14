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
 * Message implementation for armonik.api.grpc.v1.worker.ProcessRequest
 */
export class ProcessRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.worker.ProcessRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ProcessRequest();
    ProcessRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ProcessRequest) {
    _instance.communicationToken = _instance.communicationToken || '';
    _instance.compute = _instance.compute || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ProcessRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.communicationToken = _reader.readString();
          break;
        case 2:
          _instance.compute = new ProcessRequest.ComputeRequest();
          _reader.readMessage(
            _instance.compute,
            ProcessRequest.ComputeRequest.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ProcessRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ProcessRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.communicationToken) {
      _writer.writeString(1, _instance.communicationToken);
    }
    if (_instance.compute) {
      _writer.writeMessage(
        2,
        _instance.compute as any,
        ProcessRequest.ComputeRequest.serializeBinaryToWriter
      );
    }
  }

  private _communicationToken?: string;
  private _compute?: ProcessRequest.ComputeRequest;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ProcessRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ProcessRequest.AsObject>) {
    _value = _value || {};
    this.communicationToken = _value.communicationToken;
    this.compute = _value.compute
      ? new ProcessRequest.ComputeRequest(_value.compute)
      : undefined;
    ProcessRequest.refineValues(this);
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
  }
  get compute(): ProcessRequest.ComputeRequest | undefined {
    return this._compute;
  }
  set compute(value: ProcessRequest.ComputeRequest | undefined) {
    this._compute = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ProcessRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ProcessRequest.AsObject {
    return {
      communicationToken: this.communicationToken,
      compute: this.compute ? this.compute.toObject() : undefined
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
  ): ProcessRequest.AsProtobufJSON {
    return {
      communicationToken: this.communicationToken,
      compute: this.compute ? this.compute.toProtobufJSON(options) : null
    };
  }
}
export module ProcessRequest {
  /**
   * Standard JavaScript object representation for ProcessRequest
   */
  export interface AsObject {
    communicationToken?: string;
    compute?: ProcessRequest.ComputeRequest.AsObject;
  }

  /**
   * Protobuf JSON representation for ProcessRequest
   */
  export interface AsProtobufJSON {
    communicationToken?: string;
    compute?: ProcessRequest.ComputeRequest.AsProtobufJSON | null;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.worker.ProcessRequest.ComputeRequest
   */
  export class ComputeRequest implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.worker.ProcessRequest.ComputeRequest';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new ComputeRequest();
      ComputeRequest.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: ComputeRequest) {}

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: ComputeRequest,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.initRequest = new ProcessRequest.ComputeRequest.InitRequest();
            _reader.readMessage(
              _instance.initRequest,
              ProcessRequest.ComputeRequest.InitRequest
                .deserializeBinaryFromReader
            );
            break;
          case 2:
            _instance.payload = new armonikApiGrpcV1002.DataChunk();
            _reader.readMessage(
              _instance.payload,
              armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
            );
            break;
          case 3:
            _instance.initData = new ProcessRequest.ComputeRequest.InitData();
            _reader.readMessage(
              _instance.initData,
              ProcessRequest.ComputeRequest.InitData.deserializeBinaryFromReader
            );
            break;
          case 4:
            _instance.data = new armonikApiGrpcV1002.DataChunk();
            _reader.readMessage(
              _instance.data,
              armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
            );
            break;
          default:
            _reader.skipField();
        }
      }

      ComputeRequest.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: ComputeRequest,
      _writer: BinaryWriter
    ) {
      if (_instance.initRequest) {
        _writer.writeMessage(
          1,
          _instance.initRequest as any,
          ProcessRequest.ComputeRequest.InitRequest.serializeBinaryToWriter
        );
      }
      if (_instance.payload) {
        _writer.writeMessage(
          2,
          _instance.payload as any,
          armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
        );
      }
      if (_instance.initData) {
        _writer.writeMessage(
          3,
          _instance.initData as any,
          ProcessRequest.ComputeRequest.InitData.serializeBinaryToWriter
        );
      }
      if (_instance.data) {
        _writer.writeMessage(
          4,
          _instance.data as any,
          armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
        );
      }
    }

    private _initRequest?: ProcessRequest.ComputeRequest.InitRequest;
    private _payload?: armonikApiGrpcV1002.DataChunk;
    private _initData?: ProcessRequest.ComputeRequest.InitData;
    private _data?: armonikApiGrpcV1002.DataChunk;

    private _type: ComputeRequest.TypeCase = ComputeRequest.TypeCase.none;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of ComputeRequest to deeply clone from
     */
    constructor(_value?: RecursivePartial<ComputeRequest.AsObject>) {
      _value = _value || {};
      this.initRequest = _value.initRequest
        ? new ProcessRequest.ComputeRequest.InitRequest(_value.initRequest)
        : undefined;
      this.payload = _value.payload
        ? new armonikApiGrpcV1002.DataChunk(_value.payload)
        : undefined;
      this.initData = _value.initData
        ? new ProcessRequest.ComputeRequest.InitData(_value.initData)
        : undefined;
      this.data = _value.data
        ? new armonikApiGrpcV1002.DataChunk(_value.data)
        : undefined;
      ComputeRequest.refineValues(this);
    }
    get initRequest(): ProcessRequest.ComputeRequest.InitRequest | undefined {
      return this._initRequest;
    }
    set initRequest(
      value: ProcessRequest.ComputeRequest.InitRequest | undefined
    ) {
      if (value !== undefined && value !== null) {
        this._payload = this._initData = this._data = undefined;
        this._type = ComputeRequest.TypeCase.initRequest;
      }
      this._initRequest = value;
    }
    get payload(): armonikApiGrpcV1002.DataChunk | undefined {
      return this._payload;
    }
    set payload(value: armonikApiGrpcV1002.DataChunk | undefined) {
      if (value !== undefined && value !== null) {
        this._initRequest = this._initData = this._data = undefined;
        this._type = ComputeRequest.TypeCase.payload;
      }
      this._payload = value;
    }
    get initData(): ProcessRequest.ComputeRequest.InitData | undefined {
      return this._initData;
    }
    set initData(value: ProcessRequest.ComputeRequest.InitData | undefined) {
      if (value !== undefined && value !== null) {
        this._initRequest = this._payload = this._data = undefined;
        this._type = ComputeRequest.TypeCase.initData;
      }
      this._initData = value;
    }
    get data(): armonikApiGrpcV1002.DataChunk | undefined {
      return this._data;
    }
    set data(value: armonikApiGrpcV1002.DataChunk | undefined) {
      if (value !== undefined && value !== null) {
        this._initRequest = this._payload = this._initData = undefined;
        this._type = ComputeRequest.TypeCase.data;
      }
      this._data = value;
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
      ComputeRequest.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): ComputeRequest.AsObject {
      return {
        initRequest: this.initRequest ? this.initRequest.toObject() : undefined,
        payload: this.payload ? this.payload.toObject() : undefined,
        initData: this.initData ? this.initData.toObject() : undefined,
        data: this.data ? this.data.toObject() : undefined
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
    ): ComputeRequest.AsProtobufJSON {
      return {
        initRequest: this.initRequest
          ? this.initRequest.toProtobufJSON(options)
          : null,
        payload: this.payload ? this.payload.toProtobufJSON(options) : null,
        initData: this.initData ? this.initData.toProtobufJSON(options) : null,
        data: this.data ? this.data.toProtobufJSON(options) : null
      };
    }
  }
  export module ComputeRequest {
    /**
     * Standard JavaScript object representation for ComputeRequest
     */
    export interface AsObject {
      initRequest?: ProcessRequest.ComputeRequest.InitRequest.AsObject;
      payload?: armonikApiGrpcV1002.DataChunk.AsObject;
      initData?: ProcessRequest.ComputeRequest.InitData.AsObject;
      data?: armonikApiGrpcV1002.DataChunk.AsObject;
    }

    /**
     * Protobuf JSON representation for ComputeRequest
     */
    export interface AsProtobufJSON {
      initRequest?: ProcessRequest.ComputeRequest.InitRequest.AsProtobufJSON | null;
      payload?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
      initData?: ProcessRequest.ComputeRequest.InitData.AsProtobufJSON | null;
      data?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
    }
    export enum TypeCase {
      none = 0,
      initRequest = 1,
      payload = 2,
      initData = 3,
      data = 4
    }
    /**
     * Message implementation for armonik.api.grpc.v1.worker.ProcessRequest.ComputeRequest.InitRequest
     */
    export class InitRequest implements GrpcMessage {
      static id =
        'armonik.api.grpc.v1.worker.ProcessRequest.ComputeRequest.InitRequest';

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
        _instance.configuration = _instance.configuration || undefined;
        _instance.sessionId = _instance.sessionId || '';
        _instance.taskId = _instance.taskId || '';
        _instance.taskOptions = _instance.taskOptions || undefined;
        _instance.expectedOutputKeys = _instance.expectedOutputKeys || [];
        _instance.payload = _instance.payload || undefined;
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
              _instance.configuration = new armonikApiGrpcV1002.Configuration();
              _reader.readMessage(
                _instance.configuration,
                armonikApiGrpcV1002.Configuration.deserializeBinaryFromReader
              );
              break;
            case 2:
              _instance.sessionId = _reader.readString();
              break;
            case 3:
              _instance.taskId = _reader.readString();
              break;
            case 4:
              _instance.taskOptions = new armonikApiGrpcV1002.TaskOptions();
              _reader.readMessage(
                _instance.taskOptions,
                armonikApiGrpcV1002.TaskOptions.deserializeBinaryFromReader
              );
              break;
            case 5:
              (_instance.expectedOutputKeys =
                _instance.expectedOutputKeys || []).push(_reader.readString());
              break;
            case 6:
              _instance.payload = new armonikApiGrpcV1002.DataChunk();
              _reader.readMessage(
                _instance.payload,
                armonikApiGrpcV1002.DataChunk.deserializeBinaryFromReader
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
        if (_instance.configuration) {
          _writer.writeMessage(
            1,
            _instance.configuration as any,
            armonikApiGrpcV1002.Configuration.serializeBinaryToWriter
          );
        }
        if (_instance.sessionId) {
          _writer.writeString(2, _instance.sessionId);
        }
        if (_instance.taskId) {
          _writer.writeString(3, _instance.taskId);
        }
        if (_instance.taskOptions) {
          _writer.writeMessage(
            4,
            _instance.taskOptions as any,
            armonikApiGrpcV1002.TaskOptions.serializeBinaryToWriter
          );
        }
        if (
          _instance.expectedOutputKeys &&
          _instance.expectedOutputKeys.length
        ) {
          _writer.writeRepeatedString(5, _instance.expectedOutputKeys);
        }
        if (_instance.payload) {
          _writer.writeMessage(
            6,
            _instance.payload as any,
            armonikApiGrpcV1002.DataChunk.serializeBinaryToWriter
          );
        }
      }

      private _configuration?: armonikApiGrpcV1002.Configuration;
      private _sessionId?: string;
      private _taskId?: string;
      private _taskOptions?: armonikApiGrpcV1002.TaskOptions;
      private _expectedOutputKeys?: string[];
      private _payload?: armonikApiGrpcV1002.DataChunk;

      /**
       * Message constructor. Initializes the properties and applies default Protobuf values if necessary
       * @param _value initial values object or instance of InitRequest to deeply clone from
       */
      constructor(_value?: RecursivePartial<InitRequest.AsObject>) {
        _value = _value || {};
        this.configuration = _value.configuration
          ? new armonikApiGrpcV1002.Configuration(_value.configuration)
          : undefined;
        this.sessionId = _value.sessionId;
        this.taskId = _value.taskId;
        this.taskOptions = _value.taskOptions
          ? new armonikApiGrpcV1002.TaskOptions(_value.taskOptions)
          : undefined;
        this.expectedOutputKeys = (_value.expectedOutputKeys || []).slice();
        this.payload = _value.payload
          ? new armonikApiGrpcV1002.DataChunk(_value.payload)
          : undefined;
        InitRequest.refineValues(this);
      }
      get configuration(): armonikApiGrpcV1002.Configuration | undefined {
        return this._configuration;
      }
      set configuration(value: armonikApiGrpcV1002.Configuration | undefined) {
        this._configuration = value;
      }
      get sessionId(): string | undefined {
        return this._sessionId;
      }
      set sessionId(value: string | undefined) {
        this._sessionId = value;
      }
      get taskId(): string | undefined {
        return this._taskId;
      }
      set taskId(value: string | undefined) {
        this._taskId = value;
      }
      get taskOptions(): armonikApiGrpcV1002.TaskOptions | undefined {
        return this._taskOptions;
      }
      set taskOptions(value: armonikApiGrpcV1002.TaskOptions | undefined) {
        this._taskOptions = value;
      }
      get expectedOutputKeys(): string[] | undefined {
        return this._expectedOutputKeys;
      }
      set expectedOutputKeys(value: string[] | undefined) {
        this._expectedOutputKeys = value;
      }
      get payload(): armonikApiGrpcV1002.DataChunk | undefined {
        return this._payload;
      }
      set payload(value: armonikApiGrpcV1002.DataChunk | undefined) {
        this._payload = value;
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
          configuration: this.configuration
            ? this.configuration.toObject()
            : undefined,
          sessionId: this.sessionId,
          taskId: this.taskId,
          taskOptions: this.taskOptions
            ? this.taskOptions.toObject()
            : undefined,
          expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
          payload: this.payload ? this.payload.toObject() : undefined
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
          configuration: this.configuration
            ? this.configuration.toProtobufJSON(options)
            : null,
          sessionId: this.sessionId,
          taskId: this.taskId,
          taskOptions: this.taskOptions
            ? this.taskOptions.toProtobufJSON(options)
            : null,
          expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
          payload: this.payload ? this.payload.toProtobufJSON(options) : null
        };
      }
    }
    export module InitRequest {
      /**
       * Standard JavaScript object representation for InitRequest
       */
      export interface AsObject {
        configuration?: armonikApiGrpcV1002.Configuration.AsObject;
        sessionId?: string;
        taskId?: string;
        taskOptions?: armonikApiGrpcV1002.TaskOptions.AsObject;
        expectedOutputKeys?: string[];
        payload?: armonikApiGrpcV1002.DataChunk.AsObject;
      }

      /**
       * Protobuf JSON representation for InitRequest
       */
      export interface AsProtobufJSON {
        configuration?: armonikApiGrpcV1002.Configuration.AsProtobufJSON | null;
        sessionId?: string;
        taskId?: string;
        taskOptions?: armonikApiGrpcV1002.TaskOptions.AsProtobufJSON | null;
        expectedOutputKeys?: string[];
        payload?: armonikApiGrpcV1002.DataChunk.AsProtobufJSON | null;
      }
    }

    /**
     * Message implementation for armonik.api.grpc.v1.worker.ProcessRequest.ComputeRequest.InitData
     */
    export class InitData implements GrpcMessage {
      static id =
        'armonik.api.grpc.v1.worker.ProcessRequest.ComputeRequest.InitData';

      /**
       * Deserialize binary data to message
       * @param instance message instance
       */
      static deserializeBinary(bytes: ByteSource) {
        const instance = new InitData();
        InitData.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
        return instance;
      }

      /**
       * Check all the properties and set default protobuf values if necessary
       * @param _instance message instance
       */
      static refineValues(_instance: InitData) {}

      /**
       * Deserializes / reads binary message into message instance using provided binary reader
       * @param _instance message instance
       * @param _reader binary reader instance
       */
      static deserializeBinaryFromReader(
        _instance: InitData,
        _reader: BinaryReader
      ) {
        while (_reader.nextField()) {
          if (_reader.isEndGroup()) break;

          switch (_reader.getFieldNumber()) {
            case 1:
              _instance.key = _reader.readString();
              break;
            case 2:
              _instance.lastData = _reader.readBool();
              break;
            default:
              _reader.skipField();
          }
        }

        InitData.refineValues(_instance);
      }

      /**
       * Serializes a message to binary format using provided binary reader
       * @param _instance message instance
       * @param _writer binary writer instance
       */
      static serializeBinaryToWriter(
        _instance: InitData,
        _writer: BinaryWriter
      ) {
        if (_instance.key || _instance.key === '') {
          _writer.writeString(1, _instance.key);
        }
        if (_instance.lastData || _instance.lastData === false) {
          _writer.writeBool(2, _instance.lastData);
        }
      }

      private _key?: string;
      private _lastData?: boolean;

      private _type: InitData.TypeCase = InitData.TypeCase.none;

      /**
       * Message constructor. Initializes the properties and applies default Protobuf values if necessary
       * @param _value initial values object or instance of InitData to deeply clone from
       */
      constructor(_value?: RecursivePartial<InitData.AsObject>) {
        _value = _value || {};
        this.key = _value.key;
        this.lastData = _value.lastData;
        InitData.refineValues(this);
      }
      get key(): string | undefined {
        return this._key;
      }
      set key(value: string | undefined) {
        if (value !== undefined && value !== null) {
          this._lastData = undefined;
          this._type = InitData.TypeCase.key;
        }
        this._key = value;
      }
      get lastData(): boolean | undefined {
        return this._lastData;
      }
      set lastData(value: boolean | undefined) {
        if (value !== undefined && value !== null) {
          this._key = undefined;
          this._type = InitData.TypeCase.lastData;
        }
        this._lastData = value;
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
        InitData.serializeBinaryToWriter(this, writer);
        return writer.getResultBuffer();
      }

      /**
       * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
       */
      toObject(): InitData.AsObject {
        return {
          key: this.key,
          lastData: this.lastData
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
      ): InitData.AsProtobufJSON {
        return {
          key: this.key === null || this.key === undefined ? null : this.key,
          lastData: this.lastData
        };
      }
    }
    export module InitData {
      /**
       * Standard JavaScript object representation for InitData
       */
      export interface AsObject {
        key?: string;
        lastData?: boolean;
      }

      /**
       * Protobuf JSON representation for InitData
       */
      export interface AsProtobufJSON {
        key?: string | null;
        lastData?: boolean;
      }
      export enum TypeCase {
        none = 0,
        key = 1,
        lastData = 2
      }
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.worker.ProcessReply
 */
export class ProcessReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.worker.ProcessReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ProcessReply();
    ProcessReply.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ProcessReply) {
    _instance.communicationToken = _instance.communicationToken || '';
    _instance.output = _instance.output || undefined;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ProcessReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.communicationToken = _reader.readString();
          break;
        case 2:
          _instance.output = new armonikApiGrpcV1002.Output();
          _reader.readMessage(
            _instance.output,
            armonikApiGrpcV1002.Output.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    ProcessReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ProcessReply,
    _writer: BinaryWriter
  ) {
    if (_instance.communicationToken) {
      _writer.writeString(1, _instance.communicationToken);
    }
    if (_instance.output) {
      _writer.writeMessage(
        2,
        _instance.output as any,
        armonikApiGrpcV1002.Output.serializeBinaryToWriter
      );
    }
  }

  private _communicationToken?: string;
  private _output?: armonikApiGrpcV1002.Output;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ProcessReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<ProcessReply.AsObject>) {
    _value = _value || {};
    this.communicationToken = _value.communicationToken;
    this.output = _value.output
      ? new armonikApiGrpcV1002.Output(_value.output)
      : undefined;
    ProcessReply.refineValues(this);
  }
  get communicationToken(): string | undefined {
    return this._communicationToken;
  }
  set communicationToken(value: string | undefined) {
    this._communicationToken = value;
  }
  get output(): armonikApiGrpcV1002.Output | undefined {
    return this._output;
  }
  set output(value: armonikApiGrpcV1002.Output | undefined) {
    this._output = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ProcessReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ProcessReply.AsObject {
    return {
      communicationToken: this.communicationToken,
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
  ): ProcessReply.AsProtobufJSON {
    return {
      communicationToken: this.communicationToken,
      output: this.output ? this.output.toProtobufJSON(options) : null
    };
  }
}
export module ProcessReply {
  /**
   * Standard JavaScript object representation for ProcessReply
   */
  export interface AsObject {
    communicationToken?: string;
    output?: armonikApiGrpcV1002.Output.AsObject;
  }

  /**
   * Protobuf JSON representation for ProcessReply
   */
  export interface AsProtobufJSON {
    communicationToken?: string;
    output?: armonikApiGrpcV1002.Output.AsProtobufJSON | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.worker.HealthCheckReply
 */
export class HealthCheckReply implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.worker.HealthCheckReply';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new HealthCheckReply();
    HealthCheckReply.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: HealthCheckReply) {
    _instance.status = _instance.status || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: HealthCheckReply,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.status = _reader.readEnum();
          break;
        default:
          _reader.skipField();
      }
    }

    HealthCheckReply.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: HealthCheckReply,
    _writer: BinaryWriter
  ) {
    if (_instance.status) {
      _writer.writeEnum(1, _instance.status);
    }
  }

  private _status?: HealthCheckReply.ServingStatus;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of HealthCheckReply to deeply clone from
   */
  constructor(_value?: RecursivePartial<HealthCheckReply.AsObject>) {
    _value = _value || {};
    this.status = _value.status;
    HealthCheckReply.refineValues(this);
  }
  get status(): HealthCheckReply.ServingStatus | undefined {
    return this._status;
  }
  set status(value: HealthCheckReply.ServingStatus | undefined) {
    this._status = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    HealthCheckReply.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): HealthCheckReply.AsObject {
    return {
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
  ): HealthCheckReply.AsProtobufJSON {
    return {
      status:
        HealthCheckReply.ServingStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ]
    };
  }
}
export module HealthCheckReply {
  /**
   * Standard JavaScript object representation for HealthCheckReply
   */
  export interface AsObject {
    status?: HealthCheckReply.ServingStatus;
  }

  /**
   * Protobuf JSON representation for HealthCheckReply
   */
  export interface AsProtobufJSON {
    status?: string;
  }
  export enum ServingStatus {
    UNKNOWN = 0,
    SERVING = 1,
    NOT_SERVING = 2
  }
}
