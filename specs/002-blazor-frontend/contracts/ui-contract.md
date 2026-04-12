# UI Contract: Blazor Frontend Screens and Interactions

## Purpose

Define the user-facing contract for the Blazor frontend that consumes the FairShare service.

The interface must be responsive, visually modern, and aligned with financial-product expectations of trust, clarity, and rapid access to key numbers.

## Actors

- Owner: creates/manages groups and members
- Admin: operational management in group scope
- Member: records expenses/settlements and views balances

## Screen Contracts

## Visual and Responsiveness Contract

- Responsive requirements:
  - Mobile (>= 360px): all critical values (net balance, pending obligations, action buttons) remain visible without horizontal scroll.
  - Tablet (>= 768px): dual-column layout for summary + actions when available.
  - Desktop (>= 1200px): expanded data table and side context panels.
- Visual style requirements:
  - Modern financial look and feel with clean spacing, strong typographic hierarchy, and high contrast.
  - Semantic color mapping: positive balances, negative balances, neutral totals, and warning/error states must be visually distinct.
  - Numeric values use stable alignment/formatting for fast comparison.

## 1. Authentication

- Routes:
  - `/login`
  - `/logout`
- Capabilities:
  - User starts authenticated session
  - Unauthorized users redirected to login
- Error contract:
  - Invalid credentials show safe message and retry option

## 2. Group List and Creation

- Routes:
  - `/groups`
  - `/groups/new`
- Capabilities:
  - List authorized groups
  - Create new group (name, currency)
- Output contract:
  - Newly created group visible in list immediately

## 3. Group Details Dashboard

- Route:
  - `/groups/{groupId}`
- Capabilities:
  - Show member balances
  - Show who owes whom
  - Show recent history summary
  - Entry point to quick expense form
- Output contract:
  - Projection state shown with last refresh timestamp

## 4. Invite and Member Management

- Routes:
  - `/groups/{groupId}/members`
  - `/groups/{groupId}/invites`
- Capabilities:
  - List members and invite statuses
  - Create invite (link/email, expiry)
  - Revoke pending invite
  - Remove member (role permitting)
- Authorization contract:
  - Non-admin operations return forbidden UI state

## 5. Expense Registration and Maintenance

- Routes:
  - `/groups/{groupId}/expenses/new`
  - `/groups/{groupId}/expenses/{expenseId}/edit`
- Capabilities:
  - Register expense with participant inclusion/exclusion
  - Validate amount/description inputs
  - Edit/delete expense when settlement-free
- Consistency contract:
  - After success, dashboard balances/history refresh within 5 seconds

## 6. Settlement Registration

- Route:
  - `/groups/{groupId}/settlements/new`
- Capabilities:
  - Register partial and full settlements
  - Enforce max settlement amount based on pending obligation
- Output contract:
  - Updated pending amount displayed after success

## 7. Full History and Notification Preferences

- Routes:
  - `/groups/{groupId}/history`
  - `/settings/notifications`
- Capabilities:
  - Display reverse-chronological movement history
  - Configure user notification channels
- Error contract:
  - Preference update failures do not roll back financial operations

## Interaction Rules

- All write actions require explicit user confirmation.
- Validation errors are field-bound and must be actionable.
- Network failures show retry affordance and keep last consistent view.
- API trace identifiers are shown in support-oriented error details.
- Preloading rules:
  - After login and after selecting a group, preload balances, members, and latest history.
  - Before opening create-expense/create-settlement forms, preload participants and outstanding obligations.
- Caching rules:
  - Read views use short-lived cache entries with explicit expiration metadata.
  - Expense/settlement/invite/member mutations invalidate related cache scopes immediately.
  - Cached data cannot suppress manual refresh requested by user.
