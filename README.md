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

Install dependencies

```bash
  npm install
```

Install Nx globally

```bash
  npm install -g nx
```

Commandes available

```sh
# Start the project (App and Server)
npm run start
# Build the project (App and Server)
npm run build
# Run test on the project (App, Server and libs)
npm run test
# Format the project (App, Server and libs)
npm run format
# Check format of the project (App, Server and libs)
npm run format:check
# Lint the project (App, Server and libs)
npm run lint
```

### App

Start the app (front-end using Angular)

```bash
  nx serve app
```

### Server

First, you need to install [MongoDB](https://www.mongodb.com/docs/manual/installation/).
Then, you must copy `.env.example` to `.env` and fill host, port and database name to use it locally.

Example

```txt
MongoDB__Host=localhost
MongoDB__Port=27017
MongoDB__DatabaseName=armonik
```

And finally, you can start the server (REST API using Nest)

```bash
  nx serve api
```

### App and Server

Start the GUI (app and server)

```bash
  nx run-many --target=serve --all
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
  npx nx affected --target=format --parallel=3 --base=main
```

Check lint

```bash
  npx nx affected --target=lint --parallel=3 --base=main
```

Run tests

```bash
  npx nx affected --target=test --parallel=3 --code-coverage --base=main
```

Build project

```bash
  npx nx affected --target=build --parallel=3 --base=main
```

## Deployment

ArmoniK GUI is intended to work within the ArmoniK project. It is therefore not interesting to deploy the project independently.

With each push on _main_ and a _tag_, a docker image is built and sent to the docker hub of aneo. The docker image is then used within the ArmoniK project.

### Docker

To build docker images, you need to run on linux this command

```sh
./scripts/create-container.sh <app|api> <version>
```

This is useful to try current GUI in a local deployment of ArmoniK and avoid name mistake.

## Create a release

In order to be able to release quickly, some tasks are automated.
To create a release, you need to:

1. Create a release using GitHub
2. Publish the release
3. Wait for actions to finish

## Authors

- [@esoubiran-aneo](https://github.com/esoubiran-aneo)
- [@maurelleaneo](https://github.com/maurelleaneo)

## License

[Apache 2.0](https://choosealicense.com/licenses/apache/)
