# Tasks: React SPA Frontend — FairShareApp

**Feature**: 003-react-frontend  
**Branch**: `003-react-frontend`  
**Date**: 2026-04-12  
**MVP Scope**: Complete Phase 1–4 for first deployable increment (auth + groups)

**Input**: Specification documents

- [spec.md](spec.md) — 5 user stories (P1, P1, P1, P2, P3)
- [plan.md](plan.md) — tech stack, project structure, architecture
- [data-model.md](data-model.md) — 119 TypeScript types
- [contracts/ui-contract.md](contracts/ui-contract.md) — 15 routes, design tokens
- [research.md](research.md) — decisions on tooling, auth, observability
- [quickstart.md](quickstart.md) — dev setup, build, test commands

**Tests**: Component (Vitest + RTL) and E2E (Playwright) test tasks included per user story (test-first approach)

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US0, US1, US2, US3, US4)
- **File paths**: Exact locations per plan.md project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic structure

- [x] T001 Initialize `frontend/` React SPA project with TypeScript, Vite, and toolchain
  - Initialize npm project: `npm init vite@latest frontend -- --template react-ts`
  - Install primary dependencies: React 18, React Router v6, TanStack Query v5, Axios v1, React Hook Form v7, Zod v3, Tailwind CSS v3
  - Install dev dependencies: Vitest, @testing-library/react, Playwright, TypeScript, ESLint, Prettier

- [x] T002 Setup TypeScript configuration with strict mode
  - Create `frontend/tsconfig.json` with `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`
  - Create `frontend/tsconfig.node.json` for Vite
  - Verify all `.ts` and `.tsx` files compile without errors

- [x] T003 [P] Configure Vite build to output to backend wwwroot
  - Update `frontend/vite.config.ts`: set `build.outDir` to `../backend/src/Interface/Api/wwwroot`
  - Configure SPA fallback: `build.rollupOptions.output.dir` preserves `index.html` at root
  - Add dev server proxy: `server.proxy['/api']` → backend API

- [x] T004 [P] Configure ESLint and Prettier
  - Create `.eslintrc.json` with React plugin, hooks rules, no console logs
  - Create `.prettierrc` (2-space indent, single quotes)
  - Add pre-commit hook: `npm run lint && npm run type-check && npm test`

- [x] T005 [P] Setup Vitest and React Testing Library
  - Create `frontend/vitest.config.ts` with jsdom environment
  - Create `frontend/tests/setup.ts`: MSW server, mock API handlers, RTL configuration
  - Verify `npm test` runs with coverage thresholds: 80% statements/lines, 75% branches

- [x] T006 [P] Setup Playwright E2E testing
  - Create `frontend/playwright.config.ts` with 3 devices (360px mobile, 768px tablet, 1200px desktop)
  - Create `frontend/tests/e2e/fixtures/auth.fixture.ts`: login/logout helpers
  - Create `frontend/tests/e2e/fixtures/group-data.fixture.ts`: test data builders

- [x] T007 [P] Setup Tailwind CSS with financial design tokens
  - Create `frontend/tailwind.config.ts` with theme extensions:
    - Colors: primary navy `#0F2B5B`, accent emerald `#059669`, danger red `#DC2626`, neutral greys
    - Typography: Inter font family, predefined sizes (xs–2xl)
    - Spacing: standard scale (0.25rem increments)
  - Create `frontend/src/styles/globals.css` with Tailwind directives + CSS variables for tokens
  - Verify Tailwind builds without warnings

- [x] T008 [P] Setup observability infrastructure
  - Create `frontend/src/services/observability/telemetry.ts`: OpenTelemetry SDK initialization
  - Create `frontend/src/services/observability/instrumentations.ts`: auto-instrumentation for Fetch/Axios
  - Create `frontend/src/services/observability/tracing.ts`: manual span creation helpers (navigation, mutations)
  - Create `frontend/src/services/observability/metrics.ts`: Prometheus client registration
  - Create `frontend/src/services/observability/logging.ts`: pino logger with context middleware (userId, groupId, requestId)
  - Add `.env.development`: `VITE_OTEL_ENABLED=true`, `VITE_OTEL_SAMPLE_RATE=1.0`

- [x] T009 Create project documentation structure
  - Create `frontend/README.md` with dev setup, build, test commands (link to quickstart.md)
  - Create `.gitignore` entries: `node_modules/`, `dist/`, `.env.local`, `coverage/`, `playwright-report/`
  - Create `frontend/package.json` scripts: `dev`, `build`, `preview`, `test`, `test:watch`, `test:coverage`, `test:e2e`, `lint`, `lint:fix`, `type-check`

**Checkpoint**: Frontend project initialized, toolchain ready, observability infrastructure in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before ANY user story implementation

⚠️ **CRITICAL**: All tasks in this phase must be complete before proceeding to user stories

- [x] T010 Create core TypeScript types (from data-model.md)
  - Create `frontend/src/types/auth.ts`: AuthUser, RegisterRequest, LoginRequest, MeResponse
  - Create `frontend/src/types/groups.ts`: GroupResponse, GroupMember, CreateGroupRequest
  - Create `frontend/src/types/invites.ts`: InviteResponse, CreateInviteRequest
  - Create `frontend/src/types/expenses.ts`: ExpenseResponse, CreateExpenseRequest, UpdateExpenseRequest
  - Create `frontend/src/types/settlements.ts`: CreateSettlementRequest, SettlementResponse
  - Create `frontend/src/types/balances.ts`: BalanceResponse, ObligationResponse
  - Create `frontend/src/types/ledger.ts`: LedgerEntryResponse, LedgerListResponse
  - Create `frontend/src/types/notifications.ts`: NotificationPrefsResponse, UpdatePrefsRequest

- [x] T011 [P] Setup Axios HTTP client with interceptors
  - Create `frontend/src/services/api/axios.ts`:
    - Configure base URL: `VITE_API_BASE_URL` (dev: `https://localhost:5001`, prod: window.location.origin)
    - Add request interceptor: inject JWT from cookie, add requestId header
    - Add response interceptor: error normalization, automatic token refresh on 401
    - Add OTEL tracing for all requests (auto-instrumentation)

- [x] T012 [P] Create API service modules (partial signatures, fully implemented in user story phases)
  - Create `frontend/src/services/api/authApi.ts`: register(), login(), logout(), me()
  - Create `frontend/src/services/api/groupsApi.ts`: listGroups(), getGroup(), createGroup()
  - Create `frontend/src/services/api/invitesApi.ts`: listInvites(), createInvite(), revokeInvite()
  - Create `frontend/src/services/api/expensesApi.ts`: createExpense(), updateExpense(), deleteExpense(), listExpenses()
  - Create `frontend/src/services/api/settlementsApi.ts`: createSettlement(), listSettlements()
  - Create `frontend/src/services/api/balancesApi.ts`: getBalances()
  - Create `frontend/src/services/api/ledgerApi.ts`: getLedger()
  - Create `frontend/src/services/api/notificationsApi.ts`: updateNotificationPreferences()

- [x] T013 Create AuthContext for session state management
  - Create `frontend/src/contexts/AuthContext.tsx`:
    - AuthUser state (id, name, email) or null
    - isLoading flag for session restore
    - login(email, password), logout(), register(name, email, password) methods
    - Session restore on mount: call GET /auth/me, error → logged out
    - Provider wraps `<App>` in main.tsx
  - Store AuthContext in React Context API (no external state lib needed)

- [x] T014 Create route structure with guards
  - Create `frontend/src/router.tsx`:
    - 15 routes from ui-contract.md:
      - Public: `/`, `/register`, `/login`
      - Private (requires auth): `/groups`, `/groups/:groupId`, `/groups/new`, `/expenses`, `/expenses/new`, `/expenses/:expenseId/edit`, `/balances`, `/settlements/new`, `/history`, `/members`, `/invites`, `/preferences`, `*`
  - Create `frontend/src/components/guards/RequireAuth.tsx`: redirect to `/login` if not authenticated
  - Create `frontend/src/components/guards/RedirectIfAuth.tsx`: redirect to `/groups` if authenticated
  - Apply guards to routes: private routes wrapped in RequireAuth, public auth routes wrapped in RedirectIfAuth

- [x] T015 Create layout components (AppLayout for authenticated, PublicLayout for public)
  - Create `frontend/src/components/layout/PublicLayout.tsx`: minimal header (logo, CTAs to register/login)
  - Create `frontend/src/components/layout/AppLayout.tsx`: authenticated layout with sidebar/nav, user menu, group selector
  - Create `frontend/src/components/layout/NavigationBar.tsx`: responsive nav (sidebar on desktop, hamburger on mobile)
  - Responsive design: desktop (sidebar + main), tablet (slide drawer), mobile (bottom nav)

- [x] T016 [P] Create shared UI component library
  - Create `frontend/src/components/ui/Button.tsx`: variants (primary, secondary, danger), sizes, loading state
  - Create `frontend/src/components/ui/Input.tsx`: text/email/password types, validation error display
  - Create `frontend/src/components/ui/Card.tsx`: container with padding, border, shadow
  - Create `frontend/src/components/ui/Badge.tsx`: role badges (Owner, Admin, Member), status badges (Active, Inactive)
  - Create `frontend/src/components/ui/AmountDisplay.tsx`: format and colour-code amounts (green: positive, red: negative)
  - Create `frontend/src/components/ui/LoadingSkeleton.tsx`: placeholder while data loads
  - Create `frontend/src/components/ui/EmptyState.tsx`: illustrated message for empty lists
  - Create `frontend/src/components/ui/ErrorBanner.tsx`: error message display with icon + dismiss

- [x] T017 [P] Create utility functions
  - Create `frontend/src/utils/currency.ts`: formatAmount(number, currency) → formatted string with symbol
  - Create `frontend/src/utils/date.ts`: formatDate(iso8601) → localized string, formatTime(iso8601) → HH:MM
  - Create `frontend/src/utils/idempotency.ts`: generateRequestId() → UUID v4, used in mutation requests

- [x] T018 Create root React app with providers
  - Create `frontend/src/App.tsx`:
    - QueryClientProvider (TanStack Query) wraps AuthProvider wraps RouterProvider
    - Initialize OTEL telemetry on mount
    - Error boundary for top-level error handling
  - Create `frontend/src/main.tsx`: React.createRoot, mount App to #app
  - Create `frontend/index.html`: web standards template with Vite script tag

- [x] T019 [P] Setup MSW (Mock Service Worker) for testing
  - Create `frontend/tests/fixtures/mockHandlers.ts`: MSW request handlers for all API endpoints (auth, groups, expenses, etc.)
  - Create `frontend/tests/setup.ts`: MSW server initialization, setupServer(), afterEach(server.resetHandlers())
  - Create `frontend/tests/fixtures/mockData.ts`: TestUser, TestGroup, TestExpense builders for consistent test data

- [x] T020 Create stub pages for all routes
  - Create empty page components at `frontend/src/pages/`:
    - `LandingPage.tsx` (public)
    - `RegisterPage.tsx` (public)
    - `LoginPage.tsx` (public)
    - `GroupsListPage.tsx` (private)
    - `CreateGroupPage.tsx` (private)
    - `GroupDashboardPage.tsx` (private)
    - `ExpenseListPage.tsx` (private)
    - `CreateExpensePage.tsx` (private)
    - `EditExpensePage.tsx` (private)
    - `MembersPage.tsx` (private)
    - `InvitesPage.tsx` (private)
    - `CreateSettlementPage.tsx` (private)
    - `LedgerHistoryPage.tsx` (private)
    - `NotificationPreferencesPage.tsx` (private)
    - `NotFoundPage.tsx` (404)

- [x] T021 Wire up backend for SPA serving
  - Create `backend/src/Interface/Api/Controllers/AuthController.cs`:
    - POST /auth/register — validate, create user, return AuthUser
    - POST /auth/login — authenticate, set JWT in httpOnly cookie (HttpOnly, Secure, SameSite=Strict), return AuthUser
    - POST /auth/logout — clear cookie, return 200
    - GET /auth/me — return authenticated user or 401
  - Modify `backend/src/Interface/Api/Program.cs`:
    - Add `app.UseStaticFiles()` to serve wwwroot/
    - Add final route: `app.MapFallbackToFile("index.html")` for SPA fallback (all non-API routes → index.html)
    - Ensure route order: API routes first, static files second, fallback last

- [x] T022 Create backend group query endpoints
  - Add to `backend/src/Interface/Api/Controllers/GroupsController.cs`:
    - GET /groups — return list of groups for authenticated user
    - GET /groups/:groupId — return group details with members (only if user is member)
  - Ensure existing endpoints (create, delete, etc.) remain functional

**Checkpoint**: Foundational infrastructure complete — all user stories can now proceed independently

---

## Phase 3: User Story 0 — Discover Product & Create Account (Priority: P1) 🎯 Public Access

**Goal**: Unauthenticated user discovers the product via landing page, creates account, logs in, and enters the functional area

**Independent Test**: Visitor accesses app root → sees landing page with value prop → clicks "Create Account" → completes registration → logs in with created credentials → redirected to groups list

### Tests for User Story 0 (test-first approach)

- [x] T023 [P] [US0] Acceptance scenario tests (Playwright E2E) in `frontend/tests/e2e/auth.spec.ts`
  - Test 1: Unauthenticated user → landing page shows value prop and "Create Account" button
  - Test 2: "Create Account" click → register form (name, email, password fields)
  - Test 3: Register with valid data → success message and redirect to login
  - Test 4: Register with duplicate email → error message (generic, no user enumeration)
  - Test 5: Login form → email + password inputs and "Login" button
  - Test 6: Login with correct credentials → redirect to /groups
  - Test 7: Login with incorrect credentials → error message (generic)
  - Test 8: Authenticated user → tries to access `/login` → redirect to `/groups`
  - Test 9: Authenticated user → tries to access `/` → redirect to `/groups`
  - Tests must pass on all 3 viewports (360px, 768px, 1200px)

- [x] T024 [P] [US0] Component tests (Vitest + RTL) in `frontend/tests/components/forms/LoginForm.test.tsx`
  - Email input accepts valid email format
  - Password input is masked (type="password")
  - Empty form disables submit button
  - Valid form enables submit button
  - On submit, calls onSubmit callback with email, password
  - Form shows error message on error prop
  - Password field has show/hide toggle

- [x] T025 [P] [US0] Component tests (Vitest + RTL) in `frontend/tests/components/forms/RegisterForm.test.tsx`
  - Name input requires min 2 chars
  - Email input validates email format
  - Password input requires min 8 chars
  - Form is disabled until all fields valid
  - On submit, calls onSubmit callback with name, email, password
  - Shows error message on API error
  - Handles email-already-exists error (generic message, no enumeration)

### Implementation for User Story 0

- [x] T026 [US0] Implement landing page component `frontend/src/pages/LandingPage.tsx`
  - Hero section: app logo, headline ("Split Shared Expenses"), value prop (3–4 key benefits)
  - Features section: cards showing use cases (roommates, trips, group dinners)
  - Trust section: testimonial or security/privacy assurance
  - CTA section: prominent "Create Account" button (→ /register), "Login" link (→ /login)
  - Design: modern, financial-appropriate (navy primary, emerald accent), fully responsive (360px–1200px)
  - No authentication required to view this page

- [x] T027 [US0] Implement register page component `frontend/src/pages/RegisterPage.tsx`
  - Display RegisterForm component
  - Handle onSubmit: call authApi.register(name, email, password)
  - On success: show success toast, redirect to /login after 2 seconds
  - On error (email exists, validation): display error message in form
  - Link to login page at bottom ("Already have an account?")
  - Must be redirected to /groups if already authenticated

- [x] T028 [US0] Implement login page component `frontend/src/pages/LoginPage.tsx`
  - Display LoginForm component
  - Handle onSubmit: call authApi.login(email, password)
  - On success: call AuthContext.login(), redirect to /groups
  - On error (invalid credentials): display generic error message in form
  - Link to register page at bottom ("Don't have an account?")
  - Must be redirected to /groups if already authenticated

- [x] T029 [US0] Implement RegisterForm component `frontend/src/features/auth/components/RegisterForm.tsx`
  - React Hook Form with Zod validation
  - Fields: name (min 2), email (valid format), password (min 8, requirements shown)
  - Submit button disabled until form valid
  - Async validation: check email availability on blur (optional, nice-to-have)
  - Error display per field + general error banner
  - WCAG accessible: labels, ARIA, keyboard navigation

- [x] T030 [US0] Implement LoginForm component `frontend/src/features/auth/components/LoginForm.tsx`
  - React Hook Form with Zod validation
  - Fields: email (required), password (required)
  - Password visibility toggle
  - Submit button disabled until form filled
  - Generic error message on auth failure (no field-level hints)
  - WCAG accessible: labels, ARIA, keyboard navigation

- [x] T031 [US0] Implement useRegister hook `frontend/src/features/auth/hooks/useRegister.ts`
  - useMutation via TanStack Query
  - Calls authApi.register(name, email, password)
  - Returns: mutate(formData), isPending, isError, error
  - Handles idempotency: generates requestId on first call

- [x] T032 [US0] Implement useLogin hook `frontend/src/features/auth/hooks/useLogin.ts`
  - useMutation via TanStack Query
  - Calls authApi.login(email, password)
  - On success: updates AuthContext via dispatch
  - Returns: mutate(credentials), isPending, isError, error

- [x] T033 [US0] Implement authApi functions in `frontend/src/services/api/authApi.ts`
  - register(name: string, email: string, password: string): Promise<AuthUser>
  - login(email: string, password: string): Promise<AuthUser>
  - logout(): Promise<void>
  - me(): Promise<AuthUser> — called on app mount to restore session
  - All calls add requestId header for idempotency and OTEL tracing

- [x] T034 [US0] Update AuthContext to call me() on mount
  - On app mount: useEffect calls authApi.me()
  - On success: set user in context (isAuthenticated = true)
  - On error (401/404): keep user null (isAuthenticated = false)
  - Loading state managed by isLoading flag

- [x] T035 [US0] Configure router to handle public/private routes
  - Public routes: `/`, `/register`, `/login` — wrapped with RedirectIfAuth (if user is authenticated, redirect to /groups)
  - Private routes: all others — wrapped with RequireAuth (if not authenticated, redirect to /login)
  - Unknown routes: catch-all → NotFoundPage

- [x] T036 [US0] OTEL instrumentation: Auth flows
  - Manual spans in useRegister/useLogin hooks: `span.setAttributes({ flow: 'register'|'login', success: boolean })`
  - Log traces at key points: "user registered", "login_attempt", "session_restored"
  - Capture errors in span attributes for debugging

- [x] T037 [US0] Component tests for PublicLayout and RedirectIfAuth guard
  - Test that PublicLayout shows minimal nav (logo, login/register links)
  - Test that RedirectIfAuth redirects authenticated users to /groups
  - Test that LandingPage displays without auth

**Checkpoint**: User Story 0 complete — unauthenticated user can register, login, and access the app

---

## Phase 4: User Story 1 — Groups & Members Management (Priority: P1) 🎯 Core Feature

**Goal**: Authenticated user creates groups, manages members, and handles invites for collaborative expense tracking

**Independent Test**: User creates 1 group, sends invite to a friend, friend accepts, user views members list with 2 active members, user revokes pending invite

### Tests for User Story 1 (test-first approach)

- [x] T038 [P] [US1] Acceptance scenario tests (Playwright E2E) in `frontend/tests/e2e/groups.spec.ts`
  - Test 1: Authenticated user → groups list page (empty state — "Create your first group" CTA)
  - Test 2: Click "Create Group" → form (name, currency fields)
  - Test 3: Submit valid group → group appears in list
  - Test 4: Click group in list → group detail view (members, balance summary)
  - Test 5: Group detail → "Invite Member" button → invite form (email, link, expiry)
  - Test 6: Create invite → invite appears in invites table (Pending status)
  - Test 7: Revoke pending invite → invite status changes to Revoked
  - Test 8: Another user accepts invite → group members list updates (new member shows Active)
  - Test 9: Admin removes member → member removed from list
  - Tests must pass on all 3 viewports (360px, 768px, 1200px)

- [x] T039 [P] [US1] Component tests (Vitest + RTL) in `frontend/tests/components/forms/CreateGroupForm.test.tsx`
  - Name input required, min 3 chars
  - Currency select contains ISO 4217 codes (BRL, USD, EUR, etc.)
  - Form disabled until name and currency set
  - On submit, calls onSubmit with name, currency
  - Shows error message on API error (name taken, etc.)

- [x] T040 [P] [US1] Component tests (Vitest + RTL) in `frontend/tests/components/GroupCard.test.tsx`
  - Displays group name, member count, last transaction date
  - Shows owner badge for current user if they are owner
  - onClick event fired on card click
  - Responsive: full width on mobile, grid layout on desktop

- [x] T041 [P] [US1] Component tests (Vitest + RTL) in `frontend/tests/components/MemberList.test.tsx`
  - Renders member name, role badge (Owner/Admin/Member), status badge (Active/Inactive)
  - Empty state when no members
  - Shows remove button (if user is admin) next to each member
  - Remove button only enabled if user is admin
  - On remove click, calls onRemove callback
  - Pagination: 10 members per page

- [x] T042 [P] [US1] Component tests (Vitest + RTL) in `frontend/tests/components/CreateInviteForm.test.tsx`
  - Recipient input for email or "Link" toggle for shareable link
  - Expiry date picker (default: 7 days from now)
  - On submit, calls onSubmit with recipient, expiry
  - Shows error message on API error (invalid email, etc.)

- [x] T043 [P] [US1] Component tests (Vitest + RTL) in `frontend/tests/components/InviteTable.test.tsx`
  - Shows invites: recipient, channel (Email/Link), status (Pending/Accepted/Revoked/Expired), expiresAt
  - Revoke button (if status is Pending) next to each invite
  - On revoke click, calls onRevoke callback
  - Empty state when no invites
  - Sorting by created date (newest first, optional)

### Implementation for User Story 1

- [x] T044 [US1] Implement groups list page `frontend/src/pages/GroupsListPage.tsx`
  - Display list of user's groups via useGroups hook
  - Each group as GroupCard (shows name, member count, balance summary)
  - Empty state: "Create your first group" with CTA button
  - "Create Group" button (primary) → navigates to /groups/new
  - Responsive: single column on mobile, 2-col on tablet, 3-col desktop
  - Floating action button on mobile for "Create Group"

- [x] T045 [US1] Implement create group page `frontend/src/pages/CreateGroupPage.tsx`
  - Display CreateGroupForm component
  - On submit: call useCreateGroup hook
  - On success: redirect to /groups, show toast "Group created"
  - On error: display error message in form
  - Back button to return to /groups

- [x] T046 [US1] Implement group dashboard page `frontend/src/pages/GroupDashboardPage.tsx`
  - Display group name, currency, member count
  - Tabs or sections: Members, Invites, Expenses summary, Balances preview
  - Show members list (MemberList component)
  - Show pending invites (InviteTable component, filtered to Pending only)
  - Navigation: to view full history → /history, to create expense → /expenses/new, to settle → /settlements/new
  - Responsive layout: tabs on mobile, sections stacked on tablet, 2-col grid on desktop

- [x] T047 [US1] Implement GroupCard component `frontend/src/features/groups/components/GroupCard.tsx`
  - Props: group (GroupResponse), onClick: (groupId: string) => void
  - Display: group name, member count, owner name, balance indicator (number of pending), last updated date
  - Tailwind styling: card shadow, hover effect (scale + shadow), responsive padding
  - On click: call onClick(group.id)

- [x] T048 [US1] Implement CreateGroupForm component `frontend/src/features/groups/components/CreateGroupForm.tsx`
  - React Hook Form + Zod validation
  - Fields: name (3–80 chars), currency (select with ISO 4217 options)
  - Disabled submit until form valid
  - Error display per field + general banner
  - WCAG accessible (labels, ARIA, keyboard)

- [x] T049 [US1] Implement MemberList component `frontend/src/features/groups/components/MemberList.tsx`
  - Props: members (GroupMember[]), onRemove?: (userId: string) => void, isAdmin: boolean
  - Each member row: name, role badge (Owner/Admin/Member), status badge (Active/Inactive)
  - Remove button only visible if isAdmin && not owner (can't remove yourself)
  - Empty state: "No members yet"
  - Pagination: 10 per page (optional for MVP)
  - Responsive: full-width table on desktop, stacked rows on mobile

- [x] T050 [US1] Implement CreateInviteForm component `frontend/src/features/invites/components/CreateInviteForm.tsx`
  - React Hook Form + Zod validation
  - Channel radio: "Email" (default) or "Link" (shareable copy-to-clipboard)
  - If Email: recipient email input with validation
  - If Link: show copy-to-clipboard button with link (generated by backend)
  - Expiry date picker (default +7 days, min +1 day, max +30 days)
  - On submit: call onSubmit with channel, recipient, expiresAt
  - WCAG accessible

- [x] T051 [US1] Implement InviteTable component `frontend/src/features/invites/components/InviteTable.tsx`
  - Props: invites (InviteResponse[]), onRevoke?: (inviteId: string) => void
  - Columns: recipient, channel (Email/Link), status (Pending/Accepted/Revoked/Expired), expiresAt
  - Revoke button only if status === Pending and onRevoke provided
  - Empty state: "No invites"
  - Responsiveness: full table on desktop, collapsed columns on mobile (chip-based layout)

- [x] T052 [US1] Implement useGroups hook `frontend/src/features/groups/hooks/useGroups.ts`
  - useQuery (TanStack Query) fetches GET /groups
  - Returns: groups (GroupResponse[]), isLoading, isError, error
  - Invalidates on create/update/delete mutations

- [x] T053 [US1] Implement useGroup hook `frontend/src/features/groups/hooks/useGroup.ts`
  - useQuery (TanStack Query) fetches GET /groups/:groupId (param: groupId)
  - Returns: group (GroupResponse), isLoading, isError, error
  - Depends on groupId (useParams hook)

- [x] T054 [US1] Implement useCreateGroup hook `frontend/src/features/groups/hooks/useCreateGroup.ts`
  - useMutation (TanStack Query) calls groupsApi.createGroup(name, currency)
  - On success: invalidates useGroups cache
  - Returns: mutate(data), isPending, isError, error, data

- [x] T055 [US1] Implement useInvites hook `frontend/src/features/invites/hooks/useInvites.ts`
  - useQuery (TanStack Query) fetches GET /groups/:groupId/invites
  - Returns: invites (InviteResponse[]), isLoading, isError, error

- [x] T056 [US1] Implement useCreateInvite hook `frontend/src/features/invites/hooks/useCreateInvite.ts`
  - useMutation calls invitesApi.createInvite(groupId, channel, recipient, expiresAt)
  - On success: invalidates useInvites cache
  - Returns: mutate(data), isPending, data (includes invite copy link for Link channel)

- [x] T057 [US1] Implement useRevokeInvite hook `frontend/src/features/invites/hooks/useRevokeInvite.ts`
  - useMutation calls invitesApi.revokeInvite(inviteId)
  - On success: invalidates useInvites cache
  - Returns: mutate(inviteId), isPending, isError

- [x] T058 [US1] Implement groupsApi functions in `frontend/src/services/api/groupsApi.ts`
  - listGroups(): Promise<GroupResponse[]> — calls GET /groups
  - getGroup(groupId: string): Promise<GroupResponse> — calls GET /groups/:groupId
  - createGroup(name: string, currency: string): Promise<GroupResponse> — calls POST /groups with requestId

- [x] T059 [US1] Implement invitesApi functions in `frontend/src/services/api/invitesApi.ts`
  - listInvites(groupId: string): Promise<InviteResponse[]> — calls GET /groups/:groupId/invites
  - createInvite(groupId, channel, recipient, expiresAt): Promise<InviteResponse> — calls POST /groups/:groupId/invites
  - revokeInvite(inviteId: string): Promise<void> — calls DELETE /invites/:inviteId

- [x] T060 [US1] OTEL instrumentation: Group & invite operations
  - Manual spans: createGroup, listGroups, createInvite, revokeInvite operations
  - Attributes: groupId, inviteId, success, memberCount (for analytics)
  - Logs: "group_created", "invite_sent", "invite_revoked"

- [x] T061 [US1] Wire up MembersPage and InvitesPage stubs
  - `frontend/src/pages/MembersPage.tsx`: display MemberList component
  - `frontend/src/pages/InvitesPage.tsx`: display InviteTable component + CreateInviteForm
  - Both pages: load data via hooks, handle loading/error states

**Checkpoint**: User Story 1 complete — user can create groups, invite members, revoke invites

---

## Phase 5: User Story 2 — Record Expenses with Quick Entry (Priority: P1) 🎯 Main Value

**Goal**: Group member records shared expenses in few steps; system immediately updates balances and obligations

**Independent Test**: In 4-member group, user records expense (value + description, some members excluded); system shows participants list, final expense appears in history, balances update

### Tests for User Story 2 (test-first approach)

- [x] T062 [P] [US2] Acceptance scenario tests (Playwright E2E) in `frontend/tests/e2e/expenses.spec.ts`
  - Test 1: Group with 4 members → click "New Expense" → form appears (amount, description, participant selector)
  - Test 2: Enter amount 0 → submit button disabled
  - Test 3: Enter amount >0, description → participants list shows all members (checkboxes)
  - Test 4: Uncheck 1 participant → submit calculates split for remaining (in form preview)
  - Test 5: Click submit → expense appears in history/expense list immediately (no refresh needed)
  - Test 6: Group balance view → shows updated balances and obligations (seconds after create)
  - Test 7: Edit expense (change amount) → history updates, balances recalculated
  - Test 8: Delete expense (no settlements yet) → history updates, balances reset
  - Tests must pass on all 3 viewports (360px, 768px, 1200px)

- [x] T063 [P] [US2] Component tests (Vitest + RTL) in `frontend/tests/components/forms/CreateExpenseForm.test.tsx`
  - Amount input: rejects 0, negative, invalid format
  - Amount input: only accepts positive numbers
  - Description input: max 200 chars, shows char count
  - Participant checkboxes: all pre-checked by default
  - On uncheck participant: split preview updates (show per-person amount)
  - On submit: calls onSubmit with amount, description, participantIds
  - Validates: amount >0, at least 2 participants, description required
  - Form disabled while submitting

- [x] T064 [P] [US2] Component tests (Vitest + RTL) in `frontend/tests/components/ExpenseCard.test.tsx`
  - Props: expense (ExpenseResponse), onEdit, onDelete
  - Shows: paid by name, amount, description, date
  - Colour-codes amount based on sign (green if positive for current user, red if negative)
  - Edit/Delete buttons (if user is author or admin)
  - onClick navigates to edit page
  - Responsive: full card on desktop, condensed on mobile

- [x] T065 [P] [US2] Component tests (Vitest + RTL) in `frontend/tests/components/ExpenseList.test.tsx`
  - Props: expenses (ExpenseResponse[]), onEdit, onDelete
  - Shows empty state: "No expenses"
  - Renders each expense as ExpenseCard
  - Reverse chronological order (newest first)
  - Loading skeleton (optional)
  - Pagination or infinite scroll: 20 per page

### Implementation for User Story 2

- [x] T066 [US2] Implement create expense page `frontend/src/pages/CreateExpensePage.tsx`
  - Display CreateExpenseForm component
  - On submit: call useCreateExpense hook
  - On success: redirect to /balances, show toast "Expense added"
  - On error: display error message
  - Must validate: all participants cannot be excluded (min 2 total)

- [x] T067 [US2] Implement edit expense page `frontend/src/pages/EditExpensePage.tsx`
  - Fetch expense via useExpense hook (param: expenseId)
  - Pre-populate form with current values
  - On submit: call useUpdateExpense hook
  - On success: redirect to /expenses, show toast "Expense updated"
  - On error: display error message
  - Disable edit if expense has linked settlements (from spec edge case)

- [x] T068 [US2] Implement expense list page `frontend/src/pages/ExpenseListPage.tsx`
  - Fetch expenses via useExpenses hook (for current group)
  - Display ExpenseList component
  - Each expense clickable → /expenses/:expenseId/edit
  - Delete button on each expense (calls useDeleteExpense hook)
  - Confirmation dialog for delete
  - Empty state: "No expenses yet. Record your first expense to get started."

- [x] T069 [US2] Implement CreateExpenseForm component `frontend/src/features/expenses/components/CreateExpenseForm.tsx`
  - React Hook Form + Zod validation
  - Fields:
    - amount: required, >0, <1B (reasonable limit)
    - description: required, 1–200 chars (show character count)
    - participants: checkboxes, all pre-checked, min 2 must be checked
  - Split preview: shows "split equally: R$ 12.50 each (4 people)" or "excluded: 1" based on selections
  - On submit: calls onSubmit with amount, description, excludedUserIds
  - Error display per field + general banner
  - Form disabled while submitting (isLoading state)

- [x] T070 [US2] Implement ExpenseCard component `frontend/src/features/expenses/components/ExpenseCard.tsx`
  - Props: expense (ExpenseResponse), onEdit?, onDelete?
  - Display: paid by name, amount (formatted with currency), description, date (relative, e.g. "2 hours ago")
  - Colour-code amount: green if owed to you, red if you owe (based on context user)
  - Action buttons: edit (pencil icon), delete (trash icon, if permitted)
  - On edit: call onEdit(expenseId)

- [x] T071 [US2] Implement ExpenseList component `frontend/src/features/expenses/components/ExpenseList.tsx`
  - Props: expenses (ExpenseResponse[]), onEdit?, onDelete?, isLoading
  - Render each expense as ExpenseCard
  - Empty state: illustrated empty state with icon
  - Loading skeleton (optional, if isLoading)
  - Reverse chronological order
  - Pagination: 20 per page (or infinite scroll with load more button)

- [x] T072 [US2] Implement EditExpenseForm component `frontend/src/features/expenses/components/EditExpenseForm.tsx`
  - Similar to CreateExpenseForm but allows editing amount/description only
  - Participants list is read-only (can't change after creation)
  - On submit: calls onSubmit with updated amount, description
  - Validates same as CreateExpenseForm

- [x] T073 [US2] Implement useExpenses hook `frontend/src/features/expenses/hooks/useExpenses.ts`
  - useQuery (TanStack Query) fetches expenses for current group/context
  - Returns: expenses (ExpenseResponse[]), isLoading, isError, error
  - Invalidates on create/update/delete

- [x] T074 [US2] Implement useExpense hook `frontend/src/features/expenses/hooks/useExpense.ts`
  - useQuery fetches single expense via GET /expenses/:expenseId (optional endpoint)
  - Or uses useExpenses filtered by ID (if single endpoint unavailable)

- [x] T075 [US2] Implement useCreateExpense hook `frontend/src/features/expenses/hooks/useCreateExpense.ts`
  - useMutation calls expensesApi.createExpense(groupId, paidByUserId, amount, description, excludedUserIds, requestId)
  - On success: invalidates useExpenses + useBalances caches (balances changed)
  - Returns: mutate(data), isPending, isError, error, data

- [x] T076 [US2] Implement useUpdateExpense hook `frontend/src/features/expenses/hooks/useUpdateExpense.ts`
  - useMutation calls expensesApi.updateExpense(expenseId, amount, description)
  - On success: invalidates useExpenses + useBalances caches
  - Returns: mutate({ amount, description }), isPending, isError

- [x] T077 [US2] Implement useDeleteExpense hook `frontend/src/features/expenses/hooks/useDeleteExpense.ts`
  - useMutation calls expensesApi.deleteExpense(expenseId)
  - On success: invalidates useExpenses + useBalances caches
  - Returns: mutate(expenseId), isPending, isError

- [x] T078 [US2] Implement expensesApi functions in `frontend/src/services/api/expensesApi.ts`
  - createExpense(groupId, paidByUserId, amount, description, excludedUserIds, requestId): Promise<ExpenseResponse>
    - POST /expenses with requestId header (idempotency)
  - updateExpense(expenseId, amount, description): Promise<ExpenseResponse>
    - PATCH /expenses/:expenseId
  - deleteExpense(expenseId): Promise<void>
    - DELETE /expenses/:expenseId

- [x] T079 [US2] OTEL instrumentation: Expense operations
  - Manual spans: createExpense, updateExpense, deleteExpense
  - Attributes: expenseId, groupId, amount, participantCount, success
  - Logs: "expense_created", "expense_updated", "expense_deleted"
  - Metrics: expense_count increment, expense_amount histogram

- [x] T080 [US2] Wire up ExpenseListPage with expense fetching
  - Load expenses on mount via useExpenses hook
  - Handle loading/error states with skeletons and error banners
  - Refresh on group change or manual refresh button

**Checkpoint**: User Story 2 complete — expenses can be recorded, edited, deleted; balances affected

---

## Phase 6: User Story 3 — Track Balances & History Live (Priority: P2)

**Goal**: Participant sees net balance, explicit obligations, and chronological history to decide settlement timing

**Independent Test**: After creating expenses + settlements, user views balance dashboard (shows self balance, obligations matrix), history page (all transactions reversed chronological)

### Tests for User Story 3 (test-first approach)

- [x] T081 [P] [US3] Acceptance scenario tests (Playwright E2E) in `frontend/tests/e2e/balances.spec.ts`
  - Test 1: Group with 3 members + expenses → view balances page
  - Test 2: Balance card shows: "You are owed X" or "You owe X" (for user's net position)
  - Test 3: Obligations matrix: "Alice owes Bob 50.00"
  - Test 4: All amounts in correct currency
  - Test 5: After new expense, balances update (no refresh needed)
  - Test 6: Check responsive design: stack on mobile, matrix on desktop
  - Tests pass on all 3 viewports (360px, 768px, 1200px)

- [x] T082 [P] [US3] Component tests (Vitest + RTL) in `frontend/tests/components/BalanceCard.test.tsx`
  - Shows: balance amount (net owed/owing), currency
  - Colour-coded: green if owed to user, red if user owes
  - Shows "No pending obligations" if balance is 0
  - Responsive: stacks on mobile, row on desktop

- [x] T083 [P] [US3] Component tests (Vitest + RTL) in `frontend/tests/components/ObligationRow.test.tsx`
  - Props: fromUser, toUser, amount, currency
  - Shows: "Alice owes Bob 50.00 BRL"
  - Colour: red if current user is debtor
  - On click: optional callback (to create settlement)

- [x] T084 [P] [US3] Component tests (Vitest + RTL) in `frontend/tests/components/LedgerViewer.test.tsx`
  - Props: entries (LedgerEntryResponse[])
  - Shows chronological entries (newest first)
  - Each entry: type icon (expense/settlement), user name, amount, description, date/time
  - Empty state: "No transactions"
  - Pagination or infinite scroll

### Implementation for User Story 3

- [x] T085 [US3] Implement balances dashboard page `frontend/src/pages/GroupDashboardPage.tsx` (extend)
  - Add balance section with:
    - BalanceCard showing net position for current user
    - ObligationRow list showing all member–member obligations
    - Link to create settlement: "Settle an obligation"
  - Tab or section: "Balances" tab displays this section

- [x] T086 [US3] Implement ledger history page `frontend/src/pages/LedgerHistoryPage.tsx`
  - Fetch ledger entries via useLedger hook (all entries for group)
  - Display LedgerViewer component (chronological list)
  - Empty state: "No transactions yet"
  - Pagination: 50 per page or infinite scroll

- [x] T087 [US3] Implement BalanceCard component `frontend/src/features/balances/components/BalanceCard.tsx`
  - Props: balance (number), currency (string), isOwed (boolean)
  - Display: amount formatted, "You are owed" or "You owe" label
  - Colour: green (owed to), red (owing), neutral (0)
  - Shows "Settled" or "No obligations" if balance === 0

- [x] T088 [US3] Implement ObligationRow component `frontend/src/features/balances/components/ObligationRow.tsx`
  - Props: obligation (object: fromUserId, fromName, toUserId, toName, amount, currency), onSettle?
  - Display: "Alice owes Bob 50.00 BRL"
  - Colour-code: red if current user is debtor (fromUser)
  - Settle button (→ /settlements/new?from=X&to=Y): if onSettle provided
  - Responsive: full row on desktop, stacked text + button on mobile

- [x] T089 [US3] Implement LedgerViewer component `frontend/src/features/ledger/components/LedgerViewer.tsx`
  - Props: entries (LedgerEntryResponse[])
  - Each entry shows: type icon (expense/settlement), timestamp, payer/debtor name, amount, description
  - Timeline or list layout (timeline nice for visualization)
  - Pagination: 50 per page
  - Empty state: illustrated message

- [x] T090 [US3] Implement useBalances hook `frontend/src/features/balances/hooks/useBalances.ts`
  - useQuery (TanStack Query) fetches GET /balances?groupId=:groupId (or via API endpoint)
  - Returns: balances (object: userId → balance), obligations (array of ObligationData), isLoading, isError

- [x] T091 [US3] Implement useLedger hook `frontend/src/features/ledger/hooks/useLedger.ts`
  - useQuery fetches GET /ledger?groupId=:groupId
  - Returns: entries (LedgerEntryResponse[]), isLoading, isError, error
  - Entries auto-sorted reverse chronological (newest first)

- [x] T092 [US3] Implement balancesApi in `frontend/src/services/api/balancesApi.ts`
  - getBalances(groupId: string): Promise<BalanceResponse>
    - GET /balances?groupId=:groupId
    - Returns: { balance: number, obligations: ObligationData[] }

- [x] T093 [US3] Implement ledgerApi in `frontend/src/services/api/ledgerApi.ts`
  - getLedger(groupId: string): Promise<LedgerListResponse>
    - GET /ledger?groupId=:groupId
    - Returns: { entries: LedgerEntryResponse[] }

- [x] T094 [US3] OTEL instrumentation: Balance & ledger queries
  - Manual spans: getBalances, getLedger operations
  - Attributes: groupId, entryCount, success
  - Logs: "balance_loaded", "ledger_loaded"

**Checkpoint**: User Story 3 complete — user can view live balances and transaction history

---

## Phase 7: User Story 4 — Settlements & Notification Preferences (Priority: P3)

**Goal**: Participant records partial/full settlements and configures notification channels to close payment loops

**Independent Test**: User with 2 pending obligations settles one fully, one partially; notif preferences updated to email only; system persists all changes

### Tests for User Story 4 (test-first approach)

- [x] T095 [P] [US4] Acceptance scenario tests (Playwright E2E) in `frontend/tests/e2e/settlements.spec.ts`
  - Test 1: User with pending obligation → click "Settle" → settlement form (creditor, debtor pre-filled)
  - Test 2: Enter amount ≤ pending → submit
  - Test 3: Pending obligation updates (amount reduced)
  - Test 4: Enter amount > pending → error "exceeds pending"
  - Test 5: Full settlement (amount === pending) → obligation disappears
  - Test 6: Partial settlement: 1st call reduces amount, can settle again
  - Tests pass on all 3 viewports

- [x] T096 [P] [US4] Component tests (Vitest + RTL) in `frontend/tests/components/forms/CreateSettlementForm.test.tsx`
  - Creditor/debtor dropdowns pre-filled if passed as props
  - Amount input: required, >0, ≤ pending, formatted with currency
  - On submit: calls onSubmit with creditor, debtor, amount
  - Shows error: "amount exceeds pending X"
  - Form disabled while submitting

- [x] T097 [P] [US4] Component tests (Vitest + RTL) in `frontend/tests/components/NotificationChannelToggle.test.tsx`
  - Checkboxes for channels: Email, SMS, In-App (if supported)
  - On change: calls onChange callback
  - Shows loading state while saving
  - On error: shows error message + retry button

### Implementation for User Story 4

- [x] T098 [US4] Implement create settlement page `frontend/src/pages/CreateSettlementPage.tsx`
  - Display CreateSettlementForm component
  - Pre-fill creditor/debtor if passed via query params (?from=userId&to=userId)
  - On submit: call useCreateSettlement hook
  - On success: redirect to /balances, show toast "Settlement recorded"
  - On error: display error

- [x] T099 [US4] Implement notification preferences page `frontend/src/pages/NotificationPreferencesPage.tsx`
  - Display NotificationChannelToggle component(s)
  - Load current prefs via useNotificationPrefs hook
  - On change: call useUpdateNotificationPrefs hook
  - Show save status (saved, saving, error)

- [x] T100 [US4] Implement CreateSettlementForm component `frontend/src/features/settlements/components/CreateSettlementForm.tsx`
  - React Hook Form + Zod validation
  - Fields:
    - creditor (dropdown: member names)
    - debtor (dropdown: member names, initially current user)
    - amount (number, required, >0, ≤ pending)
  - Query pending amount from props or context
  - On submit: calls onSubmit with creditor, debtor, amount
  - Validate: amount cannot exceed pending (backend also validates)
  - Error display + disabled state

- [x] T101 [US4] Implement NotificationChannelToggle component `frontend/src/features/notifications/components/NotificationChannelToggle.tsx`
  - Props: preferences (NotificationPrefsResponse), onChange: (prefs) => void, isSaving: boolean
  - Radio/checkbox per channel: Email, SMS, In-App
  - On change: call onChange(updated)
  - Show loading spinner while saving (isSaving)
  - Show error message if error prop provided

- [x] T102 [US4] Implement useCreateSettlement hook `frontend/src/features/settlements/hooks/useCreateSettlement.ts`
  - useMutation calls settlementsApi.createSettlement(groupId, fromUserId, toUserId, amount)
  - On success: invalidates useBalances + useLedger + useSettlements caches
  - Returns: mutate(data), isPending, isError, error

- [x] T103 [US4] Implement useNotificationPrefs hook `frontend/src/features/notifications/hooks/useNotificationPrefs.ts`
  - useQuery (TanStack Query) fetches GET /users/notification-preferences
  - Returns: prefs (NotificationPrefsResponse), isLoading, isError

- [x] T104 [US4] Implement useUpdateNotificationPrefs hook `frontend/src/features/notifications/hooks/useUpdateNotificationPrefs.ts`
  - useMutation calls notificationsApi.updateNotificationPreferences(prefs)
  - On success: invalidates useNotificationPrefs cache
  - Returns: mutate(prefs), isPending, isError, error

- [x] T105 [US4] Implement settlementsApi in `frontend/src/services/api/settlementsApi.ts`
  - createSettlement(groupId, fromUserId, toUserId, amount, requestId): Promise<SettlementResponse>
    - POST /settlements with requestId header

- [x] T106 [US4] Implement notificationsApi in `frontend/src/services/api/notificationsApi.ts`
  - updateNotificationPreferences(prefs: NotificationPrefsRequest): Promise<NotificationPrefsResponse>
    - PATCH /users/notification-preferences

- [x] T107 [US4] OTEL instrumentation: Settlement & notification operations
  - Manual spans: createSettlement, updateNotificationPrefs
  - Attributes: groupId, amount, success
  - Logs: "settlement_recorded", "notification_prefs_updated"

- [x] T108 [US4] Update group dashboard to link to settlements
  - Add quick action: "Settle an Obligation" button → /settlements/new
  - Show pending obligations as clickable (pre-fill settlement form)

**Checkpoint**: User Story 4 complete — settlements and notification preferences functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories, final validation, optimization

- [x] T109 [P] Complete component test coverage for critical paths
  - All form components have validation tests
  - All list components have empty state tests
  - All guard components (RequireAuth, RedirectIfAuth) tested
  - Coverage target: ≥80% statements, ≥75% branches

- [x] T110 [P] Add E2E responsive tests for all pages
  - Each page tested at 360px, 768px, 1200px viewports
  - Verify touch targets ≥44px on mobile
  - Verify no horizontal scroll at any viewport
  - Screenshot baselines for regression detection (`playwright-report/`)

- [ ] T111 Complete observability instrumentation
  - Verify all API calls traced (auto + manual spans)
  - Verify all critical user journeys logged (register → login → create expense → settle)
  - Verify Prometheus metrics collected (route latency, API duration, error count)
  - Sampling correct: 100% dev, 10% prod (configurable via env)

- [ ] T112 [P] Performance optimization
  - Measure initial bundle size (should be <500KB gzipped excluding node_modules)
  - Code-split pages via React.lazy() (optional for MVP)
  - Verify route transitions < 500ms
  - Verify component renders < 100ms

- [x] T113 Create run-through documentation in `frontend/IMPLEMENTATION_NOTES.md`
  - Summary of feature (what was built)
  - Technology choices (why Vite, TanStack Query, etc. — link to research.md)
  - Architecture (pages → hooks → API services structure)
  - Known limitations (if any)
  - Next steps (future improvements: dark mode, offline support, etc.)

- [x] T114 Verify quickstart.md commands execute correctly
  - `npm install` succeeds
  - `npm run dev` starts dev server at :5173
  - `npm run build` outputs to backend wwwroot/
  - `npm test` runs unit + component tests
  - `npm run test:e2e` runs Playwright tests on all 3 viewports
  - `npm run type-check` runs TypeScript strict mode check
  - `npm run lint` reports 0 errors

- [x] T115 Backend: Remove Blazor from solution
  - Delete `backend/src/Interface/Web/` (Blazor project folder)
  - Delete `backend/tests/web/` (Blazor test project folder)
  - Remove Blazor project references from `backend/FairShareApp.Backend.sln`
  - Verify solution builds: `dotnet build backend/FairShareApp.Backend.sln` succeeds
  - Verify tests pass: `dotnet test backend/` succeeds (no Blazor tests)

- [x] T116 Backend: Verify static file serving + SPA fallback
  - Build frontend: `cd frontend && npm run build`
  - Run backend: `cd backend && dotnet run --project src/Interface/Api`
  - Access https://localhost:5001/ — should see React app (LandingPage if not authenticated)
  - Access https://localhost:5001/groups — should redirect to /login (not authenticated)
  - All routes not matching `/api/*` should return index.html (SPA fallback)

- [x] T117 Create DEPLOYMENT.md with instructions
  - Frontend build: `cd frontend && npm run build`
  - Backend build: `cd backend && dotnet build -c Release`
  - Backend run: `dotnet run --project src/Interface/Api -c Release`
  - Environment variables: API_BASE_URL (production), OTEL_ENDPOINT (if using remote tracing)
  - Verification checklist: landing page loads, login works, create group works

- [ ] T118 Final validation checklist
  - All 5 user stories can be completed end-to-end (register → group → expense → balance → settle)
  - No console errors or warnings
  - All tests pass (unit, component, E2E)
  - All linting passes (TypeScript strict, ESLint, Prettier)
  - Responsive design verified on mobile (360px), tablet (768px), desktop (1200px)
  - OTEL tracing verified (Jaeger UI shows traces for key operations)
  - Backend + frontend integration verified (JWT cookie auth, idempotency, error handling)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ├─→ Phase 3: User Story 0 (P1) — register/login (GATE: must complete before others)
    ├─→ Phase 4: User Story 1 (P1) — groups/members (can run parallel with US2/US3 after US0)
    ├─→ Phase 5: User Story 2 (P1) — expenses (can run parallel)
    ├─→ Phase 6: User Story 3 (P2) — balances/history (can run parallel)
    └─→ Phase 7: User Story 4 (P3) — settlements/notfs (can run parallel)
    ↓
Phase 8: Polish (depends on all desired user stories)
```

### User Story Dependencies

- **User Story 0 (P1)**: Must complete first — no other story can run until auth works
- **User Story 1 (P1)**: Can start after US0 + Foundational are complete
- **User Story 2 (P1)**: Can start after US0 + US1 + Foundational are complete (needs group context)
- **User Story 3 (P2)**: Can start after US0 + US2 + Foundational are complete (needs expenses to view)
- **User Story 4 (P3)**: Can start after US0 + US3 + Foundational are complete (needs balances to settle)

### Critical Gates

- **Gate 1**: Phase 1 (Setup) — must complete before any development
- **Gate 2**: Phase 2 (Foundational) — must complete before any user story
- **Gate 3**: Phase 3 (User Story 0) — must complete before Phase 4/5/6/7 begin
- **Gate 4**: Each user story must have all acceptance scenarios passing before moving to next priority

### Parallel Opportunities

Once Foundational phase (T010–T022) is complete, the following can run in parallel with different team members:

```
Developer A:
  Phase 3 (User Story 0): T023–T037 (auth/register/login)
  Then phase 4 (US1)

Developer B:
  Phase 5 (User Story 2): T062–T080 (expenses) — after US0 complete
  Can start T062–T065 (tests) immediately after US0

Developer C:
  Phase 6 (User Story 3): T081–T094 (balances) — after US0 + US2 foundation
  Phase 7 (User Story 4): T095–T108 (settlements)
```

Phase 8 (Polish) can start after Phase 1–7 are substantially complete (not necessarily waiting for all stories).

### MVP Scope (Minimum Viable Product)

To ship the first deployable increment:

1. ✅ Complete Phase 1: Setup (T001–T009)
2. ✅ Complete Phase 2: Foundational (T010–T022)
3. ✅ Complete Phase 3: User Story 0 (T023–T037) — auth gate
4. ✅ Complete Phase 4: User Story 1 (T038–T061) — groups/members
5. ✅ **STOP & VALIDATE**: Can register, create group, invite members
6. ⚠️ Optional: Phase 5 User Story 2 (expenses) — for additional value before launch
7. ⚠️ Later: Phase 6/7/8 for follow-up releases

---

## Implementation Strategy

### Sequential (Single Developer)

1. Phases 1–2 (Setup + Foundational): ~10 days
2. Phase 3 (US0 — auth): ~2 days
3. **MVP CHECKPOINT**: Ship auth + landing page
4. Phase 4 (US1 — groups): ~3 days
5. **MVP CHECKPOINT**: Ship groups/members
6. Phase 5 (US2 — expenses): ~3 days
7. **MVP CHECKPOINT**: Ship core features
8. Phase 6–7 (Balances, settlements, notifications): ~3 days each
9. Phase 8 (Polish): ~2 days

**Total MVP (through Phase 4)**: ~15 days

### Parallel (3+ Developers)

1. All 3 devs: Phase 1–2 together (Setup + Foundational): ~3 days
2. Dev A: Phase 3 (US0) in parallel with Devs B/C on test writing: ~2 days
3. **MVP GATE CHECKPOINT**: US0 complete, all auth flows verified
4. Dev A: Phase 4 (US1 — groups)
   Dev B: Phase 5 (US2 — expenses tests) — can write tests while waiting
   Dev C: Phase 8 prep (observability, component library polish)
5. After US0 complete + US1 half-done: Dev B/C join Phase 5
6. Sequential Phase 6–7 (balances/settlements) — minimal parallel opportunity due to dependencies
7. Phase 8 (Polish): All 3 together

**Total MVP (parallel, 3 devs)**: ~7 days

### Test-Driven Approach (Recommended)

For each user story phase:

1. Write all test tasks first (T0XX tests)
2. Verify tests FAIL (red)
3. Implement feature (turn tests green)
4. Refactor with tests passing (no regression)

Example: User Story 2

```bash
# Week 1: Tests
- T062 write Playwright E2E scenarios (red)
- T063–T065 write component tests (red)
- Commit: "feat: expense user story tests (all failing)"

# Week 2: Implementation
- T066–T080 implement feature components/hooks/API
- Tests turn green
- Commit: "feat: expense user story implementation (tests passing)"

# Week 3: Optimization
- Optimize performance, refactor, add edge case coverage
- All tests still passing
- Commit: "refactor: expense component cleanup"
```

---

## Task Summary

| Phase           | Tasks     | Count   | Parallel Opportunities                                            |
| --------------- | --------- | ------- | ----------------------------------------------------------------- |
| 1: Setup        | T001–T009 | 9       | T003, T004, T005, T006, T007, T008, T009 (7 parallel)             |
| 2: Foundational | T010–T022 | 13      | T010, T011, T012, T016, T017, T019 (6 parallel after T010)        |
| 3: User Story 0 | T023–T037 | 15      | T024, T025 (2 parallel tests); others sequential                  |
| 4: User Story 1 | T038–T061 | 24      | T039–T043 (tests parallel); T044–T061 (sequential implementation) |
| 5: User Story 2 | T062–T080 | 19      | T062–T065 (tests parallel); others sequential                     |
| 6: User Story 3 | T081–T094 | 14      | T081–T084 (tests parallel); others sequential                     |
| 7: User Story 4 | T095–T108 | 14      | T095–T097 (tests parallel); others sequential                     |
| 8: Polish       | T109–T118 | 10      | T109, T110, T112 (3 parallel)                                     |
| **TOTAL**       |           | **118** | ~30% parallelizable                                               |

---

## Notes & Conventions

- All file paths are absolute from project root: `backend/`, `frontend/`, `specs/`, etc.
- Task IDs (T001–T118) are sequential; tasks marked [P] are parallelizable
- [Story] labels (US0–US4) map to user story phases; foundational tasks have no label
- Each component test file matches source file name (e.g., `Button.tsx` → `Button.test.tsx`)
- Each hook test file matches hook name (e.g., `useGroups.ts` → `useGroups.test.ts`)
- All tests follow Arrange–Act–Assert (AAA) pattern
- All API calls include requestId header for idempotency and tracing
- All async operations managed via TanStack Query (useQuery, useMutation)
- All forms use React Hook Form + Zod (type-safe validation)
- All styling via Tailwind CSS (no CSS-in-JS or inline styles)
- All observability via OpenTelemetry (tracing, metrics, logging)
- Error messages are generic (no user enumeration, no sensitive data in logs)
- Responsive design tested at 3 viewports: 360px (mobile), 768px (tablet), 1200px (desktop)

---

## Checkpoint Validations

After completing each checkpoint, validate:

### After Phase 1 (T001–T009)

- [ ] `npm install` succeeds
- [ ] `npm run dev` starts dev server
- [ ] TypeScript compiles with 0 errors
- [ ] ESLint runs with 0 errors

### After Phase 2 (T010–T022)

- [ ] All types compile in TypeScript strict mode
- [ ] All hooks export correctly
- [ ] All API services connect to backend
- [ ] AuthContext provides auth state correctly
- [ ] Router loads all 15 stub pages
- [ ] Backend serves static files + returns index.html for unknown routes

### After Phase 3 (T023–T037)

- [ ] User can register at /register
- [ ] User can login at /login
- [ ] Session persists on page reload (GET /auth/me called)
- [ ] Unauthenticated user cannot access /groups (redirected to /login)
- [ ] All auth acceptance scenarios passing
- [ ] All auth component tests passing (100+ test cases)

### After Phase 4 (T038–T061)

- [ ] User can create a group
- [ ] User can view groups list
- [ ] User can invite members
- [ ] User can revoke invites
- [ ] All group acceptance scenarios passing
- [ ] All group component tests passing

### After Phase 5 (T062–T080)

- [ ] User can create expense in a group
- [ ] User can exclude participants before creating expense
- [ ] Balances update immediately after expense creation
- [ ] User can edit expense (if no settlements)
- [ ] User can delete expense (if no settlements)
- [ ] All expense acceptance scenarios passing

### After Phase 6 (T081–T094)

- [ ] User can view balance for self (owed to / owing)
- [ ] User can see all obligations between members
- [ ] User can view ledger history (all transactions)
- [ ] History updates immediately when new transactions occur
- [ ] All balance acceptance scenarios passing

### After Phase 7 (T095–T108)

- [ ] User can create settlement (partial or full)
- [ ] Settlement cannot exceed pending amount
- [ ] Balances update after settlement
- [ ] User can update notification preferences
- [ ] Preferences persist on reload
- [ ] All settlement acceptance scenarios passing

### After Phase 8 (T109–T118)

- [ ] All tests pass: `npm test && npm run test:e2e`
- [ ] All linting passes: `npm run lint && npm run type-check`
- [ ] Production build succeeds: `npm run build`
- [ ] Backend serves build: `dotnet run` + access https://localhost:5001
- [ ] No Blazor references in backend solution
- [ ] Full end-to-end flow works: register → group → expense → balance → settle
- [ ] Responsive design verified on 360px, 768px, 1200px viewports
- [ ] OTEL tracing verified via Jaeger
- [ ] Documentation complete: README, IMPLEMENTATION_NOTES, DEPLOYMENT

---

**Generated**: 2026-04-12  
**Feature**: 003-react-frontend  
**Total Tasks**: 118  
**Status**: Ready for implementation
