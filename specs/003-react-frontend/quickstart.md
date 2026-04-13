# Quickstart: FairShareApp React SPA

**Feature**: 003-react-frontend  
**Branch**: `003-react-frontend`  
**Date**: 2026-04-12

---

## Prerequisites

| Tool       | Minimum Version | Check                         |
| ---------- | --------------- | ----------------------------- |
| Node.js    | 20 LTS          | `node --version`              |
| npm        | 10+             | `npm --version`               |
| .NET SDK   | 9.0             | `dotnet --version`            |
| PostgreSQL | 15+             | Running locally or via Docker |

---

## Repository Structure (after this feature)

```
FairShareApp/
├── backend/                          # ASP.NET Core solution
│   ├── FairShareApp.Backend.sln
│   └── src/
│       └── Interface/
│           └── Api/                  # Serves React build + REST API
│               └── wwwroot/          # Vite build output (auto-generated, git-ignored)
├── frontend/                         # React SPA (NEW)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── specs/
```

> **Note**: `backend/src/Interface/Web/` (Blazor) and `backend/tests/web/` are removed as part of this feature.

---

## Running the Frontend (Development)

Open two terminals:

**Terminal 1 — Backend API**:

```bash
cd backend
dotnet run --project src/Interface/Api
# API available at https://localhost:5001
```

**Terminal 2 — React Dev Server (with HMR)**:

```bash
cd frontend
npm install
npm run dev
# Dev server at http://localhost:5173
# Proxies /api/* → https://localhost:5001
```

In development, Vite's dev server proxies all `/api` requests to the .NET backend. The React app is served from Vite's dev server at port 5173.

---

## Building for Production (Integrated Mode)

The build outputs directly into `backend/src/Interface/Api/wwwroot/` so the API server serves both.

```bash
cd frontend
npm run build
# Outputs to ../backend/src/Interface/Api/wwwroot/
```

Then run only the backend:

```bash
cd backend
dotnet run --project src/Interface/Api
# Full app (API + React SPA) at https://localhost:5001
```

Navigate to `https://localhost:5001/` — you will see the React landing page served by ASP.NET Core.

---

## Running Tests

**Frontend unit + component tests (Vitest)**:

```bash
cd frontend
npm test
# or: npm run test:watch   (watch mode)
# or: npm run test:coverage
```

**Frontend component-specific tests**:

```bash
# Run only form component tests
npm test -- src/features/auth/components/

# Run with UI debug output
npm test -- --reporter=verbose src/components/inputs.test.tsx
```

**Frontend responsive E2E tests (Playwright)**:

```bash
# Run all E2E tests (includes responsive viewports)
npm run test:e2e

# Run only mobile responsive tests (360px viewport)
npm run test:e2e -- responsive/mobile

# Run with headed browser (see what Playwright sees)
npm run test:e2e -- --headed

# Run and update screenshot baselines
npm run test:e2e -- --update-snapshots

# Generate HTML test report
npm run test:e2e
# Report output: playwright-report/index.html (open in browser)
```

**Responsive viewport verification (during E2E)**:

- Mobile (360px): Full functionality, touch targets ≥44px, no horizontal scroll
- Tablet (768px): 2-column layout, readable tables, optimized card layout
- Desktop (1200px): Full multi-column layout, fine-tuned spacing

**Backend tests**:

```bash
cd backend
dotnet test
```

---

## Environment Configuration

**Frontend development** (`frontend/.env.development`):

```env
VITE_API_BASE_URL=https://localhost:5001
```

**Frontend production** — no env file needed; the SPA calls relative paths (e.g., `/api/groups`) since both are served from the same origin.

**Backend** (`backend/src/Interface/Api/appsettings.Development.json`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=fairshareapp;Username=postgres;Password=postgres"
  }
}
```

---

## Key Frontend Source Locations

| Path                                    | Purpose                                               |
| --------------------------------------- | ----------------------------------------------------- |
| `frontend/src/main.tsx`                 | App entry point, React root mount                     |
| `frontend/src/router.tsx`               | All routes defined via `createBrowserRouter`          |
| `frontend/src/contexts/AuthContext.tsx` | Auth state, `AuthUser`, session restore logic         |
| `frontend/src/services/api/`            | Axios instance + per-domain API service files         |
| `frontend/src/features/`                | Feature-sliced folders (auth, groups, expenses, etc.) |
| `frontend/src/pages/`                   | Top-level page components (route targets)             |
| `frontend/src/components/ui/`           | Shared design system components                       |
| `frontend/tailwind.config.ts`           | Design token definitions (colours, typography)        |

---

## Responsive UI Testing Guide

**When to test**:

- After updating breakpoints in `tailwind.config.ts`
- After adding new pages or components
- Before each release

**Test categories**:

**Mobile (360px)**:

- Full feature set works (no degradation for mobile users)
- Touch targets min 44×44px (WCAG standard)
- No horizontal scroll
- Forms stack vertically (one input per row)
- Modals/drawers fill screen edge-to-edge
- Bottom navigation or hamburger menu for main nav
- Example test:
  ```bash
  npm run test:e2e -- responsive/mobile
  # Validates: home page footer nav clickable, expense form inputs tappable, group list scrolls vertically only
  ```

**Tablet (768px)**:

- Two-column layout for lists (e.g. groups list + group details side-by-side)
- Tables readable (columns don't wrap excessively; use horizontal scroll if needed)
- Forms group logically (2 inputs per row where space allows)
- Navigation drawer converts from bottom sheet → slide-in sidebar
- Example test:
  ```bash
  npm run test:e2e -- responsive/tablet
  # Validates: groups list visible + detail pane visible + scrollable table headers sticky + modals wide enough to read
  ```

**Desktop (1200px)**:

- Three-column layout (e.g. sidebar + list + detail view all visible)
- Modals centered, max-width 600px
- Hover states on interactive elements (e.g. group card background change on hover)
- Keyboard shortcuts documented (e.g. `Escape` to close modal)
- Example test:
  ```bash
  npm run test:e2e -- e2e/responsive
  # Runs all 3 viewports; generates screenshot diff baseline for regression detection
  ```

**Screenshot Regression Testing**:

After implementing responsive layouts, update the screenshot baseline:

```bash
cd frontend
npm run test:e2e -- e2e/responsive --update-snapshots
# Saves 360px, 768px, 1200px screenshots for each page
```

On subsequent runs, Playwright compares live screenshots to baseline:

- If image diff < 0.1% (99.9% match), test passes ✅
- If diff > threshold, test fails ❌ with visual diff in HTML report
- Review diff in `playwright-report/index.html` before approving new screenshots

**Touch Target Verification** (Mobile):

Playwright validates button/input sizes:

```typescript
// Example test: Verify all tappable elements meet WCAG standard
test("mobile: all buttons ≥44px height", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.setViewportSize({ width: 360, height: 640 });

  const buttons = await page.locator("button").all();
  for (const btn of buttons) {
    const box = await btn.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  }
});
```

**No Horizontal Scroll** (All Viewports):

Playwright ensures content fits within viewport:

```typescript
test("no horizontal overflow on 360px", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.setViewportSize({ width: 360, height: 640 });

  // Measure body width — should equal viewport width (360px)
  const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
  expect(bodyWidth).toBeLessThanOrEqual(360);
});
```

---

---

## Component Testing Guide (Vitest + React Testing Library)

**Component test structure** (from data-model.md):

- Form component tests validate input constraints (amount >0, description ≤200 chars)
- Button component tests verify click handlers and loading states
- List component tests check rendering (empty state, pagination)
- Modal component tests validate keyboard traps and focus management
- Layout tests ensure responsive stacking and grid alignment

**Example: Form Input Component Test**:

```typescript
// src/features/expenses/components/__tests__/ExpenseForm.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExpenseForm from '../ExpenseForm';

describe('ExpenseForm', () => {
  it('should disable submit button when amount is zero', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);

    const amountInput = screen.getByLabelText('Amount');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '0');

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  it('should show error when description exceeds 200 chars', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);

    const descInput = screen.getByLabelText('Description');
    const longText = 'a'.repeat(201);
    await userEvent.type(descInput, longText);

    expect(screen.getByText(/max 200 characters/i)).toBeInTheDocument();
  });

  it('should call onSubmit with valid form data', async () => {
    const mockOnSubmit = vi.fn();
    render(<ExpenseForm onSubmit={mockOnSubmit} />);

    await userEvent.type(screen.getByLabelText('Amount'), '50');
    await userEvent.type(screen.getByLabelText('Description'), 'Dinner');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 50, description: 'Dinner' })
    );
  });
});
```

**Example: Button Loading State Test**:

```typescript
// src/components/ui/__tests__/Button.test.tsx
describe('Button', () => {
  it('should show loading spinner when isLoading prop is true', () => {
    const { container } = render(
      <Button isLoading={true}>Save</Button>
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeVisible(); // Hidden by spinner
  });

  it('should call onClick handler on click', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Example: List Rendering with Empty State**:

```typescript
// src/features/groups/components/__tests__/GroupList.test.tsx
describe('GroupList', () => {
  it('should show empty state when no groups', () => {
    render(<GroupList groups={[]} />);

    expect(screen.getByText(/no groups found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create group/i })).toBeInTheDocument();
  });

  it('should render group cards for each group', () => {
    const groups = [
      { id: '1', name: 'Roommates', memberCount: 3 },
      { id: '2', name: 'Road Trip', memberCount: 5 },
    ];

    render(<GroupList groups={groups} />);

    expect(screen.getByText('Roommates')).toBeInTheDocument();
    expect(screen.getByText('Road Trip')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
    expect(screen.getByText('5 members')).toBeInTheDocument();
  });

  it('should paginate groups (10 per page)', async () => {
    const groups = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      name: `Group ${i}`,
      memberCount: 1,
    }));

    render(<GroupList groups={groups} />);

    // First page shows groups 0-9
    expect(screen.getByText('Group 0')).toBeInTheDocument();
    expect(screen.queryByText('Group 10')).not.toBeInTheDocument();

    // Click next page
    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    // Second page shows groups 10-19
    expect(screen.queryByText('Group 0')).not.toBeInTheDocument();
    expect(screen.getByText('Group 10')).toBeInTheDocument();
  });
});
```

**Example: Modal Keyboard & Focus Test**:

```typescript
// src/components/ui/__tests__/Modal.test.tsx
describe('Modal', () => {
  it('should trap focus inside modal', async () => {
    const { container } = render(
      <Modal isOpen={true}>
        <button>First</button>
        <button>Last</button>
      </Modal>
    );

    const firstBtn = screen.getByRole('button', { name: 'First' });
    const lastBtn = screen.getByRole('button', { name: 'Last' });

    // Tab from last button should loop to first
    lastBtn.focus();
    await userEvent.keyboard('{Tab}');
    expect(firstBtn).toHaveFocus();
  });

  it('should close modal on Escape key', async () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  it('should restore focus to trigger button after close', async () => {
    const triggerBtn = <button>Open Modal</button>;
    const { rerender } = render(
      <>
        {triggerBtn}
        <Modal isOpen={true} returnFocus>
          Content
        </Modal>
      </>
    );

    // Close modal
    await userEvent.keyboard('{Escape}');
    rerender(
      <>
        {triggerBtn}
        <Modal isOpen={false} returnFocus>
          Content
        </Modal>
      </>
    );

    expect(screen.getByRole('button', { name: 'Open Modal' })).toHaveFocus();
  });
});
```

**Running Tests with Coverage**:

```bash
cd frontend

# Run all tests with coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html  # macOS
# or
start coverage/index.html  # Windows
```

Coverage targets:

- Statements: ≥80%
- Branches: ≥75%
- Functions: ≥80%
- Lines: ≥80%

---

## Type Checking & Linting

**TypeScript strict mode** (all code must be `strict: true`):

```bash
cd frontend
npm run type-check
# Runs: tsc --noEmit
```

Strict mode enforces:

- Explicit return types on all functions
- No implicit `any` types
- Null/undefined checks (`strictNullChecks`)
- UseDefineForClassFields
- Always Strict

**Linting** (ESLint + Prettier):

```bash
cd frontend

# Show linting errors
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

ESLint rules enforce:

- React best practices (hooks dependencies, key props, etc.)
- No console logs in production code
- No unused variables
- Import ordering

**CI/CD linting checks** (pre-commit hook will run):

```bash
git commit -m "Add new feature"
# Automatically runs: npm run type-check && npm run lint && npm test
```

---

**Add a new page**:

1. Create `frontend/src/pages/MyNewPage.tsx`
2. Register the route in `frontend/src/router.tsx`
3. Add a test in `frontend/src/pages/__tests__/MyNewPage.test.tsx`

**Add a new API call**:

1. Add the function to the relevant service in `frontend/src/services/api/`
2. Create or update a TanStack Query hook in the matching feature folder
3. Add unit test for the hook using `msw` (Mock Service Worker)

**Run a single test file**:

```bash
cd frontend
npm test -- src/features/auth/hooks/useLogin.test.ts
```

---

## Observability Setup

**Development Environment**:

Launch Jaeger locally for trace collection:

```bash
# Using Docker
docker run -d \
  --name jaeger \
  -p 16686:16686 \
  -p 4317:4317 \
  jaegertracing/all-in-one:latest
# Jaeger UI available at http://localhost:16686
```

**OTEL Configuration** (`frontend/.env.development`):

```env
VITE_OTEL_ENABLED=true
VITE_OTEL_JAEGER_ENDPOINT=http://localhost:4317
VITE_OTEL_SAMPLE_RATE=1.0  # 100% sampling in dev
```

**Accessing Telemetry**:

1. **Traces** (Jaeger UI):
   - Navigate to http://localhost:16686
   - Select `fairshare-frontend` service
   - Filter by operation (e.g., `POST /expenses`, `navigate_to_groups`)
   - Inspect span latencies, errors, and context attributes

2. **Metrics** (Prometheus):
   - Metrics exposed at `http://localhost:3000/metrics` (if running Prometheus scraper)
   - Key metrics to monitor:
     - `route_transition_ms` — SPA navigation latency (should be <500ms)
     - `api_call_duration_ms` — HTTP request latency
     - `error_count{status='error'}` — error rate by endpoint

3. **Logs** (Console):
   - All logs output to browser console with context (userId, groupId, requestId)
   - Search using browser console filter (e.g., `userId:abc123`)
   - Production logs exported to centralized backend

**Debugging with Telemetry**:

When a user reports an issue:

1. Get their user ID and timestamp
2. Search Jaeger for spans with that userId + timestamp range
3. Inspect the trace to find the exact operation that failed
4. Check OTEL span attributes for error details and request context
5. Cross-reference with the backend's trace using requestId

---

---

## Development Helpers

**Add a new page**:

1. Create `frontend/src/pages/MyNewPage.tsx`
2. Register the route in `frontend/src/router.tsx`
3. Add a test in `frontend/src/pages/__tests__/MyNewPage.test.tsx`

**Add a new API call**:

1. Add the function to the relevant service in `frontend/src/services/api/`
2. Create or update a TanStack Query hook in the matching feature folder
3. Add unit test for the hook using `msw` (Mock Service Worker)

**Run a single test file**:

```bash
cd frontend
npm test -- src/features/auth/hooks/useLogin.test.ts
```

---

## Troubleshooting

**Port already in use (5173 or 5001)**:

```bash
# Find process using port 5173 (macOS/Linux)
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**CORS errors in browser console**:

- Verify backend is running: `https://localhost:5001/api/health`
- Check `vite.config.ts` proxy configuration for `/api` routes
- Verify JWT cookie is being sent by inspecting DevTools → Application → Cookies

**OTEL/Jaeger traces not appearing**:

- Verify Jaeger container is running: `docker ps | grep jaeger`
- Check Jaeger UI: http://localhost:16686
- Verify `VITE_OTEL_ENABLED=true` in `.env.development`
- Check browser console for OTEL instrumentation errors: `typeof window.__OTEL_TRACEPROVIDER__`

**Tests failing with "Cannot find module" errors**:

```bash
cd frontend
npm install  # Reinstall dependencies
npm run type-check  # Verify TypeScript compilation
```

**E2E tests timeout on slow machine**:

```bash
# Increase timeouts in playwright.config.ts or run with:
npm run test:e2e -- --timeout=60000
```

**Build output not appearing in wwwroot**:

- Verify `vite.config.ts` outDir: `../backend/src/Interface/Api/wwwroot`
- Run build and check output: `npm run build && ls -la ../backend/src/Interface/Api/wwwroot/`
- Backend must have `app.UseStaticFiles()` registered in Startup

---

## Resources & Documentation

- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com)
- [React Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenTelemetry JavaScript SDK](https://opentelemetry.io/docs/instrumentation/js/)
- [Playwright E2E Testing](https://playwright.dev/)

---

## Next Steps

After development:

1. Run full test suite: `npm test && npm run test:e2e`
2. Build for production: `npm run build`
3. Verify backend serves the build: `dotnet run --project src/Interface/Api`
4. Test at `https://localhost:5001/`
5. Clean Blazor references from backend solution (separate task)
