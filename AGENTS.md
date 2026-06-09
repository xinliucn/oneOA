# 前端 AI 编辑准则 / Frontend AI Editing Rules

默认读取并遵循中文准则；英文版作为对应参考，方便非中文读者理解。若中英文表述存在差异，以中文为准。

Read and follow the Chinese rules by default. The English version is a reference for non-Chinese readers. If the two versions differ, the Chinese version takes precedence.

---

## 中文准则

本文件是本仓库给 AI 编程助手使用的前端工作准则。AI 在本项目中分析、修改、重构、排查问题或生成文档时，必须优先遵循本文；如果本文与当前代码冲突，先尊重当前代码的真实模式，再做最小必要调整。

### 核心戒律

- 以瞎猜接口为耻，以查询现有实现为荣。
- 以模糊执行为耻，以确认需求边界为荣。
- 以臆想业务为耻，以复用产品规则为荣。
- 以创造新模式为耻，以遵循本项目模式为荣。
- 以一次写完不验证为耻，以回头校验为荣。
- 以破坏移动端和桌面端布局为耻，以分别适配为荣。
- 以假装理解为耻，以诚实指出不确定为荣。
- 以顺手重构为耻，以保持改动聚焦为荣。

### 项目结构

- 这是一个 Nuxt 4 + TypeScript 项目，`src/` 是 Nuxt module，`playground/` 是实际运行的前端应用。
- 业务页面、业务组件、业务 composable 通常放在 `playground/`。
- module 级 i18n、runtime 行为和 Nuxt module 能力才放在 `src/`。
- 页面文件放在 `playground/pages/`；移动端页面放在 `playground/pages/mobile/`；桌面端页面通常放在 `playground/pages/desktop/` 或顶层路由文件如 `index.vue`。
- Composable 放在 `playground/composables/useXxx.ts`。
- 共享类型放在 `playground/types/`。
- 服务端工具放在 `playground/server/utils/`。
- 不编辑 `dist/`、`.nuxt/`、`node_modules/`、lock file 等生成物或依赖输出，除非任务明确要求。
- 不把真实 secret 写进仓库。环境差异必须来自 `runtimeConfig` 或环境变量。

### 编码风格

- Vue 文件使用 Composition API 和 `<script setup lang="ts">`。
- 遵守现有 ESLint 风格：2 空格、单引号、无分号、简洁 TypeScript 类型。
- `<script setup>` 顺序为：imports → props/emits → composables → state → computed → watchers → lifecycle → methods。
- 外部数据优先使用 `unknown` 加类型守卫；只在 legacy response shape 确实复杂时，才在 `playground/` 内小范围使用 `any`。
- 保持改动范围贴合请求，不做无关重构、大面积格式化或命名清理。
- 不给未修改代码补注释、docstring 或多余类型标注。

### 简单性原则

- KISS：优先使用简单、直观、可维护的实现。
- YAGNI：只实现当前明确需要的功能，不提前增加配置项、入口、按钮、状态或兼容层。
- DRY：重复的请求、归一化、校验、错误处理和 UI 片段优先复用已有 composable、组件或工具；轻微重复不急于抽象。
- SOLID：组件主要负责呈现和必要交互；跨组件业务逻辑放到 composable、server utility 或已有业务模块。
- 三行清晰重复往往好过一个过早抽象。只有当抽象被至少两个地方真实使用，并能减少复杂度时再提取。

### 工作流程

#### 1. 理解阶段

动手前必须先看真实代码，而不是猜。

必须检查：

- 当前页面、组件、composable、server API 的结构。
- 现有 API 调用方式、请求参数、响应 shape 和错误处理。
- 现有类型定义、归一化函数和 legacy 字段。
- 现有状态管理方式，尤其是 `useState` 命名空间。
- 路由、权限、i18n、toast、loading、empty、error 的本地模式。
- 涉及 auth、notification、push、network guard、同步或 IndexedDB 时，必须理解相关清理和生命周期。

禁止：

- 未查看调用方就假设字段存在。
- 未确认业务规则就写死判断或文案。
- 未查现有组件就新增重复组件。
- 未确认影响范围就修改共享模块。
- 用“应该是”“大概是”替代代码证据。

#### 2. 规划阶段

修改前应明确任务边界。

规划时说明：

- 本次要解决的问题。
- 预计修改哪些文件。
- 是否涉及接口、状态、路由、权限、i18n、样式、server API、auth、notification、push、network guard 或测试。
- 将复用哪些现有组件、composable、server utility、类型和样式模式。
- 哪些业务规则还不确定，是否需要用户确认。

执行原则：

- 小步修改。
- 优先复用。
- 保持局部。
- 不扩大需求。
- 不回滚用户已有改动，除非用户明确要求。

#### 3. 执行阶段

实现时必须贴合本项目现有前端形态。

要求：

- 前端代码调用本地 `/api/...`，不在组件或 composable 中直接请求远端后端 URL。
- 远端 Windmill 或内部后端调用放在 `playground/server/api` 代理。
- 优先使用 `playground/server/utils/windmillProxy.ts` 和 `proxyWindmill()`，保留 cookie、user agent、referer、client IP 和 `set-cookie` 转发行为。
- Server API 使用 `defineEventHandler`，防御性校验 request body，HTTP 失败使用 `createError`。
- 不硬编码 API base URL；使用 `runtimeConfig.public.apiBase` 等配置。
- 用户触发的异步操作必须处理 loading、disabled、success、empty、error 状态。
- 按钮重复点击要通过 loading/disabled 或明确的交互状态防止重复提交。
- 表单必须有明确校验，错误信息应可读。
- 组件渲染归一化后的数据，不在模板里深挖不稳定后端嵌套字段。

### 状态与 Composable

- 共享状态使用 `useState`，key 必须使用命名空间格式：`模块名:状态名`，例如 `auth:user`、`mobile:activeTab`、`notifications:list`。
- 页面局部状态保持在页面或组件内，不为了方便塞进全局 state。
- 派生状态优先使用 `computed`，不要重复存储。
- 跨组件逻辑放到 `playground/composables/useXxx.ts`。
- 异步 composable 在 UI 需要区分时，应拆出 `loading`、`syncing`、`checking`、`error`、`bootstrapped` 等状态。
- 请求归一化、缓存、轮询、重试等逻辑不要散落在组件里。

### SSR 与客户端 API

- 任何 `window`、`document`、`localStorage`、`indexedDB`、`navigator`、`Notification`、Service Worker、DOM visibility timer、媒体 API 都必须用 `import.meta.client` 防护。
- client-only plugin 逻辑应放在 `.client.ts` 文件中。
- 不假设浏览器 API 在 SSR、route middleware 或 module runtime setup 中存在。
- 定时器、事件监听和订阅必须在合适生命周期中清理。

### 国际化

- 应用体验中的静态 UI 文案必须使用 `useAppI18n()`。
- 新增或修改可见 label、action、empty state、error message、navigation 文案时，同步更新 `playground/i18n/config.ts` 的 `zh-CN`、`zh-TW` 和 `en`。
- locale 共享状态以 `superapp:locale` 为唯一来源，不新增第二套 locale state。
- 动态后端内容、标识符、日志和临时开发文本不需要 i18n。
- 文案含义不确定时先确认，不自行补业务剧情。

### 组件与图标

- Vue 组件文件名使用 PascalCase。
- props 和 emits 使用 `defineProps`、`withDefaults`、`defineEmits` 并保持类型明确。
- 昂贵或分支较多的展示逻辑放入 `computed`，避免模板里塞复杂表达式。
- 使用现有图标系统：`playground/components/icons/Icon.vue` 和 `playground/components/icons/svg/`。
- 新增图标时，添加 SVG component、注册到 `iconMap`，并更新 TypeScript icon-name union。
- 优先复用现有按钮、输入框、toast、loading、modal、empty/error 展示模式。
- 避免超过两层 prop drilling；需要跨层共享时使用 composable 或 provide/inject。
- 单个组件只做好一件事。若 UI、数据请求、复杂业务判断混在一起，应拆分到 child component 或 composable。

### 样式与布局

- 组件样式优先使用 `<style scoped>`。
- 保持当前产品气质：紧凑企业 UI、白色背景、浅边框、DCH 红色强调、移动端和桌面端分离布局。
- 不新增 CSS framework 或 utility library，除非用户明确批准。
- 不新增全局 CSS，除非确实是全应用行为。
- 文本必须在移动端和桌面端都能截断、换行或自适应，不允许溢出遮挡。
- 移动端页面保持固定高度 header/footer + 中间滚动内容的布局模式。
- desktop 与 mobile 不应互相污染样式；修改共享组件时要检查两个端的影响。
- 避免内联对象、数组或动态 style 在高频渲染区域造成不必要 re-render。

### 错误处理

- 共享 API 错误通常在 composable 中处理，组件主要消费暴露出的 `error` 状态。
- 用户触发失败必须显示 toast 或 inline error。
- 后台同步、轮询、缓存 hydration 可以安静失败，但应记录小而明确的日志并保持 UI 可用。
- 401/403 必须走 `useAuth()` 的 auth cleanup flow，不写临时 redirect。
- 网络错误要转换成可读信息，不把 raw exception object 直接显示给用户。
- 不用 `try/catch` 隐藏类型或逻辑 bug，只捕获能被有意义处理的错误。

### Auth、Notification 与 Push

- Auth 状态集中在 `useAuth()`，保持 `auth:user`、`auth:isLoggedIn`、`auth:lastCheckTime` 模式。
- Auth cleanup 不得留下 stale notification polling、push subscription 或 IndexedDB 数据。
- Notification 保持现有模型：global `useState`、IndexedDB cache、server sync、unread count、polling、`visibilitychange` refresh。
- 不破坏 `startPolling()` / `stopPolling()` 的 subscriber counting 或 module-level timers。
- Push 和 notification permission flow 必须 client-only，并在不支持时安全降级。

### Network Guard

- 打开内部链接必须使用 `useNetworkGuard().openGuardedUrl()`，不要直接 `window.open()` 或 `window.location.href`。
- 内部网络 host/probe 行为必须由 runtime config 驱动。
- development mode 可以跳过 probe，但 production behavior 必须继续保护内部 URL。

### 数据归一化

- 除非类型由本地代码保证，否则后端响应都按不稳定处理。
- 使用小型 helper，如 `isRecord`、`normalizeXxx`、`resolveXxx`、`formatXxx`，让数据到 UI 前变稳定。
- 仅当现有代码需要时保留 raw response 字段，例如 `raw`、`mainTable` 或 legacy payload fields。
- 不把 mock 数据当真实业务，不自行创造 response shape。
- 不在日志中输出 FormData、大数组、base64 图片、完整 API body 或敏感数据。

### 性能

- 初屏不需要的重组件使用 `defineAsyncComponent` 或 `<LazyXxx>` 懒加载。
- 高频变化数据如 scroll position、timer tick 不放在顶层 `useState`。
- 昂贵派生数据使用 `computed`。
- 分页或大列表使用 page/cursor 加载，不做 load-all-at-once。
- 图片、通知、同步记录等潜在大 payload 场景要控制内存和日志体积。

### 高风险区域

涉及以下区域时必须额外谨慎，先理解现有流程，再做最小修改：

- 登录、登出、token、401/403 cleanup。
- notification polling、push subscription、IndexedDB cache。
- 内部链接、network guard、runtime config。
- Windmill proxy、cookie 转发、set-cookie 处理。
- i18n runtime、locale state、Nuxt module 行为。
- 订单、审批、价格、用户资料、文件、图片上传等用户关键数据。
- mobile fixed header/footer layout 和 desktop shared component。

### 快速禁止清单

提交前确认没有以下问题：

- [ ] 在组件或 composable 中硬编码 API URL。
- [ ] 未用 `import.meta.client` 就访问浏览器 API。
- [ ] 新静态 UI 文案未走 `useAppI18n()`。
- [ ] 新文案未同步 `zh-CN`、`zh-TW`、`en`。
- [ ] 用户触发错误被静默吞掉。
- [ ] 401/403 cleanup 逻辑绕过 `useAuth()`。
- [ ] 内部链接直接使用 `window.open()` 或 `window.location.href`。
- [ ] 新增全局 CSS 影响无关页面。
- [ ] 为了消除类型错误扩大使用 `any`。
- [ ] 为单次使用逻辑新增不必要 helper、wrapper 或 abstraction。
- [ ] 改动生成物、依赖输出或 lock file。
- [ ] 顺手重构、格式化或回滚用户未要求的改动。

### 校验

- 修改完成后先检查需求是否满足、是否复用了现有能力、是否引入重复逻辑、是否破坏移动端或桌面端布局。
- 可执行时按顺序运行：

```bash
npm run lint
npm run test:types
```

- UI 影响较大或改动面较广时，再运行：

```bash
npm run dev:build
npm run test
```

- 如果检查无法运行，必须在最终回复中说明原因。
- 不通过扩大 `any`、隐藏错误、删除测试或绕过 lint 来制造“通过”。

---

## English Reference

This file defines frontend working rules for AI coding assistants in this repository. When analyzing, modifying, refactoring, debugging, or documenting this project, follow these rules first. If these rules conflict with the real codebase, follow the existing code patterns and make the smallest necessary change.

### Core Rules

- Do not guess API contracts; inspect existing implementations.
- Do not execute vague requirements; clarify the scope.
- Do not invent business logic; reuse confirmed product rules.
- Do not create new patterns casually; follow this project's patterns.
- Do not stop after writing code once; verify the result.
- Do not break mobile or desktop layouts; check both surfaces.
- Do not pretend to understand; state uncertainty honestly.
- Do not refactor casually; keep changes focused.

### Project Shape

- This is a Nuxt 4 + TypeScript project. `src/` contains the Nuxt module, and `playground/` contains the runnable frontend app.
- Business pages, business components, and business composables usually belong in `playground/`.
- Module-level i18n, runtime behavior, and Nuxt module features belong in `src/`.
- Page files go in `playground/pages/`. Mobile pages live under `playground/pages/mobile/`. Desktop pages usually live under `playground/pages/desktop/` or top-level route files such as `index.vue`.
- Composables go in `playground/composables/useXxx.ts`.
- Shared types go in `playground/types/`.
- Server utilities go in `playground/server/utils/`.
- Do not edit generated or dependency output such as `dist/`, `.nuxt/`, `node_modules/`, or lock files unless the task explicitly requires it.
- Keep real secrets out of the repo. Environment-specific values must come from `runtimeConfig` or environment variables.

### Code Style

- Use Vue Composition API with `<script setup lang="ts">`.
- Follow the existing ESLint style: 2 spaces, single quotes, no semicolons, and concise TypeScript types.
- Order `<script setup>` blocks as: imports → props/emits → composables → state → computed → watchers → lifecycle → methods.
- Prefer `unknown` plus type guards for external data. Use `any` only in small legacy-response areas where it is genuinely needed, mostly inside `playground/`.
- Keep changes scoped to the requested behavior. Do not do unrelated refactors, broad formatting, or naming cleanup.
- Do not add comments, docstrings, or extra type annotations to code you did not change.

### Simplicity

- KISS: prefer simple, direct, maintainable implementations.
- YAGNI: implement only what is clearly needed now. Do not add speculative config, entries, buttons, states, or compatibility layers.
- DRY: reuse existing composables, components, or utilities for repeated requests, normalization, validation, error handling, and UI snippets. Do not abstract tiny differences too early.
- SOLID: components should mainly handle presentation and necessary interaction. Cross-component business logic belongs in composables, server utilities, or existing business modules.
- Three clear repeated lines are often better than a premature abstraction. Extract only when at least two real call sites benefit and complexity is reduced.

### Workflow

#### 1. Understand

Inspect real code before editing.

Check:

- The current page, component, composable, and server API structure.
- Existing API call patterns, request parameters, response shapes, and error handling.
- Existing type definitions, normalization helpers, and legacy fields.
- Existing state management, especially `useState` namespaces.
- Local patterns for routes, permissions, i18n, toast, loading, empty, and error states.
- For auth, notification, push, network guard, sync, or IndexedDB work, understand cleanup and lifecycle behavior first.

Do not:

- Assume fields exist before checking call sites.
- Hardcode business rules or copy before confirmation.
- Add duplicate components before searching existing components.
- Modify shared modules before confirming impact.
- Use "probably" or "should be" as a substitute for code evidence.

#### 2. Plan

Define the task boundary before editing.

State:

- What problem this change solves.
- Which files are expected to change.
- Whether the change touches APIs, state, routes, permissions, i18n, styles, server APIs, auth, notifications, push, network guard, or tests.
- Which existing components, composables, server utilities, types, and style patterns will be reused.
- Which business rules remain uncertain and whether user confirmation is needed.

Execution principles:

- Make small changes.
- Reuse first.
- Stay local.
- Do not expand scope.
- Do not revert user changes unless explicitly asked.

#### 3. Implement

Fit the existing frontend shape of this project.

Requirements:

- Frontend code should call local `/api/...` endpoints, not remote backend URLs directly from components or composables.
- Remote Windmill or internal backend calls should be proxied from `playground/server/api`.
- Prefer `playground/server/utils/windmillProxy.ts` and `proxyWindmill()` so cookies, user agent, referer, client IP, and `set-cookie` forwarding keep working.
- Server API handlers should use `defineEventHandler`, defensively validate request bodies, and throw `createError` for HTTP failures.
- Do not hardcode API base URLs. Use `runtimeConfig.public.apiBase` and related config.
- User-triggered async actions must handle loading, disabled, success, empty, and error states.
- Prevent duplicate submissions with loading/disabled or clear interaction state.
- Forms must have explicit validation and readable error messages.
- Components should render normalized data instead of digging through unstable nested backend fields in templates.

### State And Composables

- Shared state must use `useState` with namespaced keys such as `auth:user`, `mobile:activeTab`, and `notifications:list`.
- Keep page-local state in the page or component. Do not put temporary UI state into global state for convenience.
- Prefer `computed` for derived state. Do not store duplicate derived values.
- Cross-component logic belongs in `playground/composables/useXxx.ts`.
- Async composables should expose separate states such as `loading`, `syncing`, `checking`, `error`, or `bootstrapped` when the UI needs to distinguish phases.
- Do not scatter request normalization, caching, polling, or retry behavior across components.

### SSR And Client APIs

- Any use of `window`, `document`, `localStorage`, `indexedDB`, `navigator`, `Notification`, Service Worker, DOM visibility timers, or media APIs must be guarded with `import.meta.client`.
- Client-only plugin logic should live in `.client.ts` files.
- Do not assume browser APIs exist during SSR, route middleware, or module runtime setup.
- Timers, event listeners, and subscriptions must be cleaned up in the right lifecycle.

### Internationalization

- Static UI text that is part of the app experience must use `useAppI18n()`.
- When adding or changing visible labels, actions, empty states, error messages, or navigation copy, update `zh-CN`, `zh-TW`, and `en` in `playground/i18n/config.ts`.
- The shared locale state `superapp:locale` is the single source of truth. Do not create a second locale state.
- Dynamic backend content, identifiers, logs, and temporary developer-only text do not need i18n.
- If copy meaning is uncertain, ask instead of inventing business wording.

### Components And Icons

- Vue component filenames should use PascalCase.
- Props and emits should be typed with `defineProps`, `withDefaults`, and `defineEmits`.
- Put expensive or branching display logic in `computed` helpers instead of complex template expressions.
- Use the existing icon system in `playground/components/icons/Icon.vue` and `playground/components/icons/svg/`.
- When adding an icon, add the SVG component, register it in `iconMap`, and update the TypeScript icon-name union.
- Prefer existing button, input, toast, loading, modal, empty, and error patterns.
- Avoid prop drilling beyond two levels. Use composables or provide/inject for cross-level sharing.
- A component should do one thing well. If UI, data requests, and complex business checks are mixed together, split them into a child component or composable.

### Styling And Layout

- Prefer `<style scoped>` for component styles.
- Keep the product feel: compact enterprise UI, white backgrounds, light borders, DCH red accents, and separate mobile and desktop layouts.
- Do not add CSS frameworks or utility libraries without explicit approval.
- Do not add global CSS unless the behavior is truly app-wide.
- Text must truncate, wrap, or adapt on both mobile and desktop. It must not overflow or overlap other content.
- Mobile pages should preserve the fixed-height header/footer with scrollable middle content pattern.
- Desktop and mobile styles should not leak into each other. Check both surfaces when editing shared components.
- Avoid inline objects, arrays, or dynamic styles in hot render paths when they can cause unnecessary re-renders.

### Error Handling

- Shared API errors should usually be handled in composables. Components should mainly consume exposed `error` state.
- User-triggered failures must show a toast or inline error.
- Background sync, polling, and cache hydration may fail quietly, but should log small, clear messages and keep the UI usable.
- 401/403 must go through the auth cleanup flow in `useAuth()`, not ad-hoc redirects.
- Network errors should be converted to readable messages, not displayed as raw exception objects.
- Do not use `try/catch` to hide type or logic bugs. Only catch errors you can meaningfully handle.

### Auth, Notification, And Push

- Keep auth state centered in `useAuth()` with `auth:user`, `auth:isLoggedIn`, and `auth:lastCheckTime`.
- Auth cleanup must not leave stale notification polling, push subscriptions, or IndexedDB data behind.
- Preserve the notification model: global `useState`, IndexedDB cache, server sync, unread count, polling, and `visibilitychange` refresh.
- Do not break `startPolling()` / `stopPolling()` subscriber counting or module-level timers.
- Push and notification permission flows must stay client-only and degrade safely when unsupported.

### Network Guard

- For internal links, use `useNetworkGuard().openGuardedUrl()` instead of direct `window.open()` or `window.location.href`.
- Internal network host/probe behavior must be driven by runtime config.
- Development mode may skip probes, but production behavior must still protect internal URLs.

### Data Normalization

- Treat backend responses as unstable unless the type is locally guaranteed.
- Use small helpers such as `isRecord`, `normalizeXxx`, `resolveXxx`, and `formatXxx` before data reaches the UI.
- Preserve raw response fields only when existing code needs them, such as `raw`, `mainTable`, or legacy payload fields.
- Do not treat mock data as real business data. Do not invent response shapes.
- Do not log FormData, large arrays, base64 images, full API bodies, or sensitive data.

### Performance

- Lazy-load heavy components with `defineAsyncComponent` or `<LazyXxx>` when they are not needed on initial render.
- Avoid placing frequently changing data such as scroll position or timer ticks in top-level `useState`.
- Keep expensive derived data in `computed`.
- Paginated or large lists should use page/cursor loading, not load-all-at-once approaches.
- Control memory and log size for images, notifications, sync records, and other large payload areas.

### High-Risk Areas

Be extra careful in these areas. Understand the existing flow first and make the smallest change:

- Login, logout, token, and 401/403 cleanup.
- Notification polling, push subscriptions, and IndexedDB cache.
- Internal links, network guard, and runtime config.
- Windmill proxy, cookie forwarding, and `set-cookie` handling.
- i18n runtime, locale state, and Nuxt module behavior.
- Orders, approvals, prices, user profiles, files, image uploads, and other user-critical data.
- Mobile fixed header/footer layout and desktop shared components.

### Quick Do-Not Checklist

Before submitting, verify none of these apply:

- [ ] Hardcoded API URLs in components or composables.
- [ ] Browser APIs used without `import.meta.client`.
- [ ] New static UI text not using `useAppI18n()`.
- [ ] New copy not synced across `zh-CN`, `zh-TW`, and `en`.
- [ ] User-triggered errors swallowed silently.
- [ ] 401/403 cleanup logic bypassing `useAuth()`.
- [ ] Internal links using direct `window.open()` or `window.location.href`.
- [ ] New global CSS affecting unrelated pages.
- [ ] Broad `any` usage added just to silence type errors.
- [ ] Unnecessary helper, wrapper, or abstraction for one-time logic.
- [ ] Generated output, dependency output, or lock files changed.
- [ ] Unrequested refactors, formatting, or reverts of user changes.

### Validation

- After changes, check that the requirement is met, existing capabilities are reused, duplicate logic is avoided, and mobile/desktop layouts are not broken.
- Run checks in this order when possible:

```bash
npm run lint
npm run test:types
```

- For broad or UI-impacting changes, also run:

```bash
npm run dev:build
npm run test
```

- If a check cannot be run, state why in the final response.
- Do not manufacture a passing result by broadening `any`, hiding errors, deleting tests, or bypassing lint.
