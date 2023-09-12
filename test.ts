import { MockInstance, MockService, ngMocks } from 'ng-mocks'; // eslint-disable-line import/order
import { CommonModule } from '@angular/common'; // eslint-disable-line import/order
import { ApplicationModule } from '@angular/core'; // eslint-disable-line import/order
import { BrowserModule } from '@angular/platform-browser'; // eslint-disable-line import/order
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router'; // eslint-disable-line import/order
import addEventHandler  from 'jest-circus';

// auto spy
ngMocks.autoSpy('jest');
// in case of jest
// ngMocks.autoSpy('jest');

// In case, if you use @angular/router and Angular 14+.
// You might want to set a mock of DefaultTitleStrategy as TitleStrategy.
// A14 fix: making DefaultTitleStrategy to be a default mock for TitleStrategy
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// Usually, *ngIf and other declarations from CommonModule aren't expected to be mocked.
// The code below keeps them.

ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

// auto restore for jasmine and jest <27
// declare const jasmine: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jest: any;
jest.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

// // If you use jest v27+, please add to its config testRunner=jest-jasmine2 for now.
// // If you don't want to rely on jasmine at all, then, please,
// // upvote the issue on github: https://github.com/facebook/jest/issues/11483.
// // Once it has been merged you can use the code below.
// // Also, please consider usage of MockInstance.scope instead.

addEventHandler((event: { name: string }) => {
  switch (event.name) {
  case 'run_describe_start':
  case 'test_start':
    MockInstance.remember();
    break;
  case 'run_describe_finish':
  case 'run_finish':
    MockInstance.restore();
    break;
  default:
  }
});
