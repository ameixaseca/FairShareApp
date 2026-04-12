# Data Model: FairShareApp Shared Expense Ledger

## Overview

The model prioritizes immutable financial records, explicit membership lifecycle, and tenant-safe access by GroupId.

## Entities

### Group

- Fields:
  - id (UUID)
  - name (string, 3-80 chars)
  - currency (string, ISO code)
  - ownerId (UUID)
  - planTier (enum: Free, Pro, Enterprise)
  - status (enum: Active, Archived)
  - createdAt (datetime)
  - updatedAt (datetime)
- Validation rules:
  - Name must be unique per owner among active groups.
  - Currency must be consistent for all financial records in the group.
- State transitions:
  - Active -> Archived (only owner/admin)

### Member

- Fields:
  - id (UUID)
  - groupId (UUID)
  - userId (UUID)
  - role (enum: Owner, Admin, Member)
  - status (enum: Pending, Active, Inactive, Removed)
  - joinedAt (datetime, nullable)
  - leftAt (datetime, nullable)
- Validation rules:
  - One active membership per user per group.
  - Owner transfer required before owner removal/exit.
- State transitions:
  - Pending -> Active (invite accepted)
  - Active -> Inactive (temporary deactivation)
  - Active -> Removed (removed or voluntary leave)

### Invite

- Fields:
  - id (UUID)
  - groupId (UUID)
  - issuedByUserId (UUID)
  - channel (enum: Link, Email)
  - recipient (string)
  - tokenHash (string)
  - expiresAt (datetime)
  - status (enum: Pending, Accepted, Revoked, Expired)
  - createdAt (datetime)
- Validation rules:
  - Pending invites require future expiration.
  - Accepted/revoked/expired invites cannot be reused.
- State transitions:
  - Pending -> Accepted
  - Pending -> Revoked
  - Pending -> Expired

### Expense

- Fields:
  - id (UUID)
  - groupId (UUID)
  - paidByUserId (UUID)
  - amount (decimal(18,2), > 0)
  - description (string, 1-200)
  - requestId (string, unique by group)
  - createdAt (datetime)
  - updatedAt (datetime)
  - status (enum: Posted, Corrected, Cancelled)
- Validation rules:
  - Amount must be positive and currency-conformant.
  - Expense edit/delete is blocked if linked settlement exists.
- State transitions:
  - Posted -> Corrected
  - Posted -> Cancelled

### ExpenseParticipant

- Fields:
  - id (UUID)
  - expenseId (UUID)
  - userId (UUID)
  - included (boolean)
  - splitAmount (decimal(18,2), >= 0)
- Validation rules:
  - Included participants sum must equal expense amount.
  - At least 2 eligible active members for shared split.

### Settlement

- Fields:
  - id (UUID)
  - groupId (UUID)
  - fromUserId (UUID)
  - toUserId (UUID)
  - amount (decimal(18,2), > 0)
  - requestId (string, unique by group)
  - createdAt (datetime)
  - status (enum: Posted, Reversed)
- Validation rules:
  - Amount cannot exceed open obligation between parties.
- State transitions:
  - Posted -> Reversed (only by correction flow)

### LedgerEntry

- Fields:
  - id (UUID)
  - groupId (UUID)
  - fromUserId (UUID)
  - toUserId (UUID)
  - amount (decimal(18,2), > 0)
  - entryType (enum: ExpenseShare, Settlement, ExpenseCorrection, ExpenseCancellation)
  - referenceType (enum: Expense, Settlement)
  - referenceId (UUID)
  - occurredAt (datetime)
- Validation rules:
  - Immutable after creation.
  - Every financial operation must create balanced ledger effects.

### BalanceProjection

- Fields:
  - groupId (UUID)
  - userId (UUID)
  - balance (decimal(18,2))
  - lastEventAt (datetime)
- Validation rules:
  - Rebuildable from ledger entries.

### NotificationPreference

- Fields:
  - id (UUID)
  - userId (UUID)
  - groupId (UUID)
  - channels (set enum: InApp, Email, Telegram)
  - isEnabled (boolean)
  - updatedAt (datetime)
- Validation rules:
  - At least one enabled channel for active users when notifications are enabled.

### AuditLog

- Fields:
  - id (UUID)
  - groupId (UUID)
  - actorUserId (UUID)
  - actionType (string)
  - entityType (string)
  - entityId (UUID)
  - beforeSnapshot (json, nullable)
  - afterSnapshot (json, nullable)
  - createdAt (datetime)
- Validation rules:
  - Required for expense/settlement create/update/delete and invite/role changes.

## Relationships

- Group 1:N Member
- Group 1:N Invite
- Group 1:N Expense
- Expense 1:N ExpenseParticipant
- Group 1:N Settlement
- Group 1:N LedgerEntry
- Group 1:N BalanceProjection
- Group 1:N AuditLog
- Member (User) 1:N NotificationPreference (by group)

## Invariants

- LedgerEntry is append-only.
- Sum of participant split amounts equals expense amount.
- No partial balance updates: write transaction commits all or nothing.
- Authorization is evaluated by role and group membership before mutation.
- All read projections are derivable from immutable events.
