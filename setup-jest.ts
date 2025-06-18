import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
import '@angular/localize/init';
import { TextEncoder } from 'util';

setupZonelessTestEnv();
global.TextEncoder = TextEncoder;