# Quickstart: Blazor Frontend in Backend Solution

## Goal

Run and validate the new Blazor frontend integrated into the same solution as the API.

## Prerequisites

- .NET SDK installed (version compatible with solution)
- PostgreSQL and Redis available for backend dependencies
- Existing API settings configured in `backend/src/Interface/Api`

## 1. Add and wire the Blazor project

1. Create new project under `backend/src/Interface/Web`.
2. Add project to `backend/FairShareApp.Backend.sln`.
3. Configure typed HttpClient endpoints pointing to API host.
4. Configure auth middleware and role-aware route guards.

## 2. Build solution

```bash
dotnet build backend/FairShareApp.Backend.sln
```

Expected result:

- Build succeeds with API + Web projects in same solution.

## 3. Run API and Web app

1. Start API host.
2. Start Blazor Web host.
3. Open the frontend URL in browser.

Expected result:

- Login page is accessible.
- Authenticated users can navigate group flows.

## 4. Validate critical user journeys

1. Create group and invite members.
2. Register expense with participant exclusion.
3. View updated balances and history.
4. Register partial settlement, then full settlement.
5. Update notification preferences.

Expected result:

- Financial views reflect confirmed operations in up to 5 seconds.
- Unauthorized actions are blocked.

## 5. Validate responsive and visual quality

1. Open the application at mobile, tablet, and desktop breakpoints.
2. Verify dashboard, expense form, and settlement form readability.
3. Verify positive/negative/neutral financial indicators use consistent semantic styling.

Expected result:

- Critical financial values remain visible without layout breakage.
- Interface presents modern, trustworthy financial visual language.

## 6. Validate preloading and intelligent caching

1. Login and measure first transition to group dashboard.
2. Navigate between dashboard, expenses, and settlements repeatedly.
3. Execute a mutation (expense/settlement) and verify related views refresh with invalidated cache.

Expected result:

- Follow-up navigations are faster than cold loads due to preload/cache reuse.
- Post-mutation views do not remain stale beyond allowed projection window.

## 7. Run tests

```bash
dotnet test backend/FairShareApp.Backend.sln -v minimal
```

Expected result:

- Existing tests pass.
- New UI-focused tests (bUnit/Playwright) pass when added.

## Troubleshooting

- If balances appear stale after mutation, verify projection refresh behavior and API availability.
- If auth loops to login, verify cookie/token forwarding and role claims.
- If settlement validation fails unexpectedly, inspect pending obligation read model data.
- If mobile layouts overlap numeric cards, verify breakpoint classes and responsive container widths.
- If navigation is still slow after warm-up, inspect preload triggers and cache hit/miss logs.

## Validation Findings (2026-04-12)

- Solution build completed successfully: `dotnet build backend/FairShareApp.Backend.sln -v minimal`
- Solution tests completed successfully: `dotnet test backend/FairShareApp.Backend.sln -v minimal`
- Implemented Blazor Web project scaffold and route structure under `backend/src/Interface/Web`.
- Added typed API clients, route authorization guard, preloading and cache invalidation services.
- Added responsive financial design token and layout styles in `Styles/Tokens.css` and `Styles/Responsive.css`.
