# Data Model: Blazor Frontend for FairShare Service

## Overview

The frontend model reuses backend financial entities and adds view-focused shapes for pages, forms, and UX states. Domain truth remains in backend APIs and ledger.

## Core Entities Consumed

### Group

- Fields:
  - id (UUID)
  - name (string, 3-80)
  - currency (string, ISO)
  - ownerId (UUID)
  - status (Active | Archived)
- Validation rules:
  - Name required and unique within owner scope (validated by backend).

### Member

- Fields:
  - id (UUID)
  - groupId (UUID)
  - userId (UUID)
  - role (Owner | Admin | Member)
  - status (Pending | Active | Inactive | Removed)
- Validation rules:
  - Only members with proper role can execute administrative actions.

### Invite

- Fields:
  - id (UUID)
  - groupId (UUID)
  - channel (Link | Email)
  - recipient (string)
  - expiresAt (datetime)
  - status (Pending | Accepted | Revoked | Expired)
- Validation rules:
  - Expired/revoked/consumed invites cannot be accepted.

### Expense

- Fields:
  - id (UUID)
  - groupId (UUID)
  - paidByUserId (UUID)
  - amount (decimal > 0)
  - description (1-200)
  - excludedUserIds (UUID list, optional)
  - status (Posted | Corrected | Cancelled)
- Validation rules:
  - amount > 0
  - description required
  - edit/delete blocked when linked settlements exist

### Settlement

- Fields:
  - id (UUID)
  - groupId (UUID)
  - fromUserId (UUID)
  - toUserId (UUID)
  - amount (decimal > 0)
  - status (Posted | Reversed)
- Validation rules:
  - amount cannot exceed open obligation between members

### BalanceProjection

- Fields:
  - groupId (UUID)
  - userId (UUID)
  - balance (decimal)
  - lastEventAt (datetime)
- Validation rules:
  - read model eventually consistent up to 5s after writes

### LedgerEntry

- Fields:
  - id (UUID)
  - groupId (UUID)
  - fromUserId (UUID)
  - toUserId (UUID)
  - amount (decimal)
  - entryType (ExpenseShare | Settlement | ExpenseCorrection | ExpenseCancellation)
  - occurredAt (datetime)
- Validation rules:
  - append-only event stream in backend

### NotificationPreference

- Fields:
  - userId (UUID)
  - groupId (UUID)
  - channels (InApp | Email | Telegram)
  - isEnabled (bool)
- Validation rules:
  - selected channels must be from allowed set

## Frontend View Entities

### DashboardView

- Fields:
  - groupSummary (Group)
  - memberBalances (BalanceProjection[])
  - obligations (pairwise debt view)
  - recentHistory (LedgerEntry[])
  - projectionFreshnessSeconds (int)
- Usage:
  - Main group dashboard page with consolidated data.

### ExpenseFormState

- Fields:
  - amountInput (string)
  - descriptionInput (string)
  - selectedParticipants (UUID[])
  - validationErrors (map)
  - isSubmitting (bool)
- Usage:
  - Quick-entry and full expense forms.

### SettlementFormState

- Fields:
  - fromUserId (UUID)
  - toUserId (UUID)
  - amountInput (string)
  - maxAllowedAmount (decimal)
  - validationErrors (map)
- Usage:
  - Partial/total settlement registration.

### AuthorizationViewPolicy

- Fields:
  - currentUserRole (Owner | Admin | Member)
  - canManageMembers (bool)
  - canRevokeInvites (bool)
  - canEditExpense (bool, contextual)
  - canDeleteExpense (bool, contextual)
- Usage:
  - UI-level action visibility, with API as final authority.

### ResponsiveViewState

- Fields:
  - viewportClass (Mobile | Tablet | Desktop)
  - sidebarMode (Collapsed | Overlay | Fixed)
  - balanceCardDensity (Compact | Standard | Expanded)
  - visibleColumns (string[])
- Usage:
  - Controls responsive rendering strategy per breakpoint.

### FinancialThemeTokenSet

- Fields:
  - primarySurface (string)
  - accentPositive (string)
  - accentNegative (string)
  - accentNeutral (string)
  - typographyScale (map)
  - elevationScale (map)
- Usage:
  - Guarantees modern financial visual language consistency across pages/components.

### PreloadPlan

- Fields:
  - contextKey (groupId/userId)
  - preloadTargets (balances | members | invites | recentHistory)
  - trigger (postLogin | groupSelection | postMutation)
  - maxParallelRequests (int)
- Usage:
  - Coordinates proactive fetch strategy for likely-next user actions.

### CacheEntryMetadata

- Fields:
  - cacheKey (string)
  - createdAt (datetime)
  - ttlSeconds (int)
  - invalidationReason (MutationEvent | Expiry | ManualRefresh)
  - sourceVersion (etag/hash optional)
- Usage:
  - Tracks freshness and invalidation behavior for intelligent cache policy.

## Relationships

- Group 1:N Member
- Group 1:N Invite
- Group 1:N Expense
- Group 1:N Settlement
- Group 1:N LedgerEntry
- Group 1:N BalanceProjection
- Member 1:N NotificationPreference (by group)
- DashboardView aggregates Group + BalanceProjection + LedgerEntry + obligations
- ResponsiveViewState configures rendering of DashboardView and forms
- PreloadPlan references cached entities and route transitions

## State Transitions

- Invite: Pending -> Accepted | Revoked | Expired
- Expense: Posted -> Corrected | Cancelled
- Settlement: Posted -> Reversed
- Member: Pending -> Active -> Inactive/Removed

## Invariants

- UI never treats cached state as financial truth when API returns newer projection.
- Every successful mutation triggers balance/history refresh cycle.
- Forbidden actions are hidden in UI and blocked by API.
- Financial operations never bypass backend validation.
- Responsive layouts preserve visibility of critical financial figures on all supported breakpoints.
- Preloading must never bypass authorization constraints or role filters.
