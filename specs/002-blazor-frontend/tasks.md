# Tasks: Blazor Frontend Enhancement for Shared Expense Service

**Input**: Design documents from `specs/002-blazor-frontend/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are intentionally omitted because the feature spec does not explicitly require a TDD-first task list. Validation and test execution are included in polish tasks.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable task (different files, no dependency on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3, US4)
- Every task includes an explicit file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create Blazor Web project scaffolding inside the existing backend solution.

- [X] T001 Create Blazor Web project file in `backend/src/Interface/Web/FairShareApp.Backend.Web.csproj`
- [X] T002 Add Blazor Web project to solution in `backend/FairShareApp.Backend.sln`
- [X] T003 Configure startup host and DI bootstrap in `backend/src/Interface/Web/Program.cs`
- [X] T004 [P] Create base app shell and route host in `backend/src/Interface/Web/Components/App.razor`
- [X] T005 [P] Define design tokens for modern financial style in `backend/src/Interface/Web/Styles/Tokens.css`
- [X] T006 [P] Define responsive breakpoints and layout helpers in `backend/src/Interface/Web/Styles/Responsive.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared infrastructure that blocks all user stories.

**CRITICAL**: No user story implementation starts before this phase is complete.

- [X] T007 Configure typed HttpClient base configuration in `backend/src/Interface/Web/Services/ApiClients/FairShareApiClient.cs`
- [X] T008 Implement authentication state provider in `backend/src/Interface/Web/Services/Auth/FairShareAuthenticationStateProvider.cs`
- [X] T009 [P] Implement route authorization guard in `backend/src/Interface/Web/Components/Auth/AuthorizeRouteView.razor`
- [X] T010 [P] Implement API error handling and trace propagation in `backend/src/Interface/Web/Services/ApiClients/ApiErrorHandler.cs`
- [X] T011 Implement preload orchestrator service in `backend/src/Interface/Web/Services/Preloading/PreloadOrchestrator.cs`
- [X] T012 [P] Implement cache metadata and TTL policy service in `backend/src/Interface/Web/Services/Caching/ViewCacheService.cs`
- [X] T013 [P] Implement cache invalidation by mutation event in `backend/src/Interface/Web/Services/Caching/CacheInvalidationService.cs`
- [X] T014 Create responsive main layout with financial summary slots in `backend/src/Interface/Web/Components/Layout/MainLayout.razor`

**Checkpoint**: Foundation ready - US1, US2, US3, and US4 can start.

---

## Phase 3: User Story 1 - Operar grupos e membros (Priority: P1) 🎯 MVP

**Goal**: Enable creation of groups, invite lifecycle, and member administration with role-based visibility.

**Independent Test**: Authenticated user creates group, sends invite, revokes pending invite, and role-restricted member actions are blocked in UI.

### Implementation for User Story 1

- [X] T015 [P] [US1] Create group and member view models in `backend/src/Interface/Web/Models/Groups/GroupModels.cs`
- [X] T016 [P] [US1] Create invite view models in `backend/src/Interface/Web/Models/Groups/InviteModels.cs`
- [X] T017 [US1] Implement group API adapter methods in `backend/src/Interface/Web/Services/ApiClients/GroupsApiClient.cs`
- [X] T018 [US1] Implement invite API adapter methods in `backend/src/Interface/Web/Services/ApiClients/InvitesApiClient.cs`
- [X] T019 [US1] Implement group list and create page in `backend/src/Interface/Web/Pages/Groups/GroupsPage.razor`
- [X] T020 [US1] Implement member management page in `backend/src/Interface/Web/Pages/Groups/GroupMembersPage.razor`
- [X] T021 [US1] Implement invite management component in `backend/src/Interface/Web/Components/Groups/InvitePanel.razor`
- [X] T022 [US1] Implement role-aware action visibility policy in `backend/src/Interface/Web/Services/Auth/AuthorizationViewPolicyService.cs`

**Checkpoint**: US1 is independently functional.

---

## Phase 4: User Story 2 - Registrar despesas com entrada rápida (Priority: P1)

**Goal**: Provide fast expense entry, participant exclusion, and expense maintenance flows.

**Independent Test**: User registers expense with exclusions and sees updated values; edit/delete only available when settlement-free.

### Implementation for User Story 2

- [X] T023 [P] [US2] Create expense form and list view models in `backend/src/Interface/Web/Models/Expenses/ExpenseModels.cs`
- [X] T024 [P] [US2] Implement expense input validators in `backend/src/Interface/Web/Services/Validation/ExpenseValidators.cs`
- [X] T025 [US2] Implement expense API adapter methods in `backend/src/Interface/Web/Services/ApiClients/ExpensesApiClient.cs`
- [X] T026 [US2] Implement quick-entry expense component in `backend/src/Interface/Web/Components/Expenses/QuickExpenseEntry.razor`
- [X] T027 [US2] Implement expense create page in `backend/src/Interface/Web/Pages/Expenses/CreateExpensePage.razor`
- [X] T028 [US2] Implement expense edit page in `backend/src/Interface/Web/Pages/Expenses/EditExpensePage.razor`
- [X] T029 [US2] Trigger preload for participants/obligations before expense form in `backend/src/Interface/Web/Services/Preloading/ExpensePreloadService.cs`
- [X] T030 [US2] Invalidate and refresh balance/history caches on expense mutation in `backend/src/Interface/Web/Services/Caching/ExpenseMutationCacheHandler.cs`

**Checkpoint**: US2 is independently functional.

---

## Phase 5: User Story 3 - Acompanhar saldos e histórico vivo (Priority: P2)

**Goal**: Present accurate balance, obligations, and reverse chronological history with responsive visualization.

**Independent Test**: User opens dashboard/history and correctly identifies net balances and who-owes-whom across breakpoints.

### Implementation for User Story 3

- [X] T031 [P] [US3] Create dashboard/history view models in `backend/src/Interface/Web/Models/Dashboard/DashboardModels.cs`
- [X] T032 [US3] Implement balances and ledger API adapter methods in `backend/src/Interface/Web/Services/ApiClients/BalancesApiClient.cs`
- [X] T033 [US3] Implement dashboard page with responsive financial cards in `backend/src/Interface/Web/Pages/Dashboard/GroupDashboardPage.razor`
- [X] T034 [US3] Implement obligations visualization component in `backend/src/Interface/Web/Components/Dashboard/ObligationsGrid.razor`
- [X] T035 [US3] Implement full history page in `backend/src/Interface/Web/Pages/History/GroupHistoryPage.razor`
- [X] T036 [US3] Implement stale-data indicator and manual refresh action in `backend/src/Interface/Web/Components/Dashboard/ProjectionFreshnessBanner.razor`

**Checkpoint**: US3 is independently functional.

---

## Phase 6: User Story 4 - Registrar quitações e preferências de notificação (Priority: P3)

**Goal**: Support partial/total settlement and user-level notification preference management.

**Independent Test**: User executes partial and full settlement and updates notification channels successfully.

### Implementation for User Story 4

- [X] T037 [P] [US4] Create settlement and notification preference view models in `backend/src/Interface/Web/Models/Settlements/SettlementModels.cs`
- [X] T038 [P] [US4] Implement settlement validators with max-pending checks in `backend/src/Interface/Web/Services/Validation/SettlementValidators.cs`
- [X] T039 [US4] Implement settlements API adapter methods in `backend/src/Interface/Web/Services/ApiClients/SettlementsApiClient.cs`
- [X] T040 [US4] Implement settlement page and form in `backend/src/Interface/Web/Pages/Settlements/CreateSettlementPage.razor`
- [X] T041 [US4] Implement notification preferences page in `backend/src/Interface/Web/Pages/Settings/NotificationPreferencesPage.razor`

**Checkpoint**: US4 is independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, accessibility, performance, and deployment readiness.

- [X] T042 [P] Apply modern financial typography and semantic color usage across pages in `backend/src/Interface/Web/Styles/Tokens.css`
- [X] T043 [P] Review and tune responsive layout edge cases in `backend/src/Interface/Web/Styles/Responsive.css`
- [X] T044 Optimize preloading heuristics per route transition in `backend/src/Interface/Web/Services/Preloading/PreloadOrchestrator.cs`
- [X] T045 Optimize cache TTLs and invalidation coverage in `backend/src/Interface/Web/Services/Caching/ViewCacheService.cs`
- [X] T046 Add structured UI telemetry for key user actions in `backend/src/Interface/Web/Services/Telemetry/WebInteractionTelemetry.cs`
- [X] T047 Run quickstart validation checklist and record findings in `specs/002-blazor-frontend/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): no dependencies
- Foundational (Phase 2): depends on Setup and blocks all user stories
- User Stories (Phase 3-6): depend on Foundational completion
- Polish (Phase 7): depends on completion of selected user stories

### User Story Dependencies

- US1 (P1): starts after Phase 2, no dependency on other stories
- US2 (P1): starts after Phase 2, independent of US1 for core expense flow
- US3 (P2): starts after Phase 2, consumes balances/history contracts and can run in parallel with US1/US2
- US4 (P3): starts after Phase 2, depends only on foundational services

### Within Each User Story

- Models before API adapters
- API adapters before pages/components
- Pages/components before cache/preload integration adjustments
- Story checkpoint before moving to polish for that area

### Parallel Opportunities

- Phase 1: T004-T006 parallel after T001-T003
- Phase 2: T009, T010, T012, T013 parallel after T007-T008
- US1: T015 and T016 parallel, then T017 and T018
- US2: T023 and T024 parallel, then T025
- US3: T033 and T034 can proceed in parallel after T032
- US4: T037 and T038 parallel before T039
- Polish: T042 and T043 parallel

---

## Parallel Example: User Story 1

```bash
Task: "Create group and member view models in backend/src/Interface/Web/Models/Groups/GroupModels.cs"
Task: "Create invite view models in backend/src/Interface/Web/Models/Groups/InviteModels.cs"
```

## Parallel Example: User Story 2

```bash
Task: "Create expense form and list view models in backend/src/Interface/Web/Models/Expenses/ExpenseModels.cs"
Task: "Implement expense input validators in backend/src/Interface/Web/Services/Validation/ExpenseValidators.cs"
```

## Parallel Example: User Story 3

```bash
Task: "Implement dashboard page with responsive financial cards in backend/src/Interface/Web/Pages/Dashboard/GroupDashboardPage.razor"
Task: "Implement obligations visualization component in backend/src/Interface/Web/Components/Dashboard/ObligationsGrid.razor"
```

## Parallel Example: User Story 4

```bash
Task: "Create settlement and notification preference view models in backend/src/Interface/Web/Models/Settlements/SettlementModels.cs"
Task: "Implement settlement validators with max-pending checks in backend/src/Interface/Web/Services/Validation/SettlementValidators.cs"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2
2. Deliver Phase 3 (US1) end-to-end
3. Validate US1 independently with role and invite lifecycle flows
4. Demo/deploy MVP slice

### Incremental Delivery

1. Add US2 for fast expense entry
2. Add US3 for transparent balance/history
3. Add US4 for settlement and notification closure
4. Run Phase 7 polish before release candidate

### Parallel Team Strategy

1. Team A: US1 + auth/rbac UI completion
2. Team B: US2 expense flows and mutation cache invalidation
3. Team C: US3 dashboards and responsive financial visualization
4. Team D: US4 settlements/preferences and cross-cutting polish

---

## Notes

- All tasks use strict checklist format with Task ID and explicit file path.
- Story-labeled tasks appear only in user-story phases.
- [P] markers are applied only where file-level independence exists.
- Each user story includes an explicit independent test criterion.
