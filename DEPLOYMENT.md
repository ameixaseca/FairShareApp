# FairShareApp Deployment

## Build Frontend

1. Open terminal in project root.
2. Run:

   cd frontend
   npm install
   npm run build

The frontend build output is configured to emit into backend static assets.

## Build Backend

1. From project root, run:

   cd backend
   dotnet build -c Release

## Run Backend (Release)

1. From `backend` folder, run:

   dotnet run --project src/Interface/Api -c Release

2. Open the app URL shown by the backend host (typically localhost HTTPS endpoint).

## Environment Variables

Frontend and backend expectations:

- VITE_API_BASE_URL
  - Optional for local frontend dev server proxy scenarios.
- VITE_OTEL_ENABLED
  - Enables frontend telemetry initialization.
- VITE_OTEL_SAMPLE_RATE
  - Frontend sampling ratio.
- OTEL_ENDPOINT
  - Optional telemetry exporter endpoint for remote tracing setup.

## Verification Checklist

- Landing page loads.
- User can register and login.
- Group creation works.
- Expense creation updates balance view.
- Settlement creation updates balances and ledger.
- Notification preference updates persist.
- API routes remain functional and non-API routes resolve through SPA fallback.
