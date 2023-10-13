## Unit testing in ArmoniK


### Brief introduction on testing in frontend 
  Testing is a crucial part of software developement.
  
  It brings to developers more confidence on what they're working on and more quality on software. 
  
  We have traditionally 3 types of tests.

    Tests
    1. Unit tests
    2. Integration tests
    3. End-to-End tests

![628b0dca3e6eda9219d40a6a_The-Testing-Pyramid-Simplified-for-One-and-All-1280X720 (1)](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/a2f411d5-db43-4d1a-9855-7dadc1816a5f)




 We'll be focused on unit testing.

### What are Unit tests ? 
 
  Unit testing is focused on writing tests for small building blocks of an application.

  It's about testing every expected and unexpected behaviour of our small unit of code. We usually write unit tests for classes, functions and standalone components. 
  
  We test classes and functions by checking their inputs and outputs in order to work with more predictable and consistent code.

  Unit testing allows us to quicker find out and fix bugs. It also adds a technical documentation support for developers. 
  
  In Javascript community you can use librairies like [Jasmine](https://jasmine.github.io/), [Jest](https://jestjs.io/) and recently [Vitest](https://vitest.dev/).

  We choose using Jest for his large adoption and popularity by Javascript community and frameworks like React, Vue and Angular.




  ### Jest installation 

  ArmoniK Admin GUI is developed with Angular. Angular natively offers to use Jasmine and Karma for testing. 

  As we choose using Jest, we need to delete Jasmine and Karma of the project.

  For removing Jasmine and Karma from the project, run `pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter` and `pnpm remove jasmine-core @types/jasmine`.

  #### Installation of Jest library and packages

  Run `pnpm add --save-dev jest @types/jest @types/node jest-environment-jsdom ts-jest ts-node jest-preset-angular`.

  @types/jest ts-node ts-jest and jest-preset-angular are needed for jest configuration in Typescript/Angular projects. 

  jest-environment-jsdom is a package recommended by Jest documentation for DOM simulation. (https://jestjs.io/docs/tutorial-jquery). 



  ### Jest setup and configuration 

Once Jest installed, we need to declare it in our Typescript configuration file. 
in `tsconfig.spec.json`, replace "jasmine" by :
```
"types": [
      "jest",
      "node", 
      "@angular/localize",
    ]
```

Add also this after types array in tsconfig.spec.json: 
```
  "emitDecoratorMetadata": true,
  "esModuleInterop": true,
  "module": "CommonJS"
```

In `tsconfig.app.json`, add again "jest" into types array:

```
 types: [
    "jest"
]
```
In project root, create a file named setup-jest.ts and add the following contents: 
```
import 'jest-preset-angular/setup-jest';
import '@angular/localize/init';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
```
Create a file named `jest.config.ts` with the following contents
```
import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  globals: {
    structuredClone,
  },
  moduleNameMapper: {
    '@components/(.*)': '<rootDir>/src/app/components/$1',
    '@services/(.*)': '<rootDir>/src/app/services/$1',
    '@pipes/(.*)': '<rootDir>/src/app/pipes/$1',
    '@app/(.*)': '<rootDir>/src/app/$1'
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],
  testEnvironment: './JSDOMEnvironmentPatch.ts',
  testEnvironmentOptions: {
    customExportConditions: ['named']
  }
};

export default config;
```
We use the javascript function structuredClone() for deep-copying objects in GUI. Unfornately, jest-environment-jsdom doesn't support it. So we use a polyfill for testing services using it. 


To add it, run: 

 1. `pnpm  install @ungap/structured-clone`
 2. `pnpm i --save-dev @types/ungap__structured-clone`
 3. add `"allowSyntheticDefaultImports": true` into compilerOptions object JSON in tsconfig.json.
 4. Then, add the following line at the top of jest.config.ts `import structuredClone from '@ungap/structured-clone'`.

Create a file named `JSDOMEnvironmentPatch.ts` with the following contents: 
```
 import JSDOMEnvironment from 'jest-environment-jsdom';
  export default class JSDOMEnvironmentPatch extends JSDOMEnvironment {
  constructor(
    ...args: ConstructorParameters<typeof JSDOMEnvironment>
  ) {
    super(...args);

    this.global.structuredClone = structuredClone;
  }
}
```
Don't forget to link it with jest.config.ts file with : `testEnvironment: './JSDOMEnvironmentPatch.ts'`.

In package.json, replace `ng test` by `jest` into scripts : `"test": "jest"`.
```
// package.json
    ..."test": "jest"
```
run `pnpm run test` let's go for tests !!



### Write our first test


Jest provides us some API and functions to test our components.

`describe()` allows us to define our tests suite. two parameters are expected: a string for the name of your test suite and a callback function in which we are going to write our unit tests.

Before, we need to set up our component with BeforeEach() function in which we gonna create a component/service and provide his dependencies. 

We'll see later mocking is a quite good practice for testing components with dependecny injection. 

It's going to help us to only select what we need from other services and avoid to call real services and components in our tests when possible.










  

  
  
  
  
           



