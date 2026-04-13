# Data Model: React SPA Frontend — FairShareApp

**Feature**: 003-react-frontend  
**Branch**: `003-react-frontend`  
**Date**: 2026-04-12  
**Source**: spec.md entities + `specs/001-shared-expense-ledger/contracts/openapi.yaml`

---

## Overview

All types below are TypeScript interfaces used exclusively in the frontend layer. They map to API response shapes and are never persisted in the browser. Financial values are plain `number` (floating point) — display formatting is handled by presentation utilities.

---

## Auth Domain

```typescript
// The authenticated identity held in React AuthContext
interface AuthUser {
  id: string; // UUID
  name: string;
  email: string;
}

// POST /auth/register — request body
interface RegisterRequest {
  name: string; // min 2 chars
  email: string; // valid email format
  password: string; // min 8 chars
}

// POST /auth/login — request body
interface LoginRequest {
  email: string;
  password: string;
}

// GET /auth/me — response
interface MeResponse {
  id: string;
  name: string;
  email: string;
}
```

---

## Group Domain

```typescript
// GET /groups — response item
// GET /groups/{groupId} — response
interface GroupResponse {
  id: string; // UUID
  name: string;
  currency: string; // ISO 4217, e.g. "BRL", "USD"
  ownerId: string; // UUID
  members: GroupMember[];
}

interface GroupMember {
  userId: string; // UUID
  name: string;
  role: MemberRole;
  status: MemberStatus;
}

type MemberRole = "Owner" | "Admin" | "Member";
type MemberStatus = "Active" | "Inactive";

// POST /groups — request body
interface CreateGroupRequest {
  name: string; // 3–80 chars
  currency: string; // 3 chars ISO 4217
  ownerId: string; // UUID — current authenticated user
}
```

---

## Invite Domain

```typescript
// GET /groups/{groupId}/invites — response item
interface InviteResponse {
  id: string; // UUID
  groupId: string; // UUID
  channel: InviteChannel;
  recipient: string; // email address or descriptive label
  status: InviteStatus;
  expiresAt: string; // ISO 8601 datetime
}

type InviteChannel = "Link" | "Email";
type InviteStatus = "Pending" | "Accepted" | "Revoked" | "Expired";

// POST /groups/{groupId}/invites — request body
interface CreateInviteRequest {
  channel: InviteChannel;
  recipient: string;
  expiresAt: string; // ISO 8601 datetime
}
```

---

## Expense Domain

```typescript
// POST /expenses — response
interface ExpenseResponse {
  id: string; // UUID
  groupId: string; // UUID
  paidByUserId: string; // UUID
  amount: number; // > 0
  description: string; // 1–200 chars
  status: ExpenseStatus;
  createdAt: string; // ISO 8601 datetime (from ledger)
}

type ExpenseStatus = "Posted" | "Corrected" | "Cancelled";

// POST /expenses — request body
interface CreateExpenseRequest {
  groupId: string; // UUID
  paidByUserId: string; // UUID
  amount: number; // > 0.01
  description: string; // 1–200 chars
  excludedUserIds?: string[]; // UUIDs of members excluded from split
  requestId: string; // idempotency key (UUID v4)
}

// PATCH /expenses/{expenseId} — request body
interface UpdateExpenseRequest {
  amount?: number; // > 0.01
  description?: string; // 1–200 chars
}
```

---

## Settlement Domain

```typescript
// POST /settlements — request body
interface CreateSettlementRequest {
  groupId: string; // UUID
  fromUserId: string; // UUID — the debtor paying
  toUserId: string; // UUID — the creditor receiving
  amount: number; // > 0.01, ≤ outstanding obligation
  requestId: string; // idempotency key (UUID v4)
}
```

---

## Balance Domain

```typescript
// GET /groups/{groupId}/balance — response
interface BalanceResponse {
  groupId: string; // UUID
  balances: MemberBalance[];
  obligations: Obligation[];
}

interface MemberBalance {
  userId: string; // UUID
  name: string; // denormalized for display
  balance: number; // negative = owes money, positive = is owed
}

// Derived from balance pairs for "who owes whom" display
interface Obligation {
  fromUserId: string; // UUID — the debtor
  toUserId: string; // UUID — the creditor
  amount: number; // > 0
}
```

---

## Ledger / History Domain

```typescript
// GET /groups/{groupId}/ledger — response item
interface LedgerEntryResponse {
  id: string; // UUID
  fromUserId: string; // UUID
  toUserId: string; // UUID
  amount: number;
  entryType: LedgerEntryType;
  occurredAt: string; // ISO 8601 datetime
}

type LedgerEntryType =
  | "ExpensePosted"
  | "ExpenseCorrected"
  | "ExpenseCancelled"
  | "SettlementPosted";
```

---

## Notification Preferences Domain

```typescript
// PUT /users/{userId}/notification-preferences — request body
interface NotificationPreferenceRequest {
  groupId: string; // UUID
  channels: NotificationChannel[];
}

type NotificationChannel = "InApp" | "Email" | "Telegram";

// Frontend display model
interface NotificationPreference {
  groupId: string;
  groupName: string; // denormalized for display
  channels: NotificationChannel[];
}
```

---

## Frontend UI State

These types represent transient UI state — they are never sent to the API.

````typescript
// Auth context state
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Async operation status for mutations
type OperationStatus = 'idle' | 'pending' | 'success' | 'error';

// Generic API error (from Axios interceptor)
interface ApiError {
  status: number;
  message: string;
}

// Form validation result (shared between expense and settlement forms)
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

---

## Observability & Telemetry

```typescript
// OpenTelemetry trace span attributes
interface TraceAttributes {
  userId: string;           // UUID
  groupId?: string;         // UUID (if applicable)
  requestId: string;        // UUID v4 idempotency key
  operationType: 'read' | 'write' | 'navigation' | 'mutation';
  route: string;            // e.g., "/groups/:groupId/expenses"
  statusCode?: number;      // HTTP status or error code
  errorMessage?: string;    // error.message (no stack trace in attributes)
  duration: number;         // milliseconds
}

// Logged metrics (Prometheus)
type MetricType = 'route_transition_ms' | 'api_call_duration_ms' | 'component_render_ms' | 'form_submission_count' | 'error_count';

interface MetricPoint {
  type: MetricType;
  value: number;
  labels: {
    route?: string;
    endpoint?: string; // e.g., "POST /expenses"
    component?: string; // e.g., "CreateExpenseForm"
    status: 'success' | 'error';
  };
}

// Structured log entry (pino)
interface LogEntry {
  timestamp: string;        // ISO 8601
  level: 'debug' | 'info' | 'warn' | 'error';
  userId?: string;
  groupId?: string;
  requestId?: string;
  message: string;
  context?: Record<string, unknown>; // structured data, NO passwords/tokens
  error?: {
    message: string;
    stack?: string;        // included only in dev/staging
    code?: string;         // e.g., "VALIDATION_ERROR", "NETWORK_ERROR"
  };
}
````

---

## Component Test Fixtures

```typescript
// Mock API response for testing
interface MockApiFixture {
  scenario: "success" | "error" | "timeout";
  data?: unknown;
  statusCode?: number;
  delay?: number; // milliseconds
}

// Test utilities for form components
type FormTestHelpers = {
  fillInput(label: string, value: string): Promise<void>;
  clickButton(name: RegExp | string): Promise<void>;
  expectError(message: string): Promise<void>;
  expectButtonDisabled(name: string): Promise<void>;
};

// Responsive test viewports
type ViewportSize = "mobile"; // 360px
type ViewportSize = "tablet"; // 768px
type ViewportSize = "desktop"; // 1200px
```

```

---

## Entity Relationships

```

AuthUser
└─ member of ──► GroupMember (role: Owner|Admin|Member)
└─ belongs to ──► Group (id, name, currency)

Group
├─ has many ──► Invite (Pending|Accepted|Revoked|Expired)
├─ has many ──► Expense (Posted|Corrected|Cancelled)
├─ has many ──► Settlement
├─ has one ──► BalanceSnapshot (MemberBalance[], Obligation[])
└─ has many ──► LedgerEntry (chronological event log)

Expense
└─ excludes ──► ExcludedMember (subset of GroupMember)

Settlement
├─ from ──► GroupMember (debtor)
└─ to ──► GroupMember (creditor)

```

---

## Validation Rules (client-side, mirrored from server)

| Field | Rule |
|-------|------|
| Group name | min 3 chars, max 80 chars, required |
| Group currency | exactly 3 chars, required |
| Expense amount | > 0.01, required |
| Expense description | 1–200 chars, required |
| Settlement amount | > 0.01, ≤ outstanding obligation, required |
| User name (register) | min 2 chars, required |
| Email | valid RFC 5322 email format, required |
| Password (register) | min 8 chars, required |
| Invite expiresAt | future datetime, required |
```
