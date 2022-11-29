# ArmoniK GUI

ArmoniK GUI add an administration interface to the ArmoniK project.

It is a monorepo containing the client, the server and shared libraries.

## Tech Stack

**Client:** [Angular](https://angular.io), [Clarity](https://clarity.design/)

**Server:** [Nest](https://nestjs.com)

**Build System:** [Nx](https://nx.dev/)

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

### Install mongoDB

See the [MongoDB website](https://www.mongodb.com/docs/manual/installation/) for the installation guide.

You must use version **^4.4.15**. Be careful when using pipeline in aggregation to avoid errors because of an API change with version 5.x.x.

- ["$lookup with 'pipeline' may not specify 'localField' or 'foreignField'"](https://stackoverflow.com/questions/66748716/lookup-with-pipeline-may-not-specify-localfield-or-foreignfield)

### Populate DB (Optional)

_A local installation of [ArmoniK](https://github.com/aneoconsulting/ArmoniK) is required_

1. Run sample using ArmoniK.Sample
2. Export database using ArmoniK/tools/export-mongo.sh
3. Move exported files to apps/api/src/database/fixtures
4. Import database using the [MongoDB Compass](https://www.mongodb.com/docs/compass/master/install/).

### Generate types from Proto files

These types are generated from the Proto files in `/apps/app/src/assets/ArmoniK.Api` and use to request the gRPC services.

```sh
# For Linux
yarn proto:generate
# For Windows
yarn proto:generate:win
```

### Commandes available

```sh
# Start the project (App and Server)
yarn start
# Build the project (App and Server)
yarn build
# Run test on the project (App, Server and libs)
yarn test
# Format the project (App, Server and libs)
yarn format
# Check format of the project (App, Server and libs)
yarn format:check
# Lint the project (App, Server and libs)
yarn lint
```

### App

Start the app (front-end using Angular)

```bash
  yarn ng serve app
```

#### Analyze the app

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

### Server (Deprecated)

First, you need to install [MongoDB](https://www.mongodb.com/docs/manual/installation/).
Then, you must copy `.env.example` to `.env` and fill host, port and database name to use it locally.

Example

```txt
MongoDB__Host=127.0.0.1
MongoDB__Port=27017
MongoDB__DatabaseName=armonik
```

And finally, you can start the server (REST API using Nest)

```bash
  yarn ng serve api
```

### App and Server

Start the GUI (app and server)

```bash
  yarn ng run-many --target=serve --all
```

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

## Documentation

For the API, you can access to Swagger UI:

```bash
  http://localhost:4200/api/_swagger
```

To access to the json file:

```bash
  http://localhost:4200/api/_swagger-json
```

This is only available in development mode.

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

### Docker (Deprecated for API)

To build docker images, you need to run on linux this command

```sh
./scripts/create-container.sh <app|api> <version>
```

This is useful to try current GUI in a local deployment of ArmoniK and avoid name mistake.

<!-- ## Create a release

In order to be able to release quickly, some tasks are automated.
To create a release, you need to:

1. Create a release (starting with a 'v' and following [Semver](https://semver.org), e.g.: v2.4.5) using GitHub
2. Publish the release
3. Wait for actions to finish -->

## Authors

- [@esoubiran-aneo](https://github.com/esoubiran-aneo)
- [@maurelleaneo](https://github.com/maurelleaneo)
- [@Faust1-2was-Aneo](https://github.com/Faust1-2was-Aneo)

## License

[Apache 2.0](https://choosealicense.com/licenses/apache/)
