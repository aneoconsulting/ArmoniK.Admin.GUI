# ArmoniK GUI

ArmoniK GUI add an administration interface to the ArmoniK project.

It is a monorepo containing the client and shared libraries.

## Tech Stack

**Client:** [Angular](https://angular.io), [Clarity](https://clarity.design/), [gRCP](https://grpc.io/)

**Build System:** [Nx](https://nx.dev/)

## Apps

- **app:** The main app of the project. It is the administration interface of ArmoniK.

## Libs

The libs are divided into 4 categories:

- **feature:** The feature libs are the libs that implement smart UI (with access to data sources) for specific business use cases or pages in an application.
- **ui:** The UI libs are the libs that contain only presentational components (also called "dumb" components).
- **data-access:** The data-access libs are the libs that contain code for interacting with a back-end system. It also includes all the code related to state management.
- **utility:** The utility libs are the libs that contain low-level utilities used by many libraries and applications.

There is also a shared lib that contains code that is shared between multiple apps and libs.

- **shared:** The shared libs are the libs that contain code that is shared between multiple apps and libs. It will be divided into the 4 categories above.

This structure is based on the [Nx documentation](https://nx.dev/more-concepts). It is a good practice to have a better separation of concerns and a better maintainability. So this structure mused be respected.

## Run Locally

Clone the project

```bash
  git clone --recurse-submodules https://github.com/aneoconsulting/ArmoniK.Admin.GUI
```

Go to the project directory

```bash
  cd ArmoniK.Admin.GUI
```

### Install dependencies

```bash
  yarn
```

### Generate types from Proto files

These types are generated from the Proto files in `/libs/shared/data-access/src/lib/proto/generated` and use to request the gRPC services.

```sh
yarn generate:proto
```

### Create proxy configuration

Duplicate the file `proxy.conf.json.example` to `proxy.conf.json` and change the `<protocol>://<host>:<port>` value to the url of the ArmoniK backend.

This file is necessary to have access to the gRPC services and in order to be able to build the project.

### Commandes available

```sh
# Start the project (App)
yarn start
# Build the project (App)
yarn build
# Run test on the project (App and libs)
yarn test
# Format the project (App and libs)
yarn format
# Check format of the project (App and libs)
yarn format:check
# Lint the project (App and libs)
yarn lint
```

### App

Start the app

```bash
  yarn ng serve app
```

In order to have access to data, you must install [ArmoniK](https://github.com/aneoconsulting/ArmoniK) and start the service.

#### Analyze the app

##### Graph

Nx provides a graph of the dependencies between the apps and libs. It's useful to understand the architecture of the project.

```bash
  yarn ng graph
```

In fact, this project is sliced into multiple apps and libs. This allow to have a better separation of concerns and a better maintainability. Also, we can use the power of Nx to build, test and lint only the affected files and libs thanks to caching. And, thanks this architecture, work with orthers is easier.

##### Bundle Analyzer

If Angular tells that the dist folder is too heavy, you can analyze the app and dependencies with the following command:

```bash
  # Install a source map explorer
  npm install -g source-map-explorer
  # Build app and generate source maps
  yarn ng build app --prod --sourceMap=true
  # Analyze source maps
  source-map-explorer dist/apps/app/main.<hash>.js
```

Using this, you can optimize the way the dependencies are loaded and reduce initial load.

### App

Start the GUI

```bash
  yarn ng run-many --target=serve --all
```

### Generate a new lib

```bash
  yarn ng g @nrwl/angular:library --unitTestRunner karma --standalone --directory=<directory-name> --importPath=@armonik.admin.gui/<directory-name>/<lib-name> <lib-name>
```

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

## Running Tests

The tests run at each automatic PR via the actions.

But, it is possible to run tests locally (only on affected files).

Format code

```bash
  yarn ng affected --target=format --parallel=3 --base=main
```

Check lint

```bash
  yarn ng affected --target=lint --parallel=3 --base=main
```

Run tests

```bash
  yarn ng affected --target=test --parallel=3 --code-coverage --base=main
```

Build project

```bash
  yarn ng affected --target=build --parallel=3 --base=main
```

## Deployment

ArmoniK GUI is intended to work within the ArmoniK project. It is therefore not interesting to deploy the project independently.

With each push on _main_ and a _tag_, a docker image is built and sent to the docker hub of aneo. The docker image is then used within the ArmoniK project.

### Docker

To build docker images, you need to run on linux this command

```sh
./scripts/create-container.sh <app> <version>
```

This is useful to try current GUI in a local deployment of ArmoniK and avoid name mistake.

## Authors

- [@esoubiran-aneo](https://github.com/esoubiran-aneo)
- [@maurelleaneo](https://github.com/maurelleaneo)
- [@Faust1-2was-Aneo](https://github.com/Faust1-2was-Aneo)

## License

[Apache 2.0](https://choosealicense.com/licenses/apache/)
