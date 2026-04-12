# Quickstart: FairShareApp Shared Expense Ledger

## Purpose

Validate end-to-end behavior for group setup, expense splitting, settlement, and balance projection based on the feature contract.

## Preconditions

- API service is running with database and cache available.
- Test users exist: owner, member-b, member-c, member-d.
- Authentication token is available for each test user.

## 1. Create Group

1. Call create group endpoint with name and currency.
2. Confirm response includes group id and owner id.
3. Persist group id for next steps.

Expected result:

- Group is active.
- Owner is active member with admin rights.

## 2. Invite Members

1. Create three invites for member-b, member-c, member-d.
2. Accept invites with respective users.
3. Confirm members become active.

Expected result:

- Invite lifecycle is auditable.
- Revoked/expired invite cannot be reused.

## 3. Register Expense With Equal Split

1. Owner posts expense: amount 22.00, description Pao e Queijo.
2. Do not exclude any participant.

Expected result:

- Ledger entries are created for each debtor to payer.
- Balance projection updates within 5 seconds.

## 4. Register Expense With Participant Exclusion

1. Owner posts expense: amount 40.00 and excludes member-d.
2. Verify split only among included participants.

Expected result:

- Excluded member has no obligation from this expense.
- Audit log records exclusion decision.

## 5. Register Partial Settlement

1. member-b settles a partial amount to owner.
2. Verify pending obligation decreases but remains open.

Expected result:

- Settlement ledger entry exists.
- Projection reflects reduced debt.

## 6. Edit/Delete Guardrails

1. Attempt to edit an expense without linked settlement.
2. Attempt to delete an expense with linked settlement.

Expected result:

- First operation succeeds and recalculates balances.
- Second operation is rejected by business rule.

## 7. Authorization and Isolation Checks

1. Try reading group balance with non-member token.
2. Try admin-only invite revoke with non-admin member.

Expected result:

- Unauthorized operations are blocked.
- No cross-group data leakage occurs.

## 8. Notification Preferences

1. Update user notification channels.
2. Post a new expense.

Expected result:

- Notifications follow configured channels.
- Financial write is not blocked by notification channel failure.

## 9. Operational Verification

1. Query ledger and balance endpoints after operations.
2. Compare projected balances with derived balances from ledger entries.

Expected result:

- Values reconcile without manual correction.
- Trace/correlation identifiers allow operation tracking in logs.

## Validation Status

- Validation executed on 2026-04-12 with `dotnet test backend/FairShareApp.Backend.sln -v minimal`.
- Automated scenarios covering group creation, invite lifecycle, expense registration, exclusion handling, settlement flow, authorization boundaries, and projection-related checks passed successfully.
- Result summary: 24 tests executed, 24 passed, 0 failed.
- Remaining manual follow-up for a fully live quickstart is limited to running the API against provisioned PostgreSQL/Redis infrastructure and replaying the HTTP flows end-to-end.
