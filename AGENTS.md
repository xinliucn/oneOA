# AI Editing Rules

These rules are for AI agents editing this repository. Follow the existing code first; only add new patterns when the local code clearly needs them.

## Project Shape

- This is a Nuxt 4 + TypeScript project with a Nuxt module in `src/` and the runnable app in `playground/`.
- Business features usually belong in `playground/`. Module-level i18n/runtime behavior belongs in `src/`.
- Page files go in `playground/pages/`. Mobile pages live under `playground/pages/mobile/`; desktop pages usually live under `playground/pages/desktop/` or top-level route files such as `index.vue`.
- Composables go in `playground/composables/useXxx.ts`. Shared types go in `playground/types/`. Server utilities go in `playground/server/utils/`.
- Do not edit generated or dependency output such as `dist/`, `.nuxt/`, `node_modules/`, or lock files unless the task explicitly requires it.
- Keep real secrets out of the repo. Environment-specific values must come from `runtimeConfig` or environment variables.

## Code Style

- Use Vue Composition API with `<script setup lang="ts">`.
- Follow the existing ESLint style: 2 spaces, single quotes, no semicolons, concise TypeScript types.
- Prefer `unknown` plus type guards for external data. Use `any` only where legacy response shapes make it genuinely useful, mostly inside `playground/`.
- Keep changes scoped to the requested behavior. Do not do unrelated refactors while fixing a feature.
- Order `<script setup>` blocks: imports → props/emits → composables → state → computed → watchers → lifecycle → methods.

## Simplicity And Elegance

- Write the minimum code that solves the problem. Three similar lines are better than a premature abstraction.
- Do not add helpers, utilities, or wrappers for one-time operations. Only extract shared logic when it is used in at least two places.
- Do not add speculative fallbacks for internal invariants that Nuxt, Vue, or local code already guarantee. Do validate external input, backend responses, and browser capability boundaries.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Avoid feature flags, backwards-compatibility shims, or `_unused` variable renames unless the product requirement explicitly needs them.
- Prefer native Vue/Nuxt patterns over custom abstractions: `computed` over manual caching, `watch` over ad-hoc subscriptions, and existing composables over new wrappers.
- For shared client state, follow the existing `useState` + `$fetch` composable pattern. Use `useFetch` / `useAsyncData` when data is page-local or SSR-friendly.
- Keep templates readable: one expression per line, no ternaries longer than one line. Move complex display logic to `computed`.
- A component should do one thing well. If a component is doing two unrelated things, split it.

## State And Composables

- Shared state must use `useState` with namespaced keys following the pattern `模块名:状态名`, for example `auth:user`, `mobile:activeTab`, `notifications:list`. New modules should define their own namespace consistently.
- Cross-component logic belongs in `playground/composables/useXxx.ts`; components should mainly compose state, events, and presentation.
- For async composables, keep separate `loading`, `syncing`, `checking`, `error`, or `bootstrapped` state when the UI needs to distinguish those phases.
- Avoid duplicated request logic in components. Put normalization, caching, polling, and retry behavior in composables or server utilities.

## SSR And Client-Only APIs

- Any use of `window`, `document`, `localStorage`, `indexedDB`, `navigator`, `Notification`, Service Worker, timers tied to DOM visibility, or browser-only media APIs must be guarded with `import.meta.client`.
- Client-only plugin logic should live in `.client.ts` files when appropriate.
- Do not assume browser APIs exist during server rendering, route middleware, or module runtime setup.

## API And Server Rules

- Frontend code should call local `/api/...` endpoints, not remote backend URLs directly.
- Remote Windmill or internal backend calls should be proxied from `playground/server/api`.
- Prefer `playground/server/utils/windmillProxy.ts` and `proxyWindmill()` for backend proxying so cookies, user agent, referer, client IP, and `set-cookie` forwarding keep working.
- Server API handlers should use `defineEventHandler`, validate request bodies defensively, and throw `createError` for HTTP failures.
- Do not hardcode API base URLs in components or composables. Use `runtimeConfig.public.apiBase` and related config values.

## Error Handling

- Shared API errors should usually be handled in composables. Components should mainly react to `error` state exposed by the composable.
- For user-triggered failures, show a toast or inline error message. Background sync, polling, and cache hydration may fail quietly if they log the error and leave the UI usable.
- Auth errors (401/403) must trigger the auth cleanup flow in `useAuth()`, not ad-hoc redirects.
- Network errors should be caught and surfaced as a readable message, not as raw exception objects.
- Do not use `try/catch` to hide type or logic bugs. Only catch errors you can meaningfully handle.

## Data Normalization

- Treat backend responses as unstable unless the type is locally guaranteed.
- Use small helpers such as `isRecord`, `normalizeXxx`, `resolveXxx`, and `formatXxx` before data reaches the UI.
- Preserve raw response fields only when existing code needs them, for example `raw`, `mainTable`, or legacy payload fields.
- Components should render normalized data, not dig through inconsistent nested backend objects.

## Auth, Notification, And Push

- Keep auth state centered in `useAuth()` with `auth:user`, `auth:isLoggedIn`, and `auth:lastCheckTime`.
- Auth failure cleanup must not leave stale notification polling, push subscriptions, or IndexedDB data behind.
- Notification behavior should preserve the existing model: global `useState`, IndexedDB cache, server sync, unread count, polling, and `visibilitychange` refresh.
- Do not break `startPolling()` / `stopPolling()` subscriber counting or module-level timers.
- Push and notification permission flows must stay client-only and degrade safely when unsupported.

## Network Guard

- For internal links, use `useNetworkGuard().openGuardedUrl()` instead of direct `window.open()` or `window.location.href`.
- Keep internal network host/probe behavior driven by runtime config.
- Development mode may skip probes, but production behavior must still protect internal URLs.

## Internationalization

- Use `useAppI18n()` for UI text that is part of the app experience.
- Add or update copy in `playground/i18n/config.ts` for `zh-CN`, `zh-TW`, and `en` when adding visible labels, actions, empty states, or navigation text.
- Locale state is shared through `superapp:locale`; do not create another locale source of truth.
- New static UI text should go through `useAppI18n()`. Dynamic backend content, identifiers, logs, and temporary developer-only text do not need i18n.

## Components And Icons

- Vue component filenames should use PascalCase.
- Props and emits should be typed with `defineProps`, `withDefaults`, and `defineEmits`.
- Put expensive or branching display logic in `computed` helpers rather than large template expressions.
- Use the existing icon system in `playground/components/icons/Icon.vue` and `playground/components/icons/svg/`.
- When adding an icon, add the SVG component, register it in `iconMap`, and update the TypeScript icon-name union.
- Prefer composition over deeply nested slot structures. If a component grows large enough that one concern is hard to change safely, split the concern into a child component or composable.
- Avoid prop drilling beyond two levels — use composables or provide/inject instead.

## Styling

- Prefer `<style scoped>` for component styles.
- Keep the existing app feel: compact enterprise UI, white backgrounds, light borders, DCH red accents, and separate mobile/desktop layouts.
- Avoid global CSS unless the change is truly app-wide.
- Ensure text truncation, wrapping, and responsive sizing work on both mobile and desktop views.
- Mobile pages use fixed-height headers and footers with scrollable middle content; preserve this layout pattern.
- Do not introduce new CSS frameworks or utility libraries without explicit approval.

## Performance

- Lazy-load heavy components with `defineAsyncComponent` or `<LazyXxx>` when they are not needed on initial render.
- Avoid placing reactive data that changes frequently (like scroll position or timers) in top-level `useState` — keep it local.
- Do not trigger unnecessary re-renders: keep expensive derived data in `computed` values and avoid inline object/array literals in hot child props.
- Paginated or virtualized lists should use cursor or page-based loading, not load-all-at-once approaches.

## Quick Do-Not Checklist

Before submitting changes, verify none of these apply:

- [ ] Hardcoded API URLs in components or composables
- [ ] Browser APIs called without `import.meta.client` guard
- [ ] New static UI strings not going through `useAppI18n()`
- [ ] User-triggered errors silently swallowed without feedback
- [ ] Auth redirect logic duplicated outside `useAuth()`
- [ ] New global CSS that affects unrelated pages
- [ ] `window.open()` or `window.location.href` for internal links
- [ ] Types weakened with broad `any` to silence lint/type errors
- [ ] Unnecessary abstractions, helpers, or wrappers added for single-use logic
- [ ] Comments or docstrings added to unchanged code

## Validation

- Run checks in this order — fix lint before moving to types:

```bash
npm run lint
npm run test:types
```

- For broader or UI-impacting changes, also run:

```bash
npm run dev:build
npm run test
```

- If a check cannot be run, say why in the final response.
- Do not hide type or lint failures by weakening types broadly.
