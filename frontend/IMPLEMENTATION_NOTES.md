# FairShare React Frontend - Implementation Notes

## Summary

This frontend implements a React SPA for FairShare with authenticated and public experiences, including:

- Public onboarding (landing, register, login)
- Group and invite management
- Expense creation/edit/delete
- Balance and ledger visualization
- Settlement creation and notification preference updates

## Technology Choices

- Vite + React 18 + TypeScript strict mode
  - Fast local development and build output directed to backend static hosting.
- TanStack Query
  - Server-state caching and invalidation for groups, expenses, balances, ledger, settlements, and preferences.
- React Hook Form + Zod
  - Form state and schema-based validation for auth, groups, invites, expenses, and settlements.
- Axios
  - Centralized API access with shared request/response handling.
- Tailwind CSS
  - Utility-first styling and responsive composition with project color tokens.
- Vitest + RTL + Playwright
  - Unit/component and end-to-end coverage.

See `specs/003-react-frontend/research.md` for decision rationale.

## Architecture

The frontend follows page -> hook -> API-service layering:

- Pages in `src/pages`
  - Route-level orchestration, composition of feature components, and navigation.
- Feature hooks in `src/features/**/hooks`
  - Query/mutation logic with cache invalidation.
- API services in `src/services/api`
  - HTTP contracts and payload typing.
- Shared context and UI
  - `src/contexts/AuthContext.tsx`
  - `src/components/ui` and layout/guard components.

## Observability

- Tracing wrappers and log helpers under `src/services/observability`
- Key operations include manual spans and event logs for auth, groups, invites, expenses, balances, ledger, settlements, and notification preferences.

## Known Limitations

- Several pages still rely on simplified group context defaults in places where route context or selector flow can be expanded.
- Some e2e scenarios are currently structural UI checks and can be deepened with richer backend state fixtures.

## Next Steps

- Complete remaining polish tasks in `specs/003-react-frontend/tasks.md` (Phase 8).
- Expand responsive e2e journey coverage across all routes.
- Validate full production run-through against backend static hosting and auth cookie behavior.
