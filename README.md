# MaterialAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

## Installation

First, make sure to have [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [pnpm](https://pnpm.io/installation) installed on your machine.

Then install required node_modules by running:

```sh
pnpm install
```

Then, create the file `proxy.conf.json` in the `src` directory, and paste the following code:

```json
{
    "/armonik.api.grpc.v1": {
        "target": "http://armonik_url:armonik_port",
        "secure": false
    },
    "/static": {
        "target": "http://armonik_url:armonik_port",
        "secure": false
    }
}
```
And replace `armonik_url` and `armonik_port` with your armonik url and port.

## Development server

You can now run the following command to start a development version of the app: 
```sh
pnpm start
```

The application will be available on `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `pnpm test` or `npx jest` to execute the unit tests via [Karma](https://karma-runner.github.io).

If you want to see the coverage, you can run `pnpm test-coverage`

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
