# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Local-first ToDo PWA (Vue 3 + TypeScript + Vite). All data lives in IndexedDB in the browser — there is no backend. Deployed as a static site to GitHub Pages at `/ToDo/` (see `vite.config.ts` `base` and `.github/workflows/deploy-pages.yml`).

Code comments and some UI strings are in Italian; keep new comments in Italian for consistency.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then production build to `dist/`
- `npm run preview` — preview the production build

There is no test suite and no lint script configured in this repo.

## Architecture

Layered, dependency-inverted structure under `src/`:

```
models/       plain TypeScript interfaces (Task, TaskList, RecurrenceRule, TaskCompletionLogEntry)
db/           IndexedDB setup (idb) — schema.ts defines object stores/indexes, index.ts opens the DB
repositories/ I*Repository interfaces + IndexedDb* implementations; repositories/index.ts wires
              concrete instances as singletons (this is the sole composition point/DI seam)
services/     pure functions for business logic that doesn't belong to a store (recurrence math,
              date helpers, Today/Planned view derivation, suggestions)
stores/       Pinia stores (setup-style) — orchestrate repositories + services, hold reactive state
views/        route-level components (one per sidebar section: Today, Important, Planned, All, a List)
components/   presentational/feature components, grouped by domain (layout/, lists/, tasks/, icons/)
router/       vue-router routes, one per view
```

Data flow: components call store actions → store calls a repository (persist) and/or a service (pure
computation) → store updates its local reactive `tasks`/`lists` array (`upsertLocal`) so the UI reflects
IndexedDB without re-reading it. Any code writing to IndexedDB must pass through `toPlain()` (`src/db/index.ts`)
first, since Vue's reactive Proxies are not structured-cloneable.

To swap persistence (e.g. add a remote backend), implement the `I*Repository` interfaces in
`src/repositories/` and change the singletons in `src/repositories/index.ts` — nothing above that layer
should need to change.

### Soft delete

Tasks and lists are never hard-deleted: `softDelete()` sets `deletedAt`. Repository `getAll()` methods
filter out soft-deleted records. `remoteId`/`syncVersion`/`dirty` fields on `Task`/`TaskList` are
placeholders for a future remote-sync feature; no sync logic exists yet.

### Recurrence

`src/services/recurrenceService.ts` is the single source of truth for recurring-task math:
- `computeNextOccurrence` advances a date by one occurrence of a `RecurrenceRule` (daily/weekly/monthly/yearly/monthlyMultiDay).
- Completing a recurring task (`completeRecurringTask`) computes the next `dueDate` from the task's
  *original* `dueDate` (not the completion moment) and keeps the task active (`completed` stays `false`).
- Skipping (`skipRecurringTask`) advances repeatedly until the `dueDate` is no longer in the past.
- Both actions write a `TaskCompletionLogEntry` (`taskCompletions` store) recording `fromDueDate`/`toDueDate`.

### "Today" semantics

A task appears in the Today view either because `dueDate` is today/overdue or because it was explicitly
"added to Today" (`addedToTodayAt`) — a separate, deliberately distinct concept from `dueDate`. This flag
expires and is cleared automatically (`cleanupExpiredAddedToToday`, called on load and on a 5-minute
interval in `App.vue`).

### PWA update flow

`registerType: 'prompt'` in `vite.config.ts` means a new service-worker version never activates itself.
`App.vue` polls the service-worker URL every 60s and, when `needRefresh` becomes true, shows `UpdateAlert`;
the user must confirm before `updateServiceWorker()` runs.
