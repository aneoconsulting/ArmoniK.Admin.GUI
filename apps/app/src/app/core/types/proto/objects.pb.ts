/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import {
  GrpcMessage,
  RecursivePartial,
  ToProtobufJSONOptions,
  uint8ArrayToBase64
} from '@ngx-grpc/common';
import { BinaryReader, BinaryWriter, ByteSource } from 'google-protobuf';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import * as armonikApiGrpcV1Task_status001 from './task-status.pb';
/**
 * Message implementation for armonik.api.grpc.v1.Empty
 */
export class Empty implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.Empty';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Empty();
    Empty.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Empty) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Empty, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        default:
          _reader.skipField();
      }
    }

    Empty.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Empty, _writer: BinaryWriter) {}

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Empty to deeply clone from
   */
  constructor(_value?: RecursivePartial<Empty.AsObject>) {
    _value = _value || {};
    Empty.refineValues(this);
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Empty.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Empty.AsObject {
    return {};
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
  ): Empty.AsProtobufJSON {
    return {};
  }
}
export module Empty {
  /**
   * Standard JavaScript object representation for Empty
   */
  export interface AsObject {}

  /**
   * Protobuf JSON representation for Empty
   */
  export interface AsProtobufJSON {}
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskOptions
 */
export class TaskOptions implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskOptions';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskOptions();
    TaskOptions.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskOptions) {
    _instance.options = _instance.options || {};
    _instance.maxDuration = _instance.maxDuration || undefined;
    _instance.maxRetries = _instance.maxRetries || 0;
    _instance.priority = _instance.priority || 0;
    _instance.partitionId = _instance.partitionId || '';
    _instance.applicationName = _instance.applicationName || '';
    _instance.applicationVersion = _instance.applicationVersion || '';
    _instance.applicationNamespace = _instance.applicationNamespace || '';
    _instance.applicationService = _instance.applicationService || '';
    _instance.engineType = _instance.engineType || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskOptions,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const msg_1 = {} as any;
          _reader.readMessage(
            msg_1,
            TaskOptions.OptionsEntry.deserializeBinaryFromReader
          );
          _instance.options = _instance.options || {};
          _instance.options[msg_1.key] = msg_1.value;
          break;
        case 2:
          _instance.maxDuration = new googleProtobuf000.Duration();
          _reader.readMessage(
            _instance.maxDuration,
            googleProtobuf000.Duration.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.maxRetries = _reader.readInt32();
          break;
        case 4:
          _instance.priority = _reader.readInt32();
          break;
        case 5:
          _instance.partitionId = _reader.readString();
          break;
        case 6:
          _instance.applicationName = _reader.readString();
          break;
        case 7:
          _instance.applicationVersion = _reader.readString();
          break;
        case 8:
          _instance.applicationNamespace = _reader.readString();
          break;
        case 9:
          _instance.applicationService = _reader.readString();
          break;
        case 10:
          _instance.engineType = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    TaskOptions.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: TaskOptions,
    _writer: BinaryWriter
  ) {
    if (!!_instance.options) {
      const keys_1 = Object.keys(_instance.options as any);

      if (keys_1.length) {
        const repeated_1 = keys_1
          .map(key => ({ key: key, value: (_instance.options as any)[key] }))
          .reduce((r, v) => [...r, v], [] as any[]);

        _writer.writeRepeatedMessage(
          1,
          repeated_1,
          TaskOptions.OptionsEntry.serializeBinaryToWriter
        );
      }
    }
    if (_instance.maxDuration) {
      _writer.writeMessage(
        2,
        _instance.maxDuration as any,
        googleProtobuf000.Duration.serializeBinaryToWriter
      );
    }
    if (_instance.maxRetries) {
      _writer.writeInt32(3, _instance.maxRetries);
    }
    if (_instance.priority) {
      _writer.writeInt32(4, _instance.priority);
    }
    if (_instance.partitionId) {
      _writer.writeString(5, _instance.partitionId);
    }
    if (_instance.applicationName) {
      _writer.writeString(6, _instance.applicationName);
    }
    if (_instance.applicationVersion) {
      _writer.writeString(7, _instance.applicationVersion);
    }
    if (_instance.applicationNamespace) {
      _writer.writeString(8, _instance.applicationNamespace);
    }
    if (_instance.applicationService) {
      _writer.writeString(9, _instance.applicationService);
    }
    if (_instance.engineType) {
      _writer.writeString(10, _instance.engineType);
    }
  }

  private _options?: { [prop: string]: string };
  private _maxDuration?: googleProtobuf000.Duration;
  private _maxRetries?: number;
  private _priority?: number;
  private _partitionId?: string;
  private _applicationName?: string;
  private _applicationVersion?: string;
  private _applicationNamespace?: string;
  private _applicationService?: string;
  private _engineType?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskOptions to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskOptions.AsObject>) {
    _value = _value || {};
    (this.options = _value!.options
      ? Object.keys(_value!.options).reduce(
          (r, k) => ({ ...r, [k]: _value!.options![k] }),
          {}
        )
      : {}),
      (this.maxDuration = _value.maxDuration
        ? new googleProtobuf000.Duration(_value.maxDuration)
        : undefined);
    this.maxRetries = _value.maxRetries;
    this.priority = _value.priority;
    this.partitionId = _value.partitionId;
    this.applicationName = _value.applicationName;
    this.applicationVersion = _value.applicationVersion;
    this.applicationNamespace = _value.applicationNamespace;
    this.applicationService = _value.applicationService;
    this.engineType = _value.engineType;
    TaskOptions.refineValues(this);
  }
  get options(): { [prop: string]: string } | undefined {
    return this._options;
  }
  set options(value: { [prop: string]: string } | undefined) {
    this._options = value;
  }
  get maxDuration(): googleProtobuf000.Duration | undefined {
    return this._maxDuration;
  }
  set maxDuration(value: googleProtobuf000.Duration | undefined) {
    this._maxDuration = value;
  }
  get maxRetries(): number | undefined {
    return this._maxRetries;
  }
  set maxRetries(value: number | undefined) {
    this._maxRetries = value;
  }
  get priority(): number | undefined {
    return this._priority;
  }
  set priority(value: number | undefined) {
    this._priority = value;
  }
  get partitionId(): string | undefined {
    return this._partitionId;
  }
  set partitionId(value: string | undefined) {
    this._partitionId = value;
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
  get applicationNamespace(): string | undefined {
    return this._applicationNamespace;
  }
  set applicationNamespace(value: string | undefined) {
    this._applicationNamespace = value;
  }
  get applicationService(): string | undefined {
    return this._applicationService;
  }
  set applicationService(value: string | undefined) {
    this._applicationService = value;
  }
  get engineType(): string | undefined {
    return this._engineType;
  }
  set engineType(value: string | undefined) {
    this._engineType = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskOptions.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskOptions.AsObject {
    return {
      options: this.options
        ? Object.keys(this.options).reduce(
            (r, k) => ({ ...r, [k]: this.options![k] }),
            {}
          )
        : {},
      maxDuration: this.maxDuration ? this.maxDuration.toObject() : undefined,
      maxRetries: this.maxRetries,
      priority: this.priority,
      partitionId: this.partitionId,
      applicationName: this.applicationName,
      applicationVersion: this.applicationVersion,
      applicationNamespace: this.applicationNamespace,
      applicationService: this.applicationService,
      engineType: this.engineType
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
  ): TaskOptions.AsProtobufJSON {
    return {
      options: this.options
        ? Object.keys(this.options).reduce(
            (r, k) => ({ ...r, [k]: this.options![k] }),
            {}
          )
        : {},
      maxDuration: this.maxDuration
        ? this.maxDuration.toProtobufJSON(options)
        : null,
      maxRetries: this.maxRetries,
      priority: this.priority,
      partitionId: this.partitionId,
      applicationName: this.applicationName,
      applicationVersion: this.applicationVersion,
      applicationNamespace: this.applicationNamespace,
      applicationService: this.applicationService,
      engineType: this.engineType
    };
  }
}
export module TaskOptions {
  /**
   * Standard JavaScript object representation for TaskOptions
   */
  export interface AsObject {
    options?: { [prop: string]: string };
    maxDuration?: googleProtobuf000.Duration.AsObject;
    maxRetries?: number;
    priority?: number;
    partitionId?: string;
    applicationName?: string;
    applicationVersion?: string;
    applicationNamespace?: string;
    applicationService?: string;
    engineType?: string;
  }

  /**
   * Protobuf JSON representation for TaskOptions
   */
  export interface AsProtobufJSON {
    options?: { [prop: string]: string };
    maxDuration?: googleProtobuf000.Duration.AsProtobufJSON | null;
    maxRetries?: number;
    priority?: number;
    partitionId?: string;
    applicationName?: string;
    applicationVersion?: string;
    applicationNamespace?: string;
    applicationService?: string;
    engineType?: string;
  }

  /**
   * Message implementation for armonik.api.grpc.v1.TaskOptions.OptionsEntry
   */
  export class OptionsEntry implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.TaskOptions.OptionsEntry';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new OptionsEntry();
      OptionsEntry.deserializeBinaryFromReader(
        instance,
        new BinaryReader(bytes)
      );
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: OptionsEntry) {
      _instance.key = _instance.key || '';
      _instance.value = _instance.value || '';
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: OptionsEntry,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.key = _reader.readString();
            break;
          case 2:
            _instance.value = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      OptionsEntry.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(
      _instance: OptionsEntry,
      _writer: BinaryWriter
    ) {
      if (_instance.key) {
        _writer.writeString(1, _instance.key);
      }
      if (_instance.value) {
        _writer.writeString(2, _instance.value);
      }
    }

    private _key?: string;
    private _value?: string;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of OptionsEntry to deeply clone from
     */
    constructor(_value?: RecursivePartial<OptionsEntry.AsObject>) {
      _value = _value || {};
      this.key = _value.key;
      this.value = _value.value;
      OptionsEntry.refineValues(this);
    }
    get key(): string | undefined {
      return this._key;
    }
    set key(value: string | undefined) {
      this._key = value;
    }
    get value(): string | undefined {
      return this._value;
    }
    set value(value: string | undefined) {
      this._value = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      OptionsEntry.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): OptionsEntry.AsObject {
      return {
        key: this.key,
        value: this.value
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
    ): OptionsEntry.AsProtobufJSON {
      return {
        key: this.key,
        value: this.value
      };
    }
  }
  export module OptionsEntry {
    /**
     * Standard JavaScript object representation for OptionsEntry
     */
    export interface AsObject {
      key?: string;
      value?: string;
    }

    /**
     * Protobuf JSON representation for OptionsEntry
     */
    export interface AsProtobufJSON {
      key?: string;
      value?: string;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.Session
 */
export class Session implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.Session';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Session();
    Session.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Session) {
    _instance.id = _instance.id || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Session,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Session.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Session, _writer: BinaryWriter) {
    if (_instance.id) {
      _writer.writeString(1, _instance.id);
    }
  }

  private _id?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Session to deeply clone from
   */
  constructor(_value?: RecursivePartial<Session.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    Session.refineValues(this);
  }
  get id(): string | undefined {
    return this._id;
  }
  set id(value: string | undefined) {
    this._id = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Session.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Session.AsObject {
    return {
      id: this.id
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
  ): Session.AsProtobufJSON {
    return {
      id: this.id
    };
  }
}
export module Session {
  /**
   * Standard JavaScript object representation for Session
   */
  export interface AsObject {
    id?: string;
  }

  /**
   * Protobuf JSON representation for Session
   */
  export interface AsProtobufJSON {
    id?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.Configuration
 */
export class Configuration implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.Configuration';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Configuration();
    Configuration.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Configuration) {
    _instance.dataChunkMaxSize = _instance.dataChunkMaxSize || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Configuration,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.dataChunkMaxSize = _reader.readInt32();
          break;
        default:
          _reader.skipField();
      }
    }

    Configuration.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: Configuration,
    _writer: BinaryWriter
  ) {
    if (_instance.dataChunkMaxSize) {
      _writer.writeInt32(1, _instance.dataChunkMaxSize);
    }
  }

  private _dataChunkMaxSize?: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Configuration to deeply clone from
   */
  constructor(_value?: RecursivePartial<Configuration.AsObject>) {
    _value = _value || {};
    this.dataChunkMaxSize = _value.dataChunkMaxSize;
    Configuration.refineValues(this);
  }
  get dataChunkMaxSize(): number | undefined {
    return this._dataChunkMaxSize;
  }
  set dataChunkMaxSize(value: number | undefined) {
    this._dataChunkMaxSize = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Configuration.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Configuration.AsObject {
    return {
      dataChunkMaxSize: this.dataChunkMaxSize
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
  ): Configuration.AsProtobufJSON {
    return {
      dataChunkMaxSize: this.dataChunkMaxSize
    };
  }
}
export module Configuration {
  /**
   * Standard JavaScript object representation for Configuration
   */
  export interface AsObject {
    dataChunkMaxSize?: number;
  }

  /**
   * Protobuf JSON representation for Configuration
   */
  export interface AsProtobufJSON {
    dataChunkMaxSize?: number;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.Output
 */
export class Output implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.Output';

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
  static refineValues(_instance: Output) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Output, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 2:
          _instance.ok = new Empty();
          _reader.readMessage(_instance.ok, Empty.deserializeBinaryFromReader);
          break;
        case 3:
          _instance.error = new Output.Error();
          _reader.readMessage(
            _instance.error,
            Output.Error.deserializeBinaryFromReader
          );
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
    if (_instance.ok) {
      _writer.writeMessage(
        2,
        _instance.ok as any,
        Empty.serializeBinaryToWriter
      );
    }
    if (_instance.error) {
      _writer.writeMessage(
        3,
        _instance.error as any,
        Output.Error.serializeBinaryToWriter
      );
    }
  }

  private _ok?: Empty;
  private _error?: Output.Error;

  private _type: Output.TypeCase = Output.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Output to deeply clone from
   */
  constructor(_value?: RecursivePartial<Output.AsObject>) {
    _value = _value || {};
    this.ok = _value.ok ? new Empty(_value.ok) : undefined;
    this.error = _value.error ? new Output.Error(_value.error) : undefined;
    Output.refineValues(this);
  }
  get ok(): Empty | undefined {
    return this._ok;
  }
  set ok(value: Empty | undefined) {
    if (value !== undefined && value !== null) {
      this._error = undefined;
      this._type = Output.TypeCase.ok;
    }
    this._ok = value;
  }
  get error(): Output.Error | undefined {
    return this._error;
  }
  set error(value: Output.Error | undefined) {
    if (value !== undefined && value !== null) {
      this._ok = undefined;
      this._type = Output.TypeCase.error;
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
    Output.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Output.AsObject {
    return {
      ok: this.ok ? this.ok.toObject() : undefined,
      error: this.error ? this.error.toObject() : undefined
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
      ok: this.ok ? this.ok.toProtobufJSON(options) : null,
      error: this.error ? this.error.toProtobufJSON(options) : null
    };
  }
}
export module Output {
  /**
   * Standard JavaScript object representation for Output
   */
  export interface AsObject {
    ok?: Empty.AsObject;
    error?: Output.Error.AsObject;
  }

  /**
   * Protobuf JSON representation for Output
   */
  export interface AsProtobufJSON {
    ok?: Empty.AsProtobufJSON | null;
    error?: Output.Error.AsProtobufJSON | null;
  }
  export enum TypeCase {
    none = 0,
    ok = 1,
    error = 2
  }
  /**
   * Message implementation for armonik.api.grpc.v1.Output.Error
   */
  export class Error implements GrpcMessage {
    static id = 'armonik.api.grpc.v1.Output.Error';

    /**
     * Deserialize binary data to message
     * @param instance message instance
     */
    static deserializeBinary(bytes: ByteSource) {
      const instance = new Error();
      Error.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
      return instance;
    }

    /**
     * Check all the properties and set default protobuf values if necessary
     * @param _instance message instance
     */
    static refineValues(_instance: Error) {
      _instance.details = _instance.details || '';
    }

    /**
     * Deserializes / reads binary message into message instance using provided binary reader
     * @param _instance message instance
     * @param _reader binary reader instance
     */
    static deserializeBinaryFromReader(
      _instance: Error,
      _reader: BinaryReader
    ) {
      while (_reader.nextField()) {
        if (_reader.isEndGroup()) break;

        switch (_reader.getFieldNumber()) {
          case 1:
            _instance.details = _reader.readString();
            break;
          default:
            _reader.skipField();
        }
      }

      Error.refineValues(_instance);
    }

    /**
     * Serializes a message to binary format using provided binary reader
     * @param _instance message instance
     * @param _writer binary writer instance
     */
    static serializeBinaryToWriter(_instance: Error, _writer: BinaryWriter) {
      if (_instance.details) {
        _writer.writeString(1, _instance.details);
      }
    }

    private _details?: string;

    /**
     * Message constructor. Initializes the properties and applies default Protobuf values if necessary
     * @param _value initial values object or instance of Error to deeply clone from
     */
    constructor(_value?: RecursivePartial<Error.AsObject>) {
      _value = _value || {};
      this.details = _value.details;
      Error.refineValues(this);
    }
    get details(): string | undefined {
      return this._details;
    }
    set details(value: string | undefined) {
      this._details = value;
    }

    /**
     * Serialize message to binary data
     * @param instance message instance
     */
    serializeBinary() {
      const writer = new BinaryWriter();
      Error.serializeBinaryToWriter(this, writer);
      return writer.getResultBuffer();
    }

    /**
     * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
     */
    toObject(): Error.AsObject {
      return {
        details: this.details
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
    ): Error.AsProtobufJSON {
      return {
        details: this.details
      };
    }
  }
  export module Error {
    /**
     * Standard JavaScript object representation for Error
     */
    export interface AsObject {
      details?: string;
    }

    /**
     * Protobuf JSON representation for Error
     */
    export interface AsProtobufJSON {
      details?: string;
    }
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskRequest
 */
export class TaskRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskRequest();
    TaskRequest.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskRequest) {
    _instance.expectedOutputKeys = _instance.expectedOutputKeys || [];
    _instance.dataDependencies = _instance.dataDependencies || [];
    _instance.payload = _instance.payload || new Uint8Array();
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.expectedOutputKeys =
            _instance.expectedOutputKeys || []).push(_reader.readString());
          break;
        case 2:
          (_instance.dataDependencies = _instance.dataDependencies || []).push(
            _reader.readString()
          );
          break;
        case 3:
          _instance.payload = _reader.readBytes();
          break;
        default:
          _reader.skipField();
      }
    }

    TaskRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: TaskRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.expectedOutputKeys && _instance.expectedOutputKeys.length) {
      _writer.writeRepeatedString(1, _instance.expectedOutputKeys);
    }
    if (_instance.dataDependencies && _instance.dataDependencies.length) {
      _writer.writeRepeatedString(2, _instance.dataDependencies);
    }
    if (_instance.payload && _instance.payload.length) {
      _writer.writeBytes(3, _instance.payload);
    }
  }

  private _expectedOutputKeys?: string[];
  private _dataDependencies?: string[];
  private _payload?: Uint8Array;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskRequest.AsObject>) {
    _value = _value || {};
    this.expectedOutputKeys = (_value.expectedOutputKeys || []).slice();
    this.dataDependencies = (_value.dataDependencies || []).slice();
    this.payload = _value.payload;
    TaskRequest.refineValues(this);
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
  get payload(): Uint8Array | undefined {
    return this._payload;
  }
  set payload(value: Uint8Array | undefined) {
    this._payload = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskRequest.AsObject {
    return {
      expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
      dataDependencies: (this.dataDependencies || []).slice(),
      payload: this.payload ? this.payload.subarray(0) : new Uint8Array()
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
  ): TaskRequest.AsProtobufJSON {
    return {
      expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
      dataDependencies: (this.dataDependencies || []).slice(),
      payload: this.payload ? uint8ArrayToBase64(this.payload) : ''
    };
  }
}
export module TaskRequest {
  /**
   * Standard JavaScript object representation for TaskRequest
   */
  export interface AsObject {
    expectedOutputKeys?: string[];
    dataDependencies?: string[];
    payload?: Uint8Array;
  }

  /**
   * Protobuf JSON representation for TaskRequest
   */
  export interface AsProtobufJSON {
    expectedOutputKeys?: string[];
    dataDependencies?: string[];
    payload?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.InitKeyedDataStream
 */
export class InitKeyedDataStream implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.InitKeyedDataStream';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new InitKeyedDataStream();
    InitKeyedDataStream.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: InitKeyedDataStream) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: InitKeyedDataStream,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.key = _reader.readString();
          break;
        case 2:
          _instance.lastResult = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    InitKeyedDataStream.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: InitKeyedDataStream,
    _writer: BinaryWriter
  ) {
    if (_instance.key || _instance.key === '') {
      _writer.writeString(1, _instance.key);
    }
    if (_instance.lastResult || _instance.lastResult === false) {
      _writer.writeBool(2, _instance.lastResult);
    }
  }

  private _key?: string;
  private _lastResult?: boolean;

  private _type: InitKeyedDataStream.TypeCase =
    InitKeyedDataStream.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of InitKeyedDataStream to deeply clone from
   */
  constructor(_value?: RecursivePartial<InitKeyedDataStream.AsObject>) {
    _value = _value || {};
    this.key = _value.key;
    this.lastResult = _value.lastResult;
    InitKeyedDataStream.refineValues(this);
  }
  get key(): string | undefined {
    return this._key;
  }
  set key(value: string | undefined) {
    if (value !== undefined && value !== null) {
      this._lastResult = undefined;
      this._type = InitKeyedDataStream.TypeCase.key;
    }
    this._key = value;
  }
  get lastResult(): boolean | undefined {
    return this._lastResult;
  }
  set lastResult(value: boolean | undefined) {
    if (value !== undefined && value !== null) {
      this._key = undefined;
      this._type = InitKeyedDataStream.TypeCase.lastResult;
    }
    this._lastResult = value;
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
    InitKeyedDataStream.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): InitKeyedDataStream.AsObject {
    return {
      key: this.key,
      lastResult: this.lastResult
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
  ): InitKeyedDataStream.AsProtobufJSON {
    return {
      key: this.key === null || this.key === undefined ? null : this.key,
      lastResult: this.lastResult
    };
  }
}
export module InitKeyedDataStream {
  /**
   * Standard JavaScript object representation for InitKeyedDataStream
   */
  export interface AsObject {
    key?: string;
    lastResult?: boolean;
  }

  /**
   * Protobuf JSON representation for InitKeyedDataStream
   */
  export interface AsProtobufJSON {
    key?: string | null;
    lastResult?: boolean;
  }
  export enum TypeCase {
    none = 0,
    key = 1,
    lastResult = 2
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.DataChunk
 */
export class DataChunk implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.DataChunk';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DataChunk();
    DataChunk.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DataChunk) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DataChunk,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.data = _reader.readBytes();
          break;
        case 2:
          _instance.dataComplete = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    DataChunk.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: DataChunk, _writer: BinaryWriter) {
    if (_instance.data && _instance.data.length) {
      _writer.writeBytes(1, _instance.data);
    }
    if (_instance.dataComplete || _instance.dataComplete === false) {
      _writer.writeBool(2, _instance.dataComplete);
    }
  }

  private _data?: Uint8Array;
  private _dataComplete?: boolean;

  private _type: DataChunk.TypeCase = DataChunk.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DataChunk to deeply clone from
   */
  constructor(_value?: RecursivePartial<DataChunk.AsObject>) {
    _value = _value || {};
    this.data = _value.data;
    this.dataComplete = _value.dataComplete;
    DataChunk.refineValues(this);
  }
  get data(): Uint8Array | undefined {
    return this._data;
  }
  set data(value: Uint8Array | undefined) {
    if (value !== undefined && value !== null) {
      this._dataComplete = undefined;
      this._type = DataChunk.TypeCase.data;
    }
    this._data = value;
  }
  get dataComplete(): boolean | undefined {
    return this._dataComplete;
  }
  set dataComplete(value: boolean | undefined) {
    if (value !== undefined && value !== null) {
      this._data = undefined;
      this._type = DataChunk.TypeCase.dataComplete;
    }
    this._dataComplete = value;
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
    DataChunk.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DataChunk.AsObject {
    return {
      data: this.data ? this.data.subarray(0) : new Uint8Array(),
      dataComplete: this.dataComplete
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
  ): DataChunk.AsProtobufJSON {
    return {
      data: this.data ? uint8ArrayToBase64(this.data) : '',
      dataComplete: this.dataComplete
    };
  }
}
export module DataChunk {
  /**
   * Standard JavaScript object representation for DataChunk
   */
  export interface AsObject {
    data?: Uint8Array;
    dataComplete?: boolean;
  }

  /**
   * Protobuf JSON representation for DataChunk
   */
  export interface AsProtobufJSON {
    data?: string;
    dataComplete?: boolean;
  }
  export enum TypeCase {
    none = 0,
    data = 1,
    dataComplete = 2
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskRequestHeader
 */
export class TaskRequestHeader implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskRequestHeader';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskRequestHeader();
    TaskRequestHeader.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskRequestHeader) {
    _instance.expectedOutputKeys = _instance.expectedOutputKeys || [];
    _instance.dataDependencies = _instance.dataDependencies || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskRequestHeader,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          (_instance.expectedOutputKeys =
            _instance.expectedOutputKeys || []).push(_reader.readString());
          break;
        case 2:
          (_instance.dataDependencies = _instance.dataDependencies || []).push(
            _reader.readString()
          );
          break;
        default:
          _reader.skipField();
      }
    }

    TaskRequestHeader.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: TaskRequestHeader,
    _writer: BinaryWriter
  ) {
    if (_instance.expectedOutputKeys && _instance.expectedOutputKeys.length) {
      _writer.writeRepeatedString(1, _instance.expectedOutputKeys);
    }
    if (_instance.dataDependencies && _instance.dataDependencies.length) {
      _writer.writeRepeatedString(2, _instance.dataDependencies);
    }
  }

  private _expectedOutputKeys?: string[];
  private _dataDependencies?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskRequestHeader to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskRequestHeader.AsObject>) {
    _value = _value || {};
    this.expectedOutputKeys = (_value.expectedOutputKeys || []).slice();
    this.dataDependencies = (_value.dataDependencies || []).slice();
    TaskRequestHeader.refineValues(this);
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
    TaskRequestHeader.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskRequestHeader.AsObject {
    return {
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
  ): TaskRequestHeader.AsProtobufJSON {
    return {
      expectedOutputKeys: (this.expectedOutputKeys || []).slice(),
      dataDependencies: (this.dataDependencies || []).slice()
    };
  }
}
export module TaskRequestHeader {
  /**
   * Standard JavaScript object representation for TaskRequestHeader
   */
  export interface AsObject {
    expectedOutputKeys?: string[];
    dataDependencies?: string[];
  }

  /**
   * Protobuf JSON representation for TaskRequestHeader
   */
  export interface AsProtobufJSON {
    expectedOutputKeys?: string[];
    dataDependencies?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.InitTaskRequest
 */
export class InitTaskRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.InitTaskRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new InitTaskRequest();
    InitTaskRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: InitTaskRequest) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: InitTaskRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.header = new TaskRequestHeader();
          _reader.readMessage(
            _instance.header,
            TaskRequestHeader.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.lastTask = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    InitTaskRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: InitTaskRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.header) {
      _writer.writeMessage(
        1,
        _instance.header as any,
        TaskRequestHeader.serializeBinaryToWriter
      );
    }
    if (_instance.lastTask || _instance.lastTask === false) {
      _writer.writeBool(2, _instance.lastTask);
    }
  }

  private _header?: TaskRequestHeader;
  private _lastTask?: boolean;

  private _type: InitTaskRequest.TypeCase = InitTaskRequest.TypeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of InitTaskRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<InitTaskRequest.AsObject>) {
    _value = _value || {};
    this.header = _value.header
      ? new TaskRequestHeader(_value.header)
      : undefined;
    this.lastTask = _value.lastTask;
    InitTaskRequest.refineValues(this);
  }
  get header(): TaskRequestHeader | undefined {
    return this._header;
  }
  set header(value: TaskRequestHeader | undefined) {
    if (value !== undefined && value !== null) {
      this._lastTask = undefined;
      this._type = InitTaskRequest.TypeCase.header;
    }
    this._header = value;
  }
  get lastTask(): boolean | undefined {
    return this._lastTask;
  }
  set lastTask(value: boolean | undefined) {
    if (value !== undefined && value !== null) {
      this._header = undefined;
      this._type = InitTaskRequest.TypeCase.lastTask;
    }
    this._lastTask = value;
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
    InitTaskRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): InitTaskRequest.AsObject {
    return {
      header: this.header ? this.header.toObject() : undefined,
      lastTask: this.lastTask
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
  ): InitTaskRequest.AsProtobufJSON {
    return {
      header: this.header ? this.header.toProtobufJSON(options) : null,
      lastTask: this.lastTask
    };
  }
}
export module InitTaskRequest {
  /**
   * Standard JavaScript object representation for InitTaskRequest
   */
  export interface AsObject {
    header?: TaskRequestHeader.AsObject;
    lastTask?: boolean;
  }

  /**
   * Protobuf JSON representation for InitTaskRequest
   */
  export interface AsProtobufJSON {
    header?: TaskRequestHeader.AsProtobufJSON | null;
    lastTask?: boolean;
  }
  export enum TypeCase {
    none = 0,
    header = 1,
    lastTask = 2
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskId
 */
export class TaskId implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskId';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskId();
    TaskId.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskId) {
    _instance.session = _instance.session || '';
    _instance.task = _instance.task || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: TaskId, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.session = _reader.readString();
          break;
        case 2:
          _instance.task = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    TaskId.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: TaskId, _writer: BinaryWriter) {
    if (_instance.session) {
      _writer.writeString(1, _instance.session);
    }
    if (_instance.task) {
      _writer.writeString(2, _instance.task);
    }
  }

  private _session?: string;
  private _task?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskId to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskId.AsObject>) {
    _value = _value || {};
    this.session = _value.session;
    this.task = _value.task;
    TaskId.refineValues(this);
  }
  get session(): string | undefined {
    return this._session;
  }
  set session(value: string | undefined) {
    this._session = value;
  }
  get task(): string | undefined {
    return this._task;
  }
  set task(value: string | undefined) {
    this._task = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskId.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskId.AsObject {
    return {
      session: this.session,
      task: this.task
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
  ): TaskId.AsProtobufJSON {
    return {
      session: this.session,
      task: this.task
    };
  }
}
export module TaskId {
  /**
   * Standard JavaScript object representation for TaskId
   */
  export interface AsObject {
    session?: string;
    task?: string;
  }

  /**
   * Protobuf JSON representation for TaskId
   */
  export interface AsProtobufJSON {
    session?: string;
    task?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskIdList
 */
export class TaskIdList implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskIdList';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskIdList();
    TaskIdList.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskIdList) {
    _instance.taskIds = _instance.taskIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskIdList,
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

    TaskIdList.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: TaskIdList, _writer: BinaryWriter) {
    if (_instance.taskIds && _instance.taskIds.length) {
      _writer.writeRepeatedString(1, _instance.taskIds);
    }
  }

  private _taskIds?: string[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskIdList to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskIdList.AsObject>) {
    _value = _value || {};
    this.taskIds = (_value.taskIds || []).slice();
    TaskIdList.refineValues(this);
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
    TaskIdList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskIdList.AsObject {
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
  ): TaskIdList.AsProtobufJSON {
    return {
      taskIds: (this.taskIds || []).slice()
    };
  }
}
export module TaskIdList {
  /**
   * Standard JavaScript object representation for TaskIdList
   */
  export interface AsObject {
    taskIds?: string[];
  }

  /**
   * Protobuf JSON representation for TaskIdList
   */
  export interface AsProtobufJSON {
    taskIds?: string[];
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.StatusCount
 */
export class StatusCount implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.StatusCount';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new StatusCount();
    StatusCount.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: StatusCount) {
    _instance.status = _instance.status || 0;
    _instance.count = _instance.count || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: StatusCount,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.status = _reader.readEnum();
          break;
        case 2:
          _instance.count = _reader.readInt32();
          break;
        default:
          _reader.skipField();
      }
    }

    StatusCount.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: StatusCount,
    _writer: BinaryWriter
  ) {
    if (_instance.status) {
      _writer.writeEnum(1, _instance.status);
    }
    if (_instance.count) {
      _writer.writeInt32(2, _instance.count);
    }
  }

  private _status?: armonikApiGrpcV1Task_status001.TaskStatus;
  private _count?: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of StatusCount to deeply clone from
   */
  constructor(_value?: RecursivePartial<StatusCount.AsObject>) {
    _value = _value || {};
    this.status = _value.status;
    this.count = _value.count;
    StatusCount.refineValues(this);
  }
  get status(): armonikApiGrpcV1Task_status001.TaskStatus | undefined {
    return this._status;
  }
  set status(value: armonikApiGrpcV1Task_status001.TaskStatus | undefined) {
    this._status = value;
  }
  get count(): number | undefined {
    return this._count;
  }
  set count(value: number | undefined) {
    this._count = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    StatusCount.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): StatusCount.AsObject {
    return {
      status: this.status,
      count: this.count
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
  ): StatusCount.AsProtobufJSON {
    return {
      status:
        armonikApiGrpcV1Task_status001.TaskStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ],
      count: this.count
    };
  }
}
export module StatusCount {
  /**
   * Standard JavaScript object representation for StatusCount
   */
  export interface AsObject {
    status?: armonikApiGrpcV1Task_status001.TaskStatus;
    count?: number;
  }

  /**
   * Protobuf JSON representation for StatusCount
   */
  export interface AsProtobufJSON {
    status?: string;
    count?: number;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.Count
 */
export class Count implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.Count';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Count();
    Count.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Count) {
    _instance.values = _instance.values || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Count, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new StatusCount();
          _reader.readMessage(
            messageInitializer1,
            StatusCount.deserializeBinaryFromReader
          );
          (_instance.values = _instance.values || []).push(messageInitializer1);
          break;
        default:
          _reader.skipField();
      }
    }

    Count.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Count, _writer: BinaryWriter) {
    if (_instance.values && _instance.values.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.values as any,
        StatusCount.serializeBinaryToWriter
      );
    }
  }

  private _values?: StatusCount[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Count to deeply clone from
   */
  constructor(_value?: RecursivePartial<Count.AsObject>) {
    _value = _value || {};
    this.values = (_value.values || []).map(m => new StatusCount(m));
    Count.refineValues(this);
  }
  get values(): StatusCount[] | undefined {
    return this._values;
  }
  set values(value: StatusCount[] | undefined) {
    this._values = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Count.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Count.AsObject {
    return {
      values: (this.values || []).map(m => m.toObject())
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
  ): Count.AsProtobufJSON {
    return {
      values: (this.values || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module Count {
  /**
   * Standard JavaScript object representation for Count
   */
  export interface AsObject {
    values?: StatusCount.AsObject[];
  }

  /**
   * Protobuf JSON representation for Count
   */
  export interface AsProtobufJSON {
    values?: StatusCount.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.ResultRequest
 */
export class ResultRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.ResultRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new ResultRequest();
    ResultRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: ResultRequest) {
    _instance.session = _instance.session || '';
    _instance.resultId = _instance.resultId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: ResultRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.session = _reader.readString();
          break;
        case 2:
          _instance.resultId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    ResultRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: ResultRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.session) {
      _writer.writeString(1, _instance.session);
    }
    if (_instance.resultId) {
      _writer.writeString(2, _instance.resultId);
    }
  }

  private _session?: string;
  private _resultId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of ResultRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<ResultRequest.AsObject>) {
    _value = _value || {};
    this.session = _value.session;
    this.resultId = _value.resultId;
    ResultRequest.refineValues(this);
  }
  get session(): string | undefined {
    return this._session;
  }
  set session(value: string | undefined) {
    this._session = value;
  }
  get resultId(): string | undefined {
    return this._resultId;
  }
  set resultId(value: string | undefined) {
    this._resultId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    ResultRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): ResultRequest.AsObject {
    return {
      session: this.session,
      resultId: this.resultId
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
  ): ResultRequest.AsProtobufJSON {
    return {
      session: this.session,
      resultId: this.resultId
    };
  }
}
export module ResultRequest {
  /**
   * Standard JavaScript object representation for ResultRequest
   */
  export interface AsObject {
    session?: string;
    resultId?: string;
  }

  /**
   * Protobuf JSON representation for ResultRequest
   */
  export interface AsProtobufJSON {
    session?: string;
    resultId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskOutputRequest
 */
export class TaskOutputRequest implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskOutputRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskOutputRequest();
    TaskOutputRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskOutputRequest) {
    _instance.session = _instance.session || '';
    _instance.taskId = _instance.taskId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskOutputRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.session = _reader.readString();
          break;
        case 2:
          _instance.taskId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    TaskOutputRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: TaskOutputRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.session) {
      _writer.writeString(1, _instance.session);
    }
    if (_instance.taskId) {
      _writer.writeString(2, _instance.taskId);
    }
  }

  private _session?: string;
  private _taskId?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskOutputRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskOutputRequest.AsObject>) {
    _value = _value || {};
    this.session = _value.session;
    this.taskId = _value.taskId;
    TaskOutputRequest.refineValues(this);
  }
  get session(): string | undefined {
    return this._session;
  }
  set session(value: string | undefined) {
    this._session = value;
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
    TaskOutputRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskOutputRequest.AsObject {
    return {
      session: this.session,
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
  ): TaskOutputRequest.AsProtobufJSON {
    return {
      session: this.session,
      taskId: this.taskId
    };
  }
}
export module TaskOutputRequest {
  /**
   * Standard JavaScript object representation for TaskOutputRequest
   */
  export interface AsObject {
    session?: string;
    taskId?: string;
  }

  /**
   * Protobuf JSON representation for TaskOutputRequest
   */
  export interface AsProtobufJSON {
    session?: string;
    taskId?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.Error
 */
export class Error implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.Error';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Error();
    Error.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Error) {
    _instance.taskStatus = _instance.taskStatus || 0;
    _instance.detail = _instance.detail || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Error, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.taskStatus = _reader.readEnum();
          break;
        case 2:
          _instance.detail = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Error.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Error, _writer: BinaryWriter) {
    if (_instance.taskStatus) {
      _writer.writeEnum(1, _instance.taskStatus);
    }
    if (_instance.detail) {
      _writer.writeString(2, _instance.detail);
    }
  }

  private _taskStatus?: armonikApiGrpcV1Task_status001.TaskStatus;
  private _detail?: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Error to deeply clone from
   */
  constructor(_value?: RecursivePartial<Error.AsObject>) {
    _value = _value || {};
    this.taskStatus = _value.taskStatus;
    this.detail = _value.detail;
    Error.refineValues(this);
  }
  get taskStatus(): armonikApiGrpcV1Task_status001.TaskStatus | undefined {
    return this._taskStatus;
  }
  set taskStatus(value: armonikApiGrpcV1Task_status001.TaskStatus | undefined) {
    this._taskStatus = value;
  }
  get detail(): string | undefined {
    return this._detail;
  }
  set detail(value: string | undefined) {
    this._detail = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Error.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Error.AsObject {
    return {
      taskStatus: this.taskStatus,
      detail: this.detail
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
  ): Error.AsProtobufJSON {
    return {
      taskStatus:
        armonikApiGrpcV1Task_status001.TaskStatus[
          this.taskStatus === null || this.taskStatus === undefined
            ? 0
            : this.taskStatus
        ],
      detail: this.detail
    };
  }
}
export module Error {
  /**
   * Standard JavaScript object representation for Error
   */
  export interface AsObject {
    taskStatus?: armonikApiGrpcV1Task_status001.TaskStatus;
    detail?: string;
  }

  /**
   * Protobuf JSON representation for Error
   */
  export interface AsProtobufJSON {
    taskStatus?: string;
    detail?: string;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskError
 */
export class TaskError implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskError';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskError();
    TaskError.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskError) {
    _instance.taskId = _instance.taskId || '';
    _instance.errors = _instance.errors || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskError,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.taskId = _reader.readString();
          break;
        case 2:
          const messageInitializer2 = new Error();
          _reader.readMessage(
            messageInitializer2,
            Error.deserializeBinaryFromReader
          );
          (_instance.errors = _instance.errors || []).push(messageInitializer2);
          break;
        default:
          _reader.skipField();
      }
    }

    TaskError.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: TaskError, _writer: BinaryWriter) {
    if (_instance.taskId) {
      _writer.writeString(1, _instance.taskId);
    }
    if (_instance.errors && _instance.errors.length) {
      _writer.writeRepeatedMessage(
        2,
        _instance.errors as any,
        Error.serializeBinaryToWriter
      );
    }
  }

  private _taskId?: string;
  private _errors?: Error[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskError to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskError.AsObject>) {
    _value = _value || {};
    this.taskId = _value.taskId;
    this.errors = (_value.errors || []).map(m => new Error(m));
    TaskError.refineValues(this);
  }
  get taskId(): string | undefined {
    return this._taskId;
  }
  set taskId(value: string | undefined) {
    this._taskId = value;
  }
  get errors(): Error[] | undefined {
    return this._errors;
  }
  set errors(value: Error[] | undefined) {
    this._errors = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskError.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskError.AsObject {
    return {
      taskId: this.taskId,
      errors: (this.errors || []).map(m => m.toObject())
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
  ): TaskError.AsProtobufJSON {
    return {
      taskId: this.taskId,
      errors: (this.errors || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module TaskError {
  /**
   * Standard JavaScript object representation for TaskError
   */
  export interface AsObject {
    taskId?: string;
    errors?: Error.AsObject[];
  }

  /**
   * Protobuf JSON representation for TaskError
   */
  export interface AsProtobufJSON {
    taskId?: string;
    errors?: Error.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskList
 */
export class TaskList implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskList';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskList();
    TaskList.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskList) {
    _instance.taskIds = _instance.taskIds || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskList,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          const messageInitializer1 = new TaskId();
          _reader.readMessage(
            messageInitializer1,
            TaskId.deserializeBinaryFromReader
          );
          (_instance.taskIds = _instance.taskIds || []).push(
            messageInitializer1
          );
          break;
        default:
          _reader.skipField();
      }
    }

    TaskList.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: TaskList, _writer: BinaryWriter) {
    if (_instance.taskIds && _instance.taskIds.length) {
      _writer.writeRepeatedMessage(
        1,
        _instance.taskIds as any,
        TaskId.serializeBinaryToWriter
      );
    }
  }

  private _taskIds?: TaskId[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskList to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskList.AsObject>) {
    _value = _value || {};
    this.taskIds = (_value.taskIds || []).map(m => new TaskId(m));
    TaskList.refineValues(this);
  }
  get taskIds(): TaskId[] | undefined {
    return this._taskIds;
  }
  set taskIds(value: TaskId[] | undefined) {
    this._taskIds = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    TaskList.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskList.AsObject {
    return {
      taskIds: (this.taskIds || []).map(m => m.toObject())
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
  ): TaskList.AsProtobufJSON {
    return {
      taskIds: (this.taskIds || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module TaskList {
  /**
   * Standard JavaScript object representation for TaskList
   */
  export interface AsObject {
    taskIds?: TaskId.AsObject[];
  }

  /**
   * Protobuf JSON representation for TaskList
   */
  export interface AsProtobufJSON {
    taskIds?: TaskId.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for armonik.api.grpc.v1.TaskIdWithStatus
 */
export class TaskIdWithStatus implements GrpcMessage {
  static id = 'armonik.api.grpc.v1.TaskIdWithStatus';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new TaskIdWithStatus();
    TaskIdWithStatus.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: TaskIdWithStatus) {
    _instance.taskId = _instance.taskId || undefined;
    _instance.status = _instance.status || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: TaskIdWithStatus,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.taskId = new TaskId();
          _reader.readMessage(
            _instance.taskId,
            TaskId.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.status = _reader.readEnum();
          break;
        default:
          _reader.skipField();
      }
    }

    TaskIdWithStatus.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: TaskIdWithStatus,
    _writer: BinaryWriter
  ) {
    if (_instance.taskId) {
      _writer.writeMessage(
        1,
        _instance.taskId as any,
        TaskId.serializeBinaryToWriter
      );
    }
    if (_instance.status) {
      _writer.writeEnum(2, _instance.status);
    }
  }

  private _taskId?: TaskId;
  private _status?: armonikApiGrpcV1Task_status001.TaskStatus;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of TaskIdWithStatus to deeply clone from
   */
  constructor(_value?: RecursivePartial<TaskIdWithStatus.AsObject>) {
    _value = _value || {};
    this.taskId = _value.taskId ? new TaskId(_value.taskId) : undefined;
    this.status = _value.status;
    TaskIdWithStatus.refineValues(this);
  }
  get taskId(): TaskId | undefined {
    return this._taskId;
  }
  set taskId(value: TaskId | undefined) {
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
    TaskIdWithStatus.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): TaskIdWithStatus.AsObject {
    return {
      taskId: this.taskId ? this.taskId.toObject() : undefined,
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
  ): TaskIdWithStatus.AsProtobufJSON {
    return {
      taskId: this.taskId ? this.taskId.toProtobufJSON(options) : null,
      status:
        armonikApiGrpcV1Task_status001.TaskStatus[
          this.status === null || this.status === undefined ? 0 : this.status
        ]
    };
  }
}
export module TaskIdWithStatus {
  /**
   * Standard JavaScript object representation for TaskIdWithStatus
   */
  export interface AsObject {
    taskId?: TaskId.AsObject;
    status?: armonikApiGrpcV1Task_status001.TaskStatus;
  }

  /**
   * Protobuf JSON representation for TaskIdWithStatus
   */
  export interface AsProtobufJSON {
    taskId?: TaskId.AsProtobufJSON | null;
    status?: string;
  }
}
