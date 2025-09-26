import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
import '@angular/localize/init';
import { TextEncoder } from 'node:util';

setupZonelessTestEnv();
globalThis.TextEncoder = TextEncoder;