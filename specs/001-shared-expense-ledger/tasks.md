# Tasks: FairShareApp Shared Expense Ledger

**Input**: Design documents from `/specs/001-shared-expense-ledger/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included because this feature follows Test-First and defines explicit independent validation flows in spec/quickstart.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `backend/tests/`
- **Mobile**: `mobile/`
- **Shared packages**: `packages/shared/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare solution skeleton and baseline tooling for ledger-centric implementation

- [x] T001 Create backend solution and project folders in backend/src/Domain, backend/src/Application, backend/src/Infrastructure, backend/src/Interface
- [x] T002 Create test project folders in backend/tests/unit, backend/tests/integration, backend/tests/contract, backend/tests/load
- [x] T003 [P] Add shared API types skeleton in packages/shared/types/ledger.ts
- [x] T004 [P] Add API client skeleton in packages/shared/api-client/fairshare-client.ts
- [x] T005 [P] Configure repository-level formatting and linting rules in backend/.editorconfig
- [x] T006 [P] Configure base test runner settings in backend/tests/testsettings.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core platform capabilities that block all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create database context and baseline migration setup in backend/src/Infrastructure/Persistence/FairShareDbContext.cs
- [x] T008 [P] Implement authentication middleware and JWT validation in backend/src/Interface/Api/Middleware/JwtAuthMiddleware.cs
- [x] T009 [P] Implement tenant isolation middleware by GroupId in backend/src/Interface/Api/Middleware/TenantContextMiddleware.cs
- [x] T010 [P] Implement idempotency request middleware in backend/src/Interface/Api/Middleware/IdempotencyMiddleware.cs
- [x] T011 [P] Implement global exception handling and API error contract in backend/src/Interface/Api/Middleware/ExceptionHandlingMiddleware.cs
- [x] T012 Implement immutable ledger base entity and repository contracts in backend/src/Domain/Ledger/LedgerEntry.cs
- [x] T013 [P] Implement audit logging infrastructure in backend/src/Infrastructure/Persistence/Audit/AuditLogWriter.cs
- [x] T014 [P] Implement OpenTelemetry bootstrap and correlation id propagation in backend/src/Interface/Api/Observability/TelemetryConfig.cs
- [x] T015 [P] Implement notification event bus abstraction in backend/src/Application/Ports/INotificationEventBus.cs
- [x] T016 Register dependency injection composition root in backend/src/Interface/Api/DependencyInjection/ServiceRegistration.cs

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Criar grupo colaborativo (Priority: P1) 🎯 MVP

**Goal**: Enable secure group creation, invitation lifecycle, and membership activation

**Independent Test**: User creates a group, sends invites, invitees join, and invite lifecycle states are auditable.

### Tests for User Story 1

- [x] T017 [P] [US1] Add contract test for POST /groups in backend/tests/contract/Groups/CreateGroupContractTests.cs
- [x] T018 [P] [US1] Add contract test for POST /groups/{groupId}/invites in backend/tests/contract/Invites/CreateInviteContractTests.cs
- [x] T019 [P] [US1] Add integration test for invite acceptance and activation in backend/tests/integration/Invites/AcceptInviteFlowTests.cs
- [x] T020 [P] [US1] Add integration test for revoke/expire invite behavior in backend/tests/integration/Invites/InviteLifecycleTests.cs

### Implementation for User Story 1

- [x] T021 [P] [US1] Implement Group aggregate and invariants in backend/src/Domain/Groups/Group.cs
- [x] T022 [P] [US1] Implement Member entity and role/state model in backend/src/Domain/Groups/Member.cs
- [x] T023 [P] [US1] Implement Invite entity with lifecycle states in backend/src/Domain/Groups/Invite.cs
- [x] T024 [US1] Implement create-group use case in backend/src/Application/UseCases/Groups/CreateGroupUseCase.cs
- [x] T025 [US1] Implement create-invite use case with expiration and revocation rules in backend/src/Application/UseCases/Invites/CreateInviteUseCase.cs
- [x] T026 [US1] Implement accept-invite use case in backend/src/Application/UseCases/Invites/AcceptInviteUseCase.cs
- [x] T027 [US1] Implement revoke-invite endpoint handler in backend/src/Interface/Api/Controllers/InvitesController.cs
- [x] T028 [US1] Implement groups and invites endpoints in backend/src/Interface/Api/Controllers/GroupsController.cs
- [x] T029 [US1] Add audit events for group and invite operations in backend/src/Application/Services/GroupAuditService.cs

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: User Story 2 - Registrar despesa com rateio imediato (Priority: P1)

**Goal**: Register expenses with equal split by default, optional participant exclusion, and immediate ledger impact

**Independent Test**: In a 4-member group, expense registration generates correct obligations and updates balances in <= 5 seconds.

### Tests for User Story 2

- [x] T030 [P] [US2] Add contract test for POST /expenses in backend/tests/contract/Expenses/CreateExpenseContractTests.cs
- [x] T031 [P] [US2] Add integration test for equal split expense in backend/tests/integration/Expenses/EqualSplitExpenseTests.cs
- [x] T032 [P] [US2] Add integration test for excluded participants split in backend/tests/integration/Expenses/ExcludedParticipantsTests.cs
- [x] T033 [P] [US2] Add integration test for idempotent expense submission in backend/tests/integration/Expenses/IdempotentCreateExpenseTests.cs

### Implementation for User Story 2

- [x] T034 [P] [US2] Implement Expense entity and status transitions in backend/src/Domain/Expenses/Expense.cs
- [x] T035 [P] [US2] Implement ExpenseParticipant entity and validation rules in backend/src/Domain/Expenses/ExpenseParticipant.cs
- [x] T036 [P] [US2] Implement obligation calculation domain service in backend/src/Domain/Ledger/ExpenseSplitCalculator.cs
- [x] T037 [US2] Implement create-expense transactional use case in backend/src/Application/UseCases/Expenses/CreateExpenseUseCase.cs
- [x] T038 [US2] Implement ledger entry writer for expense shares in backend/src/Infrastructure/Persistence/Ledger/LedgerWriter.cs
- [x] T039 [US2] Implement create-expense endpoint in backend/src/Interface/Api/Controllers/ExpensesController.cs
- [x] T040 [US2] Implement expense notification publication in backend/src/Application/Services/ExpenseNotificationService.cs
- [x] T041 [US2] Implement balance projection updater on expense events in backend/src/Application/Services/BalanceProjectionUpdater.cs

**Checkpoint**: User Stories 1 and 2 independently functional

---

## Phase 5: User Story 3 - Visualizar saldo e histórico vivo (Priority: P2)

**Goal**: Provide clear balance snapshot, debtor/creditor relations, and reverse-chronological history

**Independent Test**: Member can open balance and history views and correctly identify current debts and credit position.

### Tests for User Story 3

- [x] T042 [P] [US3] Add contract test for GET /groups/{groupId}/balance in backend/tests/contract/Balances/GetBalancesContractTests.cs
- [x] T043 [P] [US3] Add contract test for GET /groups/{groupId}/ledger in backend/tests/contract/Ledger/GetLedgerContractTests.cs
- [x] T044 [P] [US3] Add integration test for reverse-chronological history in backend/tests/integration/Ledger/HistoryOrderingTests.cs
- [x] T045 [P] [US3] Add integration test for unauthorized access blocking in backend/tests/integration/Security/GroupIsolationTests.cs

### Implementation for User Story 3

- [x] T046 [P] [US3] Implement BalanceProjection read model repository in backend/src/Infrastructure/Persistence/Projections/BalanceProjectionRepository.cs
- [x] T047 [P] [US3] Implement ledger query service in backend/src/Application/Services/LedgerQueryService.cs
- [x] T048 [US3] Implement get-balances endpoint in backend/src/Interface/Api/Controllers/BalancesController.cs
- [x] T049 [US3] Implement get-ledger endpoint in backend/src/Interface/Api/Controllers/LedgerController.cs
- [x] T050 [US3] Implement history response DTO mapping in backend/src/Interface/Api/Contracts/LedgerHistoryResponse.cs
- [x] T051 [US3] Add tracing and latency metrics for read projections in backend/src/Interface/Api/Observability/ReadModelMetrics.cs

**Checkpoint**: User Stories 1, 2 and 3 independently functional

---

## Phase 6: User Story 4 - Quitar dívida entre membros (Priority: P3)

**Goal**: Register partial/total settlements and support correction/deletion guardrails with full auditability

**Independent Test**: Debtor records partial and full settlement; balances and history update correctly; overpayment is blocked.

### Tests for User Story 4

- [x] T052 [P] [US4] Add contract test for POST /settlements in backend/tests/contract/Settlements/CreateSettlementContractTests.cs
- [x] T053 [P] [US4] Add integration test for partial settlement flow in backend/tests/integration/Settlements/PartialSettlementTests.cs
- [x] T054 [P] [US4] Add integration test for full settlement flow in backend/tests/integration/Settlements/FullSettlementTests.cs
- [x] T055 [P] [US4] Add integration test for overpayment rejection in backend/tests/integration/Settlements/OverpaymentValidationTests.cs
- [x] T056 [P] [US4] Add integration test for expense edit/delete restrictions in backend/tests/integration/Expenses/ExpenseCorrectionGuardsTests.cs

### Implementation for User Story 4

- [x] T057 [P] [US4] Implement Settlement entity and validation in backend/src/Domain/Settlements/Settlement.cs
- [x] T058 [P] [US4] Implement open-obligation validation service in backend/src/Domain/Ledger/ObligationValidationService.cs
- [x] T059 [US4] Implement create-settlement transactional use case in backend/src/Application/UseCases/Settlements/CreateSettlementUseCase.cs
- [x] T060 [US4] Implement expense update use case with settlement guard in backend/src/Application/UseCases/Expenses/UpdateExpenseUseCase.cs
- [x] T061 [US4] Implement expense delete/cancel use case with audit trail in backend/src/Application/UseCases/Expenses/DeleteExpenseUseCase.cs
- [x] T062 [US4] Implement settlements endpoint in backend/src/Interface/Api/Controllers/SettlementsController.cs
- [x] T063 [US4] Implement expense patch/delete endpoints in backend/src/Interface/Api/Controllers/ExpensesController.cs
- [x] T064 [US4] Publish settlement and correction notifications in backend/src/Application/Services/SettlementNotificationService.cs

**Checkpoint**: All user stories independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, performance, and final quality checks across all stories

- [x] T065 [P] Implement notification preferences endpoint in backend/src/Interface/Api/Controllers/NotificationPreferencesController.cs
- [x] T066 [P] Add load test suite for ledger write and projection SLA in backend/tests/load/LedgerProjectionLatencyLoadTests.cs
- [x] T067 Add API documentation and endpoint examples in backend/src/Interface/Api/Docs/SharedExpenseLedgerExamples.md
- [x] T068 [P] Add security regression tests for role and tenant boundaries in backend/tests/integration/Security/RbacAndTenantBoundaryTests.cs
- [X] T069 Run and validate quickstart scenarios in specs/001-shared-expense-ledger/quickstart.md
- [X] T070 Final cleanup and naming consistency pass in backend/src/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies, start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1, blocks all user story phases.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 and can run in parallel with US1 after shared foundation is complete.
- **Phase 5 (US3)**: Depends on Phase 2 and read-model hooks from US2.
- **Phase 6 (US4)**: Depends on Phase 2 and ledger write path from US2.
- **Phase 7 (Polish)**: Depends on completion of desired user story phases.

### User Story Dependencies

- **US1**: Independent after foundational phase.
- **US2**: Independent after foundational phase; uses group/member state from US1 for realistic data.
- **US3**: Independent after foundational phase; consumes outputs from ledger/projection services.
- **US4**: Independent after foundational phase; relies on existing obligations generated by US2 to validate settlement behavior.

### Within Each User Story

- Tests first and failing before implementation.
- Entities/domain rules before use cases.
- Use cases before controllers/endpoints.
- Endpoint integration and observability at end of story phase.

### Parallel Opportunities

- Setup tasks marked [P] can run concurrently.
- Foundational middleware/observability tasks marked [P] can run concurrently.
- Contract and integration tests within the same story marked [P] can run concurrently.
- Domain entities/services within same story marked [P] can run concurrently when in different files.

---

## Parallel Example: User Story 1

```bash
Task: "Add contract test for POST /groups in backend/tests/contract/Groups/CreateGroupContractTests.cs"
Task: "Add contract test for POST /groups/{groupId}/invites in backend/tests/contract/Invites/CreateInviteContractTests.cs"
Task: "Implement Group aggregate and invariants in backend/src/Domain/Groups/Group.cs"
Task: "Implement Invite entity with lifecycle states in backend/src/Domain/Groups/Invite.cs"
```

## Parallel Example: User Story 2

```bash
Task: "Add integration test for equal split expense in backend/tests/integration/Expenses/EqualSplitExpenseTests.cs"
Task: "Add integration test for excluded participants split in backend/tests/integration/Expenses/ExcludedParticipantsTests.cs"
Task: "Implement Expense entity and status transitions in backend/src/Domain/Expenses/Expense.cs"
Task: "Implement ExpenseParticipant entity and validation rules in backend/src/Domain/Expenses/ExpenseParticipant.cs"
```

## Parallel Example: User Story 4

```bash
Task: "Add integration test for partial settlement flow in backend/tests/integration/Settlements/PartialSettlementTests.cs"
Task: "Add integration test for full settlement flow in backend/tests/integration/Settlements/FullSettlementTests.cs"
Task: "Implement Settlement entity and validation in backend/src/Domain/Settlements/Settlement.cs"
Task: "Implement open-obligation validation service in backend/src/Domain/Ledger/ObligationValidationService.cs"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independent test criteria and publish MVP for group onboarding.

### Incremental Delivery

1. Add US2 to enable core expense and debt formation.
2. Add US3 to deliver full visibility value for users.
3. Add US4 to complete settlement lifecycle and corrections.
4. Run Phase 7 hardening before release cutoff.

### Parallel Team Strategy

1. Team aligns on Phase 1 and Phase 2 together.
2. After foundation:
   - Dev A: US1 + invite lifecycle
   - Dev B: US2 + ledger writes
   - Dev C: US3 + projections/read APIs
   - Dev D: US4 + settlements/corrections
3. Merge by story checkpoints with contract and integration tests required.

---

## Notes

- Every task follows checklist format: checkbox, Task ID, optional [P], optional [USx], clear action, explicit path.
- Task IDs are globally sequential (T001-T070).
- MVP suggestion: complete through Phase 3 (US1) first.
- No unresolved prerequisite documents or clarifications remain for task execution.
