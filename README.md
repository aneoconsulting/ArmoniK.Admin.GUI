# ArmoniK Admin GUI ![Latest version](https://img.shields.io/github/v/tag/aneoconsulting/armonik.admin.gui)

This project is part of the [ArmoniK](https://github.com/aneoconsulting/ArmoniK) project. Please check its repository for more information.

The ArmoniK Admin GUI aims to provide an easy way to observe and interact with the data of an ArmoniK deployment.

## Docker Image

The application is designed to run in an ArmoniK cluster, but you can deploy it with the following command:

```sh
docker run -dit -p 8080:1080 --name armonik-admin-app dockerhubaneo/armonik_admin_app
```

The application will then be available at http://localhost:8080/admin/en/. 

## Development

### Material Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0. It uses [Material 3 components](https://material.angular.dev/) in most of the code.
You can check both angular and angular material versions in the [package.json](./package.json) file.

### Environment

You will need to install [Node](https://nodejs.org) on your local development environment. We recommand installing it using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm).
To know which version to use, please refer to the [package.json](./package.json) file.

[Pnpm](https://pnpm.io/) is the project package manager. Once Node is installed on your environment, please install it with the following command:

```sh
npm install -g pnpm
```  

### Installation

You can install the required project dependencies with the following command:

```sh
pnpm install
```

Then, create the file `proxy.conf.json` in the `src` directory, and paste the following code (or copy the [example file](./src/proxy.conf.json.example) with its correct name):

```json
{
    "/armonik.api.grpc.v1": {
        "target": "http://armonik_url:armonik_control_plane_port",
        "secure": false
    },
    "/static": {
        "target": "http://armonik_url:armonik_control_plane_port",
        "secure": false
    }
}
```
And replace `armonik_url` and `armonik_control_plane_port` with your armonik url and port.

> You don't know how to deploy ArmoniK ? Check the official documentation on https://armonik.readthedocs.io/en/latest/ 

### Development server

You can now run the following command to start a development version of the app: 
```sh
pnpm start
```

The application will be available on `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `pnpm test` or `npx jest` to execute the unit tests using [Jest](https://jestjs.io/).

If you want to see the coverage, you can run `pnpm test-coverage`

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Contributing

### Conventional pull request commit rules

It is important to note that this repository [ArmoniK Admin GUI](https://github.com/aneoconsulting/ArmoniK.Admin.GUI)
adheres to semantic releases. Familiarity with conventional commit rules is imperative and make it easier to
find and understand commits of the main branch. In addition, failure to follow the conventional commit guidelines may result
in rejection of the pull requests.

Conventional Commits rules is a convention for structuring pull request commit messages to describe changes. A pull request's commit message format must be as follows:

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Such as each PR commit message consists of a `header`, a `body` and a `footer`, all separated by blank lines.

The header of a PR commit message has a special format that includes a `type`, a `scope` and a `subject`. The type indicates
the nature of the change. Commonly used types include:

- `feat`: for a new feature.
- `fix`: for a bug fix.
- `docs`: documentation changes.
- `style`: for code style changes (formatting, indentation, etc.).
- `refactor`: code changes that neither fix a bug nor add a feature.
- `perf`: for performance improvements.
- `test`: adding or modifying tests.
- `chore`: maintenance or organizational tasks.
- `build`: changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)

Hereafter, two examples of a conventional pull request commits:

```text
docs(changelog): update changelog to beta.5
```

and:

```text
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

In addition, the `fix` and `feat` header types have the following effects:

- `fix`: a commit of this type patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- `feat`: a commit of this type introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).

For more details about conventional commit rules, please refer
to [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

### Trunk based development & branches organization

The repository is managed using the [trunk based development method](https://trunkbaseddevelopment.com/). The goal is to have one main branch (main) and short-lived development branches. Since the branches are small, they are merged more quickly and they are less likely to be conflicting with each other.

### File structure

All development files and components are located in the `src/app` folder.
They are all splitted accross different folders, that each have their own purpose.

A component or page includes at least 3 files:
- An html file (angular template),
- A typescript file (angular component),
- A test file (jest)

Some of them can also include a scss file. All those files share the same name (for example `name.component.{*ts,scss,html}). Each component is [standalone](https://angular.dev/reference/migrations/standalone).

#### Routes

The following folders list all available routes to the user:
- `applications`: Armonik Data - Resolves on a table
- `dashboard`: Landing page of the application - Can add tables of various Armonik Data types. 
- `partitions`: Armonik Data - Resolves on a table
- `profile`: User informations authorizations.
- `results`: Armonik Data - Resolves on a table
- `sessions`: Armonik Data - Resolves on a table
- `settings`: GUI settings
- `tasks`: Armonik Data - Resolves on a table

Those folder always include an `index` component that resolves to their respective route. The `partitions`, `sessions`, `tasks` and `results` pages also include `show` components.
Those routes also includes specific services and components.

#### Components

Generic components are located inside the `src/app/components` folder. They represent components used throughout the entire application. You can find filters related components, dialogs, inspection components, tables...

#### Services

Just like generic components, some services are used throughout the application. To know more about them, please check their code and documentation.

#### Types

Types folder is particular. While it stores some generic types that are used in the application, they also include abstract classes and interfaces of some components and services.