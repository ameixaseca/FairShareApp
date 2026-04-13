# Research: React SPA Frontend — FairShareApp

**Feature**: 003-react-frontend  
**Branch**: `003-react-frontend`  
**Date**: 2026-04-12

---

## Decision 1: Build Tooling

**Decision**: Vite 5+  
**Rationale**: Vite is the de-facto modern standard for React SPAs. It offers near-instant dev server startup (ESM-native), fast HMR, and produces optimized production bundles. Create React App (CRA) is officially deprecated since 2023.  
**Alternatives considered**:

- CRA — deprecated, slow, not maintained
- Next.js — SSR/SSG framework; overkill for SPA served directly by an existing API server; couples routing to server topology
- Parcel — less ecosystem support, less Tailwind integration

---

## Decision 2: Language

**Decision**: TypeScript 5 (strict mode)  
**Rationale**: Type safety eliminates a class of runtime bugs, improves IDE completion, and aligns with the .NET backend's strong-typing culture. Strict mode enforces null checks and explicit types throughout.  
**Alternatives considered**:

- JavaScript — no type safety; rejected per constitution's code clarity principle

---

## Decision 3: UI Routing

**Decision**: React Router v6 (`createBrowserRouter`)  
**Rationale**: React Router v6 is the standard SPA router for React. `createBrowserRouter` enables data loaders, nested routes, and proper code splitting. HTML5 history API (pushState) requires ASP.NET Core SPA fallback to redirect unrecognized routes to `index.html`.  
**Alternatives considered**:

- TanStack Router — excellent type safety but younger ecosystem; good future option
- Wouter — minimal, no nested routes; insufficient for this feature set
- Hash router — works without server-side fallback config, but produces `/#/groups` URLs (poor UX)

---

## Decision 4: Server State Management

**Decision**: TanStack Query v5 (React Query)  
**Rationale**: Manages all API call lifecycle (loading, error, caching, background revalidation, optimistic updates). Eliminates manual `useEffect`+`useState` data fetching patterns. Query invalidation maps directly to cache invalidation requirements in FR-010. Excellent DevTools for debugging.  
**Alternatives considered**:

- Redux Toolkit Query — more boilerplate, tighter coupling to Redux store
- SWR — less featured (no mutations, manual cache management)
- Raw `useEffect` — violates constitution's SOLID/single responsibility; too much imperative plumbing per component

---

## Decision 5: Client-Side Form Handling

**Decision**: React Hook Form v7 + Zod v3  
**Rationale**: React Hook Form provides uncontrolled form state with minimal re-renders. Zod provides schema-based validation matching the server-side validation rules (amount > 0, description ≤ 200 chars, email format). `zodResolver` integrates both libraries with a single schema definition.  
**Alternatives considered**:

- Formik — more re-renders, slower; largely superseded by RHF in modern projects
- Manual validation — brittle, violates DRY principle

---

## Decision 6: HTTP Client

**Decision**: Axios v1  
**Rationale**: Axios request interceptors allow centralized JWT injection and response interceptors allow uniform 401/403 error handling (auto-redirect to login, error normalization). Supports cancellation tokens for aborting stale requests on route changes.  
**Alternatives considered**:

- Native `fetch` — no interceptor support; repetitive headers/error handling in every call
- ky — interceptor support but smaller ecosystem

---

## Decision 7: Styling

**Decision**: Tailwind CSS v3 with a custom financial design theme  
**Rationale**: Utility-first CSS enables rapid iteration of a consistent, modern financial design without maintaining a separate CSS file per component. Custom tokens (primary color: dark navy `#0F2B5B`, accent: emerald `#059669`, danger: `#DC2626`) are defined in `tailwind.config.js` and shared across all pages — landing, auth, and app. Responsive design is handled by Tailwind breakpoints.  
**Alternatives considered**:

- CSS Modules — verbose for a design system; no shared token layer
- Chakra UI / MUI — good but opinionated; financial app needs precise design control
- styled-components — no purging of unused CSS; larger bundle

---

## Decision 8: Authentication & Token Storage

**Decision**: JWT in React memory (Context) + httpOnly cookie for persistence  
**Rationale**: Storing JWT in `localStorage` exposes it to XSS attacks. Storing in memory only loses the session on page refresh. The recommended pattern: backend `/auth/login` sets a `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict` response header; frontend reads `/auth/me` on app mount to restore session state. The React `AuthContext` holds the decoded user profile; the cookie is transparently sent by the browser on every API request.  
**Impact**: ASP.NET Core `JwtAuthMiddleware` must be updated to read from cookie in addition to (or instead of) the `Authorization: Bearer` header for browser clients.  
**Alternatives considered**:

- localStorage — rejected; XSS vulnerability per constitution Security principle
- sessionStorage — cleared on tab close; poor UX for financial app

---

## Decision 9: Testing Strategy

**Decision**: Vitest + React Testing Library (unit/component) + Playwright (E2E)  
**Rationale**: Vitest is the native test runner for Vite projects (same transform pipeline, no JSDOM config drift). React Testing Library (RTL) tests components from the user's perspective (behavior, not internals) — aligns with constitution's Test-First principle. Playwright enables browser-based E2E for SPA navigation, auth flows, and responsive layout verification.  
**Alternatives considered**:

- Jest — requires Babel config to work with Vite; slower than Vitest
- Cypress — good E2E but heavier than Playwright; slower CI

---

## Decision 10: ASP.NET Core Static File Serving Strategy

**Decision**: Vite builds to a fixed output directory; ASP.NET Core `UseStaticFiles()` + `MapFallbackToFile("index.html")`  
**Rationale**: ASP.NET Core natively serves static files from `wwwroot/` via `UseStaticFiles()`. Configuring Vite's `build.outDir` to `../backend/src/Interface/Api/wwwroot` makes the build pipeline produce deployable artefacts directly consumable by the existing API server with no extra tooling. `MapFallbackToFile("index.html")` routes unresolved requests to the SPA entry point (required for client-side routing).  
**Implementation**:

- `vite.config.ts`: `build.outDir = '../backend/src/Interface/Api/wwwroot'`
- `backend/.../Api/Program.cs`: add `app.UseStaticFiles()` before `app.MapControllers()`; add `app.MapFallbackToFile("index.html")` after `app.MapControllers()`  
  **Alternatives considered**:
- Separate Nginx — adds operational complexity; contradicts FR-020
- Embedded resource serving — non-standard, hard to cache individually

---

## Decision 11: Blazor Removal

**Decision**: Remove `backend/src/Interface/Web/` project and `backend/tests/web/` project; unregister both from `FairShareApp.Backend.sln`  
**Rationale**: FR-020 and the spec assumption explicitly state no dual support; Blazor and React cannot coexist serving from the same `wwwroot/` entry point.  
**Steps**: Delete directories → run `dotnet sln remove` for each project → verify solution builds.

---

## Decision 12: Missing Backend API Endpoints

**Observation**: The existing OpenAPI contract (`specs/001-shared-expense-ledger/contracts/openapi.yaml`) is missing endpoints required by the frontend:

- `POST /auth/register` — create new user account
- `POST /auth/login` — authenticate, set httpOnly JWT cookie
- `POST /auth/logout` — clear session cookie
- `GET /auth/me` — return current authenticated user profile
- `GET /groups` — list all groups for the authenticated user
- `GET /groups/{groupId}` — group detail with members list

## **Decision**: Document these as required API additions in the UI contract. The React frontend will depend on these endpoints. Their implementation is a backend scope item for the same feature branch.

## Decision 13: Frontend Observability

**Decision**: OpenTelemetry (OTEL) SDK + Jaeger/OTLP exporter for tracing, Prometheus client for metrics, structured console logging via `pino`  
**Rationale**: Production React SPAs require visibility into user interactions, performance bottlenecks, and errors. OpenTelemetry is the industry standard for distributed tracing; it integrates with the backend's existing OpenTelemetry hooks (per constitution). Metrics track performance goals (SR-006: ≤3s initial load, SR-007: <500ms transitions). Structured logging via `pino` ensures all messages include request context and are machine-readable.  
**Implementation**:

- **Auto-instrumentation**: `@opentelemetry/instrumentation-fetch` patches all Axios requests with trace spans
- **User interaction tracing**: Manual spans for key page navigation, form submissions, and mutation operations
- **Performance metrics**: Custom histograms for route transition time, API call latency, component render time (via React Profiler API)
- **Error tracking**: All errors logged with stack trace, user context (userId, groupId if applicable), and request idempotency key
- **Export**: Traces → Jaeger (local dev); OTLP exporter for production to centralized backend
- **Sampling**: 100% in development; 10% in production (configurable via `OTEL_TRACES_SAMPLER_ARG`)
- **Redaction**: No sensitive data (passwords, JWT tokens) in log output; httpOnly cookie handled transparently by browser

**Impact**: Minimal bundle size (OTEL SDK ~50KB gzipped); negligible performance overhead with sampling.  
**Alternatives considered**:

- Custom logging library — no integration with backend traces; manual instrumentation everywhere
- Sentry — good for errors but missing distributed tracing; not open-source self-hosted friendly

---

## Decision 14: Component & Responsivity Testing Strategy

**Decision**: Vitest + React Testing Library for unit/component tests; Playwright for responsive E2E tests  
**Rationale**: Component tests use RTL to verify behaviour from user perspective — buttons click, forms validate, lists render. Playwright's `viewportSize` and device emulation enables automated responsive design validation without manual browser resizing. Tests run in CI on multiple viewport sizes (360px mobile, 768px tablet, 1200px desktop) matching design tokens.

**Component Test Coverage**:

- Form inputs: onChange updates state, validation errors display on blur, submit disabled when invalid
- Buttons: click handlers fire, loading state disables button, error state shows retry action
- Lists: empty state shows when no items, items render correctly, pagination works
- Modals/dialogs: open/close handlers work, keyboard trap (Tab/Escape), focus management
- Layout components: responsive grid stacking, media queries activate at breakpoints

**Test Structure (Vitest + RTL)**:

```typescript
// Example: CreateExpenseForm.test.tsx
describe('CreateExpenseForm', () => {
  it('disables submit button when amount is 0', () => {
    render(<CreateExpenseForm onSubmit={vi.fn()} />);
    const amountInput = screen.getByLabelText('Valor');
    const submitBtn = screen.getByRole('button', { name: /registrar/i });

    userEvent.type(amountInput, '0');
    expect(submitBtn).toBeDisabled();
  });

  it('shows validation error when description exceeds 200 chars', async () => {
    render(<CreateExpenseForm onSubmit={vi.fn()} />);
    const descInput = screen.getByLabelText('Descrição');

    userEvent.type(descInput, 'a'.repeat(201));
    userEvent.tab(); // blur

    expect(screen.getByText(/máximo 200/i)).toBeInTheDocument();
  });
});
```

**Responsive E2E Tests (Playwright)**:

```typescript
// Example: groups.spec.ts responsive check
test.describe("Groups page responsiveness", () => {
  ["360", "768", "1200"].forEach((width) => {
    test(`renders correctly at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width: Number(width), height: 800 });
      await page.goto("/groups");

      // Verify layout doesn't overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(Number(width) + 20); // +20px margin

      // Verify touch targets > 44px on mobile
      if (Number(width) < 768) {
        const buttons = await page.locator("button").all();
        for (const btn of buttons) {
          const box = await btn.boundingBox();
          expect(box?.height).toBeGreaterThanOrEqual(44);
          expect(box?.width).toBeGreaterThanOrEqual(44);
        }
      }

      // Verify no visual regression (optional: compare screenshot)
      await expect(page).toHaveScreenshot(`groups-${width}px.png`);
    });
  });
});
```

**CI/CD Integration**:

- Component tests run on every commit (Vitest, <30s)
- Responsive E2E tests run on PR against mobile, tablet, desktop (Playwright, ~2 min)
- Screenshot baselines stored in repo; visual regressions flagged in CI

**Alternatives considered**:

- Cypress — E2E only, no component testing; heavier than Playwright
- Manual visual testing — error-prone, not scalable
- Unit tests only — misses integration bugs and UX issues
