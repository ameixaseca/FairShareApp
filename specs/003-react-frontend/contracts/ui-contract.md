# UI Contract: FairShareApp React SPA

**Feature**: 003-react-frontend  
**Branch**: `003-react-frontend`  
**Date**: 2026-04-12  
**Related API contract**: `specs/001-shared-expense-ledger/contracts/openapi.yaml`

---

## Overview

This document defines the complete UI contract for the React SPA: all routes, the page responsibilities at each route, authentication guard rules, and the backend API endpoints each page depends on. It also documents API endpoints that must be added to the backend as part of this feature.

---

## Route Map

| Route                                       | Page                          | Auth Required | Description                                         |
| ------------------------------------------- | ----------------------------- | :-----------: | --------------------------------------------------- |
| `/`                                         | `LandingPage`                 |      No       | Public marketing page with product overview and CTA |
| `/register`                                 | `RegisterPage`                |      No       | New account creation form                           |
| `/login`                                    | `LoginPage`                   |      No       | Credential-based login form                         |
| `/groups`                                   | `GroupsListPage`              |      Yes      | List all groups for the authenticated user          |
| `/groups/new`                               | `CreateGroupPage`             |      Yes      | Form to create a new group                          |
| `/groups/:groupId`                          | `GroupDashboardPage`          |      Yes      | Group summary: balances, obligations, quick actions |
| `/groups/:groupId/expenses`                 | `ExpenseListPage`             |      Yes      | Expense history for the group                       |
| `/groups/:groupId/expenses/new`             | `CreateExpensePage`           |      Yes      | New expense entry form                              |
| `/groups/:groupId/expenses/:expenseId/edit` | `EditExpensePage`             |      Yes      | Edit expense (only when no linked settlement)       |
| `/groups/:groupId/members`                  | `MembersPage`                 |      Yes      | Group members list with role management             |
| `/groups/:groupId/invites`                  | `InvitesPage`                 |      Yes      | Invite management (create, list, revoke)            |
| `/groups/:groupId/settlements/new`          | `CreateSettlementPage`        |      Yes      | Register a partial or full settlement               |
| `/groups/:groupId/history`                  | `LedgerHistoryPage`           |      Yes      | Chronological ledger for the group                  |
| `/settings/notifications`                   | `NotificationPreferencesPage` |      Yes      | Notification channel preferences per group          |
| `*` (unmatched)                             | `NotFoundPage`                |      No       | 404 catch-all                                       |

### Authentication Guard Rules

- **Unauthenticated user** accessing any `Auth Required: Yes` route → redirect to `/login`
- **Authenticated user** accessing `/`, `/login`, or `/register` → redirect to `/groups`

---

## Page Responsibilities

### LandingPage (`/`)

- **Purpose**: Convert visitors into registered users
- **Content sections**:
  1. Hero — product name, tagline, primary CTA ("Criar conta grátis"), secondary CTA ("Entrar")
  2. Feature highlights — group splitting, real-time balances, settlement tracking (3 cards)
  3. How it works — 3-step visual flow (create group → add expenses → settle up)
  4. Footer — links to login and register
- **Data dependencies**: None (static content)
- **Navigation outcomes**: CTA → `/register`; "Entrar" link → `/login`

### RegisterPage (`/register`)

- **Purpose**: Collect name, email, password; create account; redirect to login
- **Form fields**: name (required), email (required, email format), password (required, ≥ 8 chars), confirm password (must match)
- **Validation**: client-side Zod schema before submit; server-side errors displayed inline
- **On success**: Redirect to `/login` with success notification
- **On duplicate email**: Show generic error (do not confirm email existence)
- **API**: `POST /auth/register`

### LoginPage (`/login`)

- **Purpose**: Authenticate user by email + password
- **Form fields**: email, password
- **Validation**: basic non-empty check before submit
- **On success**: Session established → redirect to `/groups`
- **On failure**: Generic error "Credenciais inválidas" (no field distinction)
- **API**: `POST /auth/login` (sets httpOnly cookie)

### GroupsListPage (`/groups`)

- **Purpose**: Dashboard entry point listing all groups
- **Content**: Cards for each group (name, currency, member count, own balance summary)
- **Actions**: Navigate to group dashboard; link to create new group
- **API**: `GET /groups`

### CreateGroupPage (`/groups/new`)

- **Purpose**: Group creation form
- **Form fields**: name (3–80 chars), currency (ISO 4217 3-letter code)
- **On success**: Redirect to `/groups/:newGroupId`
- **API**: `POST /groups`

### GroupDashboardPage (`/groups/:groupId`)

- **Purpose**: Central hub for a group — shows member balances, obligations, quick-add expense button
- **Content**: Balance summary cards per member, obligation matrix ("João owes Maria R$45"), navigation tiles to expenses/history/settlements
- **API**: `GET /groups/:groupId`, `GET /groups/:groupId/balance`

### ExpenseListPage (`/groups/:groupId/expenses`)

- **Purpose**: Expense history with edit/delete actions
- **Content**: Expense cards (description, amount, payer, status, date); filter by status
- **Actions**: Edit (only for Posted status without settlement), Cancel
- **API**: `GET /groups/:groupId/ledger` (filtered to expense entry types)

### CreateExpensePage (`/groups/:groupId/expenses/new`)

- **Purpose**: Fast expense entry
- **Form fields**: description, amount, paid-by member (default: self), excluded members (multi-select checklist)
- **Validation**: amount > 0, description 1–200 chars
- **On success**: Redirect to `/groups/:groupId` with cache invalidation on balance and ledger
- **API**: `POST /expenses`

### EditExpensePage (`/groups/:groupId/expenses/:expenseId/edit`)

- **Purpose**: Correct an existing expense that has no linked settlement
- **Form fields**: description, amount (same validation as create)
- **Guard**: If expense status is not `Posted`, redirect to expense list with info message
- **API**: `PATCH /expenses/:expenseId`

### MembersPage (`/groups/:groupId/members`)

- **Purpose**: View members and manage roles (Owner/Admin can remove members)
- **Content**: Member list with role badge, status indicator, remove action (permission-gated)
- **API**: `GET /groups/:groupId` (members array)

### InvitesPage (`/groups/:groupId/invites`)

- **Purpose**: Create new invites and manage pending ones
- **Form fields** (create): channel (Link/Email), recipient, expiry date
- **Content**: Invite table with status, channel, expiry, revoke action
- **API**: `POST /groups/:groupId/invites`, `GET /groups/:groupId/invites`, `POST /groups/:groupId/invites/:inviteId/revoke`

### CreateSettlementPage (`/groups/:groupId/settlements/new`)

- **Purpose**: Register a payment between two members
- **Form fields**: from-member, to-member (pre-filled from obligation if navigated from dashboard), amount (max = outstanding obligation)
- **Validation**: amount > 0, amount ≤ outstanding
- **On success**: Redirect to `/groups/:groupId` with cache invalidation
- **API**: `POST /settlements`

### LedgerHistoryPage (`/groups/:groupId/history`)

- **Purpose**: Full chronological audit trail
- **Content**: Sorted descending by `occurredAt`; entries labelled by `entryType` with human-readable description; amounts colour-coded (green/red)
- **API**: `GET /groups/:groupId/ledger`

### NotificationPreferencesPage (`/settings/notifications`)

- **Purpose**: Manage per-group notification channels
- **Content**: List of groups with channel toggles (InApp, Email, Telegram)
- **API**: `GET /groups` (to list groups), `PUT /users/:userId/notification-preferences`

---

## Required Backend API Additions

The following endpoints are not present in the existing OpenAPI contract and **must be added** to the backend as part of this feature:

### Auth Endpoints (new)

```yaml
POST /auth/register:
  summary: Register new user account
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [name, email, password]
          properties:
            name:
              type: string
              minLength: 2
            email:
              type: string
              format: email
            password:
              type: string
              minLength: 8
  responses:
    "201":
      description: Account created; user must log in
    "409":
      description: Email already registered (generic message only, no confirmation)

POST /auth/login:
  summary: Authenticate with email and password
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [email, password]
          properties:
            email:
              type: string
            password:
              type: string
  responses:
    "200":
      description: Authenticated; sets httpOnly JWT cookie
      headers:
        Set-Cookie:
          description: "token=<jwt>; HttpOnly; Secure; SameSite=Strict"
    "401":
      description: Invalid credentials (generic message)

POST /auth/logout:
  summary: Invalidate session
  responses:
    "200":
      description: Cookie cleared

GET /auth/me:
  summary: Return current authenticated user profile
  security:
    - cookieAuth: []
  responses:
    "200":
      description: Authenticated user
      content:
        application/json:
          schema:
            type: object
            properties:
              id:
                type: string
                format: uuid
              name:
                type: string
              email:
                type: string
    "401":
      description: Not authenticated
```

### Group Endpoints (new)

```yaml
GET /groups:
  summary: List all groups for the authenticated user
  security:
    - cookieAuth: []
  responses:
    "200":
      description: Groups list
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: "#/components/schemas/GroupSummaryResponse"

GET /groups/{groupId}:
  summary: Get group detail including members
  security:
    - cookieAuth: []
  parameters:
    - $ref: "#/components/parameters/GroupId"
  responses:
    "200":
      description: Group with members
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/GroupDetailResponse"
    "403":
      description: User is not a member
    "404":
      description: Group not found
```

### New Schema Extensions

```yaml
GroupSummaryResponse:
  type: object
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
    currency:
      type: string
    ownerId:
      type: string
      format: uuid
    memberCount:
      type: integer

GroupDetailResponse:
  allOf:
    - $ref: "#/components/schemas/GroupResponse"
    - type: object
      properties:
        members:
          type: array
          items:
            $ref: "#/components/schemas/GroupMemberResponse"

GroupMemberResponse:
  type: object
  properties:
    userId:
      type: string
      format: uuid
    name:
      type: string
    role:
      type: string
      enum: [Owner, Admin, Member]
    status:
      type: string
      enum: [Active, Inactive]
```

---

## Visual Design Contract

### Design Principles

| Principle                  | Implementation                                                           |
| -------------------------- | ------------------------------------------------------------------------ |
| Professional & trustworthy | Dark navy primary (`#0F2B5B`), clean whitespace, no decorative gradients |
| Clear financial signalling | Emerald green for positive balances/credits, red for debts/deficits      |
| Consistent density         | Compact card layout for group lists; readable table layout for history   |
| Mobile-first responsive    | Full functionality at 360px viewport; enhanced layout at 768px+          |

### Colour Tokens

| Token                   | Value     | Usage                                              |
| ----------------------- | --------- | -------------------------------------------------- |
| `--color-primary`       | `#0F2B5B` | Nav, primary buttons, headings                     |
| `--color-primary-light` | `#1E4080` | Button hover, interactive states                   |
| `--color-accent`        | `#059669` | Positive balances, success states, confirm actions |
| `--color-danger`        | `#DC2626` | Negative balances, delete actions, error states    |
| `--color-surface`       | `#F8FAFC` | Page background                                    |
| `--color-card`          | `#FFFFFF` | Card backgrounds                                   |
| `--color-border`        | `#E2E8F0` | Dividers, card borders                             |
| `--color-text-primary`  | `#0F172A` | Body text                                          |
| `--color-text-muted`    | `#64748B` | Secondary text, labels                             |

### Typography

- **Font**: Inter (Google Fonts) — widely used in fintech, excellent legibility
- **Base size**: 16px body, 14px secondary, 12px caption
- **Financial amounts**: tabular-nums font feature for column alignment

### Component Patterns

| Component       | Pattern                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| Forms           | White card, 1px border, 8px radius, label above input                        |
| Balance amounts | `+` prefix green / `-` prefix red, bold, right-aligned                       |
| Status badges   | Pill shape: pending=amber, active=green, revoked/cancelled=gray, expired=red |
| Loading state   | Skeleton placeholders (no spinners on data regions)                          |
| Empty state     | Centred illustration placeholder + primary action CTA                        |
| Error state     | Inline error banner below affected field; toast for mutation errors          |
