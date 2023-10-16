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


### Prerequisites

Before getting started with unit testing using Jest, make sure you have the following prerequisites:

- Node.js and npm installed


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



### Write unit tests for a simple service

We start by setting up our environment for testing our class. 

For a simple service, there is nothing hard to do. 

Jest provides us some API and functions to make our tests easier and readable. 

In  `describe()` function, you must define the target of your test suite. 

A test suite is a set of multiple tests programmed for testing expected or unexpected behaviours of a class.

The second argument is a callback function where you will write all your  unit tests about the class.


![image](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/e040fafc-7d81-4ae2-ac6b-d65d79d72b46)


In the example above, we classicly create our service. 

We use Jest API `expect` for testing that the service is really instantiated. 

[Expect](https://jestjs.io/docs/expect#expectvalue) API provides us lot of functions called "matchers" to check values and class behaviours in our assertions. 

We use `ToBeTruthy()` matcher to check if our service is correctly instantiated. 

You can read the documentation for more informations about matchers : https://jestjs.io/docs/expect#matchers


We use `it` function or `test()` function to write our unit test within. 

The first argument must describe what we expect from the unit test. 
In order to make our tests more readable and quick to understand, it's usually important to write precisely the expected behaviour or value. 

The second argument is a callback function including our test. 


![image](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/39c4989f-1fc4-4a95-b74a-91509161e171)

In the example above, we use the well-known AAA pattern for organzing our unit test 

1. Arrange : We initialize the object with methods and parameters we want to run after.
2. Act : We invoke methods or functions.
3. Assert : We check outputs and if returned values match with the expected behaviour.

In this case, we use `jest.spyOn()`function to watch method calls. 
You can read the documentation for more informations: https://jestjs.io/docs/jest-object#jestspyonobject-methodname

Once spied, we call the getter. 

Then, we check with the spy if the getter was actually called with `toHaveBeenCalled()`.
You can read the documentation for more informations: https://jestjs.io/docs/expect#tohavebeencalled



### Write unit tests for a service with dependencies


For testing a service with dependencies, we need to use more tools. 

We are going to work with Storage service for example. 
As we can see, the Storage.service have 2 others services injected. 
DefaultConfigService and Storage. 
To test methods linked with these injected services and reflect dependency injection , we are going to mock them.

![image](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/5bb526c8-a55d-42d3-bfc9-008378036cd9)


In the example above, we create two mocks:
1. mockItemData for simulating an object stored in local storage.
2. mockStorage for imitating behaviours of local storage browser Web API implemented by the service.

![image](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/9e806d3e-7b24-46a5-a4a2-6a330740ff65)

Then, we create our service by provding its required dependencies inside BeforeEach() function. 

This function will be called before each run of our test file.

We use the Angular API `TestBed` giving access to `configureTestingModule()`.
We are going to configure our service thanks to this method. 

It takes an object wherein we will push mocked dependencies into an array at providers property. 
We can directly push required services into providers' array. 

Or we can use an object like this : 

![image](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/c5fa29d6-d75c-4c83-a35f-0ed31d2eb05c)


The "provide" value is the required service name. 

The "useValue" value is the mock in charge to replicate behaviour of the real dependency. 

we also need to push the real Storage Service into providers' array. 

After this, we call the `inject()` method to inject the dependencies. We call this function because we use it our project instead of using `constructor()`. 


![image](https://github.com/aneoconsulting/ArmoniK.Admin.GUI/assets/136307285/6d201e17-a2a8-45e3-a7bf-9f5d56d0b352)


Rigth thre, we test the clear method of Storage service. 


 
































  

  
  
  
  
           



