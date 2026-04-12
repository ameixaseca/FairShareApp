<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- New constitution established based on comprehensive development guidelines
- Added 5 core principles: Code Clarity, SOLID Compliance, Test-First Development, Security by Default, Architectural Separation
- Added Mobile Development Standards section for React Native/Expo requirements
- Added Code Quality & Review Process section
- Templates requiring updates:
  ✅ constitution.md (this file)
  ⚠ plan-template.md (requires constitution check validation rules)
  ⚠ spec-template.md (alignment with mandatory sections verified)
  ⚠ tasks-template.md (task categorization alignment pending)
- Follow-up TODOs: Validate template alignment with new constitution principles
-->

# FairShareApp Constitution

## Core Principles

### I. Code Clarity (NON-NEGOTIABLE)

Code is read much more than written - optimize for the reader, not the writer. Prefer obvious and readable solutions over clever and obscure ones. Names, contracts, and intentions must be explicit. Avoid hidden side effects and implicit behavior. Choose consistency over personal preferences.

**Rationale**: Maintainability and team productivity depend on code being immediately understandable by any developer.

### II. SOLID Compliance (NON-NEGOTIABLE)

All code must adhere to SOLID principles without exception. Single Responsibility: each class/module has one reason to change. Open/Closed: open for extension, closed for modification. Liskov Substitution: subtypes must be substitutable for base types. Interface Segregation: no forced dependencies on unused methods. Dependency Inversion: depend on abstractions, not implementations.

**Rationale**: SOLID principles prevent architectural debt and ensure scalable, maintainable codebases that can evolve safely.

### III. Test-First Development (NON-NEGOTIABLE)

Test-Driven Development is mandatory. Tests written → User approved → Tests fail → Implementation begins. Follow Red-Green-Refactor cycle strictly. Tests must be F.I.R.S.T: Fast, Independent, Repeatable, Self-validating, Timely. Use AAA (Arrange, Act, Assert) structure. No production code without corresponding tests.

**Rationale**: TDD ensures correctness, drives better design, and provides safety net for refactoring and evolution.

### IV. Security by Default

Never store secrets in code or repository. Validate and sanitize all external input. Use prepared statements/ORM for queries. Apply principle of least privilege. Maintain updated dependencies. Log security events (access, auth failures, sensitive operations). For mobile apps: use expo-secure-store for tokens, never expose internal details in error messages.

**Rationale**: Security breaches destroy user trust and can be catastrophic. Security cannot be retrofitted - it must be built-in from the start.

### V. Architectural Separation

Maintain clear separation: Domain/Business (pure rules, no infrastructure dependencies) → Application (orchestrates use cases) → Infrastructure (database, APIs, file system) ← Interface (HTTP, CLI, events). Domain never depends on infrastructure. Use interfaces/ports in domain, implement adapters in infrastructure.

**Rationale**: Clean architecture enables testability, maintainability, and technology independence.

## Mobile Development Standards

The mobile app (`mobile/`) using Expo + Expo Router must maintain feature parity with web. Every web functionality must exist in mobile. Use identical design tokens from `mobile/theme.ts`, same visual identity (indigo/gray palette), same icons from `icons.tsx`. Never import server-side modules (`services/`, `lib/prisma.ts`) in mobile code. Always consume REST API via `packages/shared/api-client`. Store JWT tokens in `expo-secure-store` only. Use NativeWind v4 for styling with same Tailwind classes as web.

Deploy via EAS Build (cloud). JS-only updates use EAS Update (OTA). Native changes require new EAS build. Follow Expo Router file-based routing mirroring Next.js App Router structure.

## Code Quality & Review Process

Functions: single responsibility, max 20 lines, max 3 parameters. Classes: focused size, favor composition over inheritance. Comments explain WHY not WHAT. Use conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`). PRs must be small (<400 lines), atomic, and focused. Code review questions design not style. Approval means shared responsibility. Maintain test coverage, follow naming conventions that reveal intent, eliminate code duplication (DRY principle).

Never commit debug code, console.logs, commented code, or credentials. Apply Boy Scout Rule: leave code better than found.

## Governance

This constitution supersedes all other development practices. All feature implementations must pass constitution compliance verification. Principle violations require explicit justification and approval before implementation.

Amendment procedure: proposals must include rationale, impact analysis, and migration plan. Breaking changes require team consensus. Manager approval required for architectural principle modifications.

Version control: MAJOR for backward-incompatible governance changes, MINOR for new principles/sections, PATCH for clarifications and refinements.

**Version**: 1.0.0 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12
