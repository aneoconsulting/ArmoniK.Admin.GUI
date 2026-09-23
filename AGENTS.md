# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

ArmoniK Admin GUI: an Angular 20 (standalone components, zoneless change detection, Angular Material) front-end for the ArmoniK orchestrator. It talks to the ArmoniK control plane over **gRPC-web** using the generated clients from `@aneoconsultingfr/armonik.api.angular` (via `@ngx-grpc`). Package manager is **pnpm**.

## Commands

```sh
pnpm install
pnpm start              # ng serve on http://localhost:4200 (needs src/proxy.conf.json, see below)
pnpm start:fr           # serve the French locale
pnpm build              # ng build (en + fr localized builds)
pnpm lint               # eslint (CI runs this)
pnpm lint:fix
pnpm test               # jest (CI runs this)
pnpm test-coverage
pnpm localize           # ng extract-i18n → merges new strings into src/locale/messages*.xlf

npx jest src/app/sessions/services/sessions-index.service.spec.ts   # single file
npx jest -t 'name of test'                                           # single test by name
```

Local dev proxies the backend through `src/proxy.conf.json`, which maps `/armonik.api.grpc.v1` and `/static` to the ArmoniK endpoint (`http://armonik_url:armonik_port`).

## Architecture

**Feature folders.** Each ArmoniK resource (`applications`, `partitions`, `sessions`, `tasks`, `results`) plus `dashboard`, `profile`, `settings`, `healthcheck` lives in `src/app/<feature>/`, lazily loaded from `app.routes.ts` through its own `routes.ts`. A resource folder typically has `index.component` (list page), `show.component` (detail page), `components/table.component`, `types.ts`, and a `services/` set that follows one naming scheme:

- `<x>-grpc.service` extends `GrpcTableService` (`types/services/grpcService.ts`): builds list/get/cancel requests with the generated client
- `<x>-data.service` extends `AbstractTableDataService` (`types/services/table-data.service.ts`): holds `loading`/`total`/`data` signals, `filters`, `options`, and a `refresh$` subject that triggers the gRPC list call (with cache from `CacheService`)
- `<x>-index.service`: available/default columns (`TableColumn`), default options, refresh interval
- `<x>-filters.service` implements `DataFilterService`: filter field definitions
- `<x>-statuses.service`, `<x>-inspection.service`, `<x>-grpc-actions.service`: status labels/colors, show-page fields, row actions

When you add behavior to one resource, check the sibling resources. They usually need the same change, since they share these abstractions.

**Component-scoped DI.** Most services are `@Injectable()` without `providedIn` and are listed in each page component's `providers` array (see `sessions/index.component.ts`). Generic components depend on abstract tokens (`DataFilterService`, `StatusService`, `GrpcActionsService`, …) that each page binds with `useExisting`/`useClass`. Only the app-wide services in `app.config.ts` are root singletons. A new service used by a page must be added to that page's providers, and specs must provide it too.

**Shared code.** `src/app/components/` holds generic UI (table, filters, inspection/show pages, dialogs, auto-refresh, graph). `src/app/services/` holds cross-cutting services: storage/localStorage config, query params and share URL, filters, table state, theme, navigation, auto-refresh. `src/app/types/` holds shared types and the abstract service/component base classes.

**Configuration & startup.** `DefaultConfigService` holds every default (columns, options, dashboard lines, theme, sidebar). User customizations are stored in localStorage through `StorageService`/`TableStorageService`. At startup, `app.config.ts` fetches versions, the current user, and `/static/gui_configuration` (server-provided config imported into storage). `GrpcHostInterceptor` rewrites the gRPC host when the user configured a custom endpoint.

**Path aliases:** `@app/*`, `@components/*`, `@services/*`, `@pipes/*`. They are mapped in tsconfig and in `jest.config.ts`.

## Conventions

- **i18n:** user-facing strings use `$localize` in TS and `i18n` attributes in templates. Run `pnpm localize` and fill in the French translation in `src/locale/messages.fr.xlf`.
- **Lint rules that bite:** single quotes, semicolons, 2-space indent, component selectors `app-kebab-case`, directive selectors `appCamelCase`, and `import/order` (alphabetized, case-insensitive, no blank lines between groups: external → internal aliases → relative).
- **Tests:** Jest with `jest-preset-angular`, colocated `*.spec.ts`. `d3`, `force-graph` and `chart.js` are replaced by mocks in `test/`. Many specs build the class directly with `TestBed` and mocked providers rather than rendering templates.
- **PR titles** must follow Conventional Commits with a lowercase subject (for example `fix(sessions): ...`), which CI enforces.
- User documentation (Sphinx/ReadTheDocs) lives in `.docs/content/`.
