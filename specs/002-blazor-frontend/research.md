# Research: Blazor Frontend for FairShare Service

## Context

This research resolves technical choices for implementing a Blazor frontend in the same .NET solution while respecting:

- `specs/002-blazor-frontend/spec.md`
- `.docs/Especificacao Tecnica.md`
- `.specify/memory/constitution.md`

## Decision 1: Host model as Blazor Web App inside backend solution

- Decision: Add a server-hosted Blazor Web project under `backend/src/Interface/Web` and include it in `FairShareApp.Backend.sln`.
- Rationale: Meets explicit requirement to keep frontend in the same solution; simplifies deployment and shared auth/session handling with API ecosystem.
- Alternatives considered:
  - Separate SPA repository: easier independent release, but violates same-solution requirement.
  - Blazor WebAssembly standalone: higher client complexity and duplicate auth token orchestration.

## Decision 2: Frontend talks only to API contracts, not domain internals

- Decision: Use typed HttpClient services in Blazor to consume existing API endpoints for groups, invites, expenses, settlements, balances, and history.
- Rationale: Preserves clean architecture and keeps ledger/business invariants centralized in backend.
- Alternatives considered:
  - Direct project reference from UI to Application handlers: tighter coupling and bypass of API contract checks.
  - UI-side business rule reimplementation: high risk of divergence from financial invariants.

## Decision 3: UI consistency strategy aligned with eventual read model

- Decision: After write actions (expense/settlement/edit/delete), refresh balance and history views with optimistic UX feedback and bounded polling/reload up to 5 seconds.
- Rationale: Matches `.docs` guidance of strong write consistency + eventual read consistency and NFR read-projection SLA.
- Alternatives considered:
  - Immediate hard assumption of read consistency: can display stale balances and confuse users.
  - Continuous aggressive polling: unnecessary load and noisy UX.

## Decision 4: AuthN/AuthZ model in UI

- Decision: Reuse backend authentication flows and enforce role-aware UI controls (owner/admin/member), while API remains source of authorization truth.
- Rationale: Improves UX by hiding forbidden actions and prevents accidental unauthorized attempts; still secure because API enforces rules.
- Alternatives considered:
  - API-only enforcement with no UI role awareness: secure but poor usability and higher failed action rate.
  - UI-only enforcement: insecure and non-compliant.

## Decision 5: Form validation and guardrails

- Decision: Add shared validation layer in UI services/components for required fields and value ranges before API call, mirroring backend constraints.
- Rationale: Reduces invalid requests, improves speed of correction, and supports FR edge cases (zero/negative values, over-settlement).
- Alternatives considered:
  - Validation only on server responses: slower corrective cycle and poor user experience.
  - Heavy client-only validation with relaxed server checks: unacceptable for financial operations.

## Decision 6: Testing strategy for constitution compliance

- Decision: Use bUnit for component and page behavior tests, keep xUnit for service/adaptor tests, and add Playwright journeys for end-to-end business flows.
- Rationale: Supports TDD and AAA structure while validating both component logic and complete user scenarios from spec.
- Alternatives considered:
  - Unit tests only: insufficient confidence on real navigation/forms.
  - E2E-only strategy: slower feedback and weaker isolation for regressions.

## Decision 7: Observability and failure transparency in UI

- Decision: Surface correlation/trace ids from API errors in user-safe format and log structured UI action outcomes for diagnostics.
- Rationale: Aligns with `.docs` observability requirements and accelerates incident triage without exposing sensitive internals.
- Alternatives considered:
  - Generic opaque errors only: simpler but hinders support operations.
  - Verbose raw exception dumps: security and usability risk.

## Decision 8: Responsive-first layout and breakpoint behavior

- Decision: Adopt responsive-first page composition (mobile-first breakpoints with adaptive information density for tablet and desktop).
- Rationale: Users will access financial status in multiple contexts; responsive layout prevents loss of critical debt/balance visibility on smaller devices.
- Alternatives considered:
  - Desktop-only layout: faster initial delivery, but poor usability and high task failure on mobile.
  - Separate mobile web code path: more flexibility, but duplicated maintenance cost.

## Decision 9: Modern visual language aligned with financial trust

- Decision: Define a modern financial design system with clear hierarchy, high-contrast typography, card-based summaries, and semantically consistent color usage for credit/debit/neutral states.
- Rationale: Financial products depend on perceived trust and readability; visual clarity reduces interpretation errors in balances and obligations.
- Alternatives considered:
  - Generic default component styling: minimal effort, but weak brand/credibility perception.
  - Highly decorative visual style: strong identity, but risk of reduced legibility for numeric data.

## Decision 10: Preloading strategy for likely-next actions

- Decision: Preload essential datasets and route resources after login and after group context selection (members, balances, recent history, pending invites) based on likely user next steps.
- Rationale: Reduces time-to-interaction and improves perceived speed for high-frequency actions like expense registration and dashboard review.
- Alternatives considered:
  - On-demand loading only: lower initial requests, but repeated delays between routine screens.
  - Full eager loading of all group data: faster navigation, but unnecessary payload and slower first render.

## Decision 11: Intelligent caching and invalidation policy

- Decision: Implement cache-aside in UI services with short TTLs per read model plus event-driven invalidation after successful write operations.
- Rationale: Aligns with technical doc guidance, reduces redundant API calls, and preserves financial correctness by forcing refresh on mutation boundaries.
- Alternatives considered:
  - Long-lived cache without invalidation: best latency, unacceptable stale financial data risk.
  - No caching: strongest freshness, poorer scalability and user experience.
