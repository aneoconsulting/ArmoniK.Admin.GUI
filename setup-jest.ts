import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
import '@angular/localize/init';
import { TextEncoder } from 'util';
import { TransformStream, WritableStream } from 'web-streams-polyfill';
import { Blob } from 'blob-polyfill';
import 'isomorphic-fetch';

setupZonelessTestEnv();
global.TextEncoder = TextEncoder;

Object.defineProperties(globalThis, {
  TransformStream: {
    value: TransformStream
  },
  WritableStream: {
    value: WritableStream
  },
  Blob: {
    value: Blob
  }
})