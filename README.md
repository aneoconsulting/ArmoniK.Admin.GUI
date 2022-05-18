# ArmoniK GUI

ArmoniK GUI add an administration interface to the ArmoniK project.

It is a monorepo containing the client, the server and shared libraries.

## Tech Stack

**Client:** [Angular](https://angular.io), [Clarity](https://clarity.design/)

**Server:** [Nest](https://nestjs.com)

**Build System:** [Nx](https://nx.dev/)

Gitflow is used to facilitate the production and management of code.

## Run Locally

Clone the project

```bash
  git clone https://github.com/aneoconsulting/ArmoniK.Admin.GUI
```

Go to the project directory

```bash
  cd ArmoniK.Admin.GUI
```

Install dependencies

```bash
  npm install
```

Start the app (front-end using Angular)

```bash
  nx serve app
```

Start the server (REST API using Nest)

```bash
  nx serve api
```

Start the GUI (app and server)

```bash
  nx run-many --target=serve --all
```

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## Running Tests

The tests run at each automatic PR via the actions.

But, it is possible to run tests locally.

Check lint

```bash
  npx nx affected --target=lint --parallel=3 --base=develop
```

Run tests

```bash
  npx nx affected --target=test --parallel=3 --ci --code-coverage --base=develop
```

Build project

```bash
  npx nx affected --target=build --parallel=3 --base=develop
```

## Deployment

ArmoniK GUI is intended to work within the ArmoniK project. It is therefore not interesting to deploy the project independently.

With each push on _main_, _develop_ and a _tag_, a docker image is built and sent to the docker hub of aneo. The docker image is then used within the ArmoniK project.

## Authors

- [@esoubiran-aneo](https://github.com/esoubiran-aneo)
- [@maurelleaneo](https://github.com/maurelleaneo)

## License

[Apache 2.0](https://choosealicense.com/licenses/apache/)
