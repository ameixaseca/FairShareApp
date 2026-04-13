# Implementation Plan: React SPA Frontend

**Branch**: `003-react-frontend` | **Date**: 2026-04-12 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/003-react-frontend/spec.md`

## Summary

Replace the existing Blazor Web frontend with a React + TypeScript SPA that delivers the complete FairShareApp user experience — landing page, registration/login, group management, expense tracking, balance dashboard, settlements, and notification preferences. The React build artefacts are served directly by the existing ASP.NET Core API server via static file middleware, eliminating any separate frontend server. The backend gains authentication endpoints (`/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`) and two missing group query endpoints (`GET /groups`, `GET /groups/:groupId`) required by the SPA. The Blazor project and its tests are removed from the solution.

## Technical Context

**Language/Version**: TypeScript 5 (strict) + C# .NET 9 (backend, existing)  
**Primary Dependencies**:

- Frontend: React 18, Vite 5, React Router v6, TanStack Query v5, Axios v1, React Hook Form v7, Zod v3, Tailwind CSS v3, @opentelemetry/\* (tracing), pino (logging), @testing-library/react (component tests), Playwright (E2E tests)
- Backend (additions): static file middleware, SPA fallback, cookie authentication for JWT  
  **Storage**: No browser persistence of financial data; httpOnly JWT cookie (server-set); TanStack Query in-memory cache only  
  **Testing**:
  - Component tests: Vitest + React Testing Library (user-behaviour assertions, form validation, button handlers)
  - Responsive E2E: Playwright (360px/768px/1200px viewports, touch targets, no overflow, screenshot comparison)
  - Backend tests: dotnet test (existing)
    **Observability**:
  - Distributed tracing: OpenTelemetry SDK + Jaeger/OTLP exporter; auto-instrumentation for Fetch/Axios
  - Metrics: Prometheus client for route transition latency, API call duration, component render time
  - Logging: Structured JSON via pino with request context (userId, groupId, requestId), error stack traces, no sensitive data
  - Sampling: 100% dev, 10% prod
    **Target Platform**: Modern browsers (Chrome/Firefox/Safari/Edge); mobile viewport 360px+; served from ASP.NET Core  
    **Project Type**: Web SPA (frontend) + Web API (backend, existing)  
    **Performance Goals**: Initial load ≤ 3s from same server; route transitions < 500ms; component render < 100ms  
    **Constraints**: React build output must be in `backend/src/Interface/Api/wwwroot/`; SPA fallback for all non-API routes; no dual Blazor/React serving; all observability exports must not block user interactions  
    **Scale/Scope**: Groups up to 20 members; standard single-tenant web app; test coverage ≥80% via Istanbul/v8

## Constitution Check

_GATE: Must pass before implementation. Re-checked after design._

**Code Clarity Validation**:

- [x] All names (classes, methods, variables) reveal intent and follow domain vocabulary — enforced via TypeScript strict mode + naming conventions in research.md
- [x] No clever/obscure solutions without explicit justification in Complexity Tracking
- [x] Public interfaces are explicit about behavior and side effects — all API types documented in data-model.md

**SOLID Compliance Validation**:

- [x] Each class/module has single responsibility — feature-slice structure: one hook/service per domain concern
- [x] Extensions planned without modifying existing tested code — Axios interceptors wrap without changing service call sites
- [x] Dependencies are on abstractions (interfaces), not concrete implementations — API service interfaces typed; React context abstracts auth state
- [x] No forced dependencies on unused interface methods — each feature uses only the API methods its page requires

**Test-First Validation**:

- [x] Test plan included in specification before any implementation — acceptance scenarios in spec.md, test structure in quickstart.md
- [x] Tests are written for acceptance criteria before implementation begins — enforced by task order in tasks.md
- [x] Test structure follows AAA (Arrange, Act, Assert) pattern — Vitest + RTL enforces this naturally
- [x] Integration tests planned for external boundaries (API, database, file system) — MSW mocks for API boundary; Playwright for full-stack E2E

**Security Validation**:

- [x] No secrets, tokens, or credentials in any committed files — JWT in httpOnly cookie (server-set); `.env` files in `.gitignore`
- [x] All external input validation planned — Zod schemas for all form inputs; server-side validation remains authoritative
- [x] Infrastructure dependencies have security review — auth cookie: HttpOnly, Secure, SameSite=Strict; no credential in localStorage

**Architecture Validation**:

- [x] Clear separation: pages (Interface) → feature hooks (Application) → API services (Infrastructure) — matches React feature-slice architecture
- [x] Domain/business logic has no infrastructure dependencies — Zod validation schemas are pure; no Axios in validation layer
- [x] Shared types defined to prevent duplication — `data-model.md` TypeScript types are single source of truth

## Project Structure

### Documentation (this feature)

```text
specs/003-react-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions on tooling, auth, static serving
├── data-model.md        # Phase 1 — TypeScript types for all API entities
├── quickstart.md        # Phase 1 — dev setup and build instructions
├── contracts/
│   └── ui-contract.md   # Phase 1 — routes, page responsibilities, design tokens, API additions
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/                                      # NEW — React SPA project
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                               # App entry point
│   ├── App.tsx                                # Root with QueryClientProvider + AuthProvider
│   ├── router.tsx                             # createBrowserRouter — all routes
│   ├── contexts/
│   │   └── AuthContext.tsx                    # AuthUser state, session restore via /auth/me
│   ├── services/
│   │   └── api/
│   │       ├── axios.ts                       # Axios instance with interceptors
│   │       ├── authApi.ts                     # register, login, logout, me
│   │       ├── groupsApi.ts                   # list, get, create
│   │       ├── invitesApi.ts                  # create, list, revoke
│   │       ├── expensesApi.ts                 # create, update, delete
│   │       ├── settlementsApi.ts              # create
│   │       ├── balancesApi.ts                 # getBalances
│   │       ├── ledgerApi.ts                   # getLedger
│   │       └── notificationsApi.ts            # updatePreferences
│   ├── services/observability/
│   │   ├── telemetry.ts                       # OTEL SDK initialization + exporters
│   │   ├── instrumentations.ts                # Auto-instrumentation setup
│   │   ├── tracing.ts                         # Manual span creation helpers
│   │   ├── metrics.ts                         # Prometheus metrics registration
│   │   └── logging.ts                         # pino logger instance + context middleware
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── LoginForm.tsx
│   │   │   └── hooks/
│   │   │       ├── useRegister.ts
│   │   │       └── useLogin.ts
│   │   ├── groups/
│   │   │   ├── components/
│   │   │   │   ├── GroupCard.tsx
│   │   │   │   ├── CreateGroupForm.tsx
│   │   │   │   └── MemberList.tsx
│   │   │   └── hooks/
│   │   │       ├── useGroups.ts
│   │   │       ├── useGroup.ts
│   │   │       └── useCreateGroup.ts
│   │   ├── expenses/
│   │   │   ├── components/
│   │   │   │   ├── ExpenseCard.tsx
│   │   │   │   ├── CreateExpenseForm.tsx
│   │   │   │   └── EditExpenseForm.tsx
│   │   │   └── hooks/
│   │   │       ├── useCreateExpense.ts
│   │   │       └── useUpdateExpense.ts
│   │   ├── balances/
│   │   │   ├── components/
│   │   │   │   ├── BalanceCard.tsx
│   │   │   │   └── ObligationRow.tsx
│   │   │   └── hooks/
│   │   │       └── useBalances.ts
│   │   ├── settlements/
│   │   │   ├── components/
│   │   │   │   └── CreateSettlementForm.tsx
│   │   │   └── hooks/
│   │   │       └── useCreateSettlement.ts
│   │   ├── invites/
│   │   │   ├── components/
│   │   │   │   ├── InviteTable.tsx
│   │   │   │   └── CreateInviteForm.tsx
│   │   │   └── hooks/
│   │   │       ├── useInvites.ts
│   │   │       └── useCreateInvite.ts
│   │   └── notifications/
│   │       ├── components/
│   │       │   └── NotificationChannelToggle.tsx
│   │       └── hooks/
│   │           └── useUpdateNotificationPreferences.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── GroupsListPage.tsx
│   │   ├── CreateGroupPage.tsx
│   │   ├── GroupDashboardPage.tsx
│   │   ├── ExpenseListPage.tsx
│   │   ├── CreateExpensePage.tsx
│   │   ├── EditExpensePage.tsx
│   │   ├── MembersPage.tsx
│   │   ├── InvitesPage.tsx
│   │   ├── CreateSettlementPage.tsx
│   │   ├── LedgerHistoryPage.tsx
│   │   ├── NotificationPreferencesPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx                  # Authenticated layout (nav + sidebar)
│   │   │   ├── PublicLayout.tsx               # Unauthenticated layout (minimal header)
│   │   │   └── NavigationBar.tsx
│   │   ├── guards/
│   │   │   ├── RequireAuth.tsx                # Redirects to /login if not authenticated
│   │   │   └── RedirectIfAuth.tsx             # Redirects to /groups if authenticated
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── AmountDisplay.tsx              # Colour-coded financial amount
│   │       ├── LoadingSkeleton.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBanner.tsx
│   ├── utils/
│   │   ├── currency.ts                        # Format amounts with currency symbol
│   │   ├── date.ts                            # Format ISO dates for display
│   │   └── idempotency.ts                     # Generate UUID v4 requestIds
│   └── styles/
│       ├── globals.css                        # Tailwind base + CSS variable tokens
│       └── tailwind.config.ts                 # Design token theme extension
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── tests/
    ├── unit/                                  # Vitest — hooks, utils, validation
    │   ├── setup.ts                           # Test environment setup, mocks
    │   ├── currency.test.ts
    │   ├── date.test.ts
    │   └── idempotency.test.ts
    ├── components/                            # Vitest + RTL — component behaviour
    │   ├── buttons.test.tsx
    │   ├── inputs.test.tsx
    │   ├── forms/
    │   │   ├── CreateExpenseForm.test.tsx
    │   │   ├── LoginForm.test.tsx
    │   │   └── RegisterForm.test.tsx
    │   ├── layout/
    │   │   ├── AppLayout.test.tsx
    │   │   └── NavigationBar.test.tsx
    │   └── fixtures/
    │       ├── mockData.ts
    │       └── mockHandlers.ts                # MSW request handlers
    └── e2e/                                   # Playwright — full SPA flows
        ├── auth.spec.ts
        ├── groups.spec.ts
        ├── expenses.spec.ts
        ├── responsive/                        # Viewport-specific tests
        │   ├── mobile.spec.ts
        │   ├── tablet.spec.ts
        │   └── desktop.spec.ts
        ├── fixtures/
        │   ├── auth.fixture.ts
        │   └── group-data.fixture.ts
        └── visual/                            # Screenshots for regression tests
            ├── groups-360px.png
            ├── groups-768px.png
            └── groups-1200px.png

backend/
└── src/
    └── Interface/
        └── Api/
            ├── Program.cs                     # MODIFIED: UseStaticFiles + MapFallback
            ├── Controllers/
            │   └── AuthController.cs          # NEW: register, login, logout, me
            └── wwwroot/                       # GENERATED: Vite build output (git-ignored)

# REMOVED from solution:
# backend/src/Interface/Web/                  (Blazor project)
# backend/tests/web/                          (Blazor test project)
```

## Complexity Tracking

> No constitution violations require justification for this feature.
