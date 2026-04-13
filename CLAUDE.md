# FairShareApp Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

## Active Technologies
- C# on .NET (solution baseline; target .NET 8/9 compatible) + ASP.NET Core Blazor Web App, ASP.NET Core authentication/authorization, typed HttpClient, FluentValidation (or equivalent input validators), OpenTelemetry logging hooks (002-blazor-frontend)
- No direct frontend persistence of financial data; session/auth cookies and transient browser state only (002-blazor-frontend)
- C# on .NET (solution baseline; target .NET 8/9 compatible) + ASP.NET Core Blazor Web App, ASP.NET Core auth/authorization, typed HttpClient, FluentValidation (or equivalent), in-memory/distributed cache adapters, OpenTelemetry hooks (002-blazor-frontend)
- No direct persistence of financial truth in frontend; auth cookies + short-lived UI cache only (002-blazor-frontend)
- TypeScript 5 (strict) + C# .NET 9 (backend, existing) (003-react-frontend)
- No browser persistence of financial data; httpOnly JWT cookie (server-set); TanStack Query in-memory cache only (003-react-frontend)

- C# on .NET (version aligned to project baseline) + ASP.NET Core Web API, EF Core, PostgreSQL provider, Redis client, JWT auth, OpenTelemetry (001-shared-expense-ledger)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for C# on .NET (version aligned to project baseline)

## Code Style

C# on .NET (version aligned to project baseline): Follow standard conventions

## Recent Changes
- 003-react-frontend: Added TypeScript 5 (strict) + C# .NET 9 (backend, existing)
- 002-blazor-frontend: Added C# on .NET (solution baseline; target .NET 8/9 compatible) + ASP.NET Core Blazor Web App, ASP.NET Core auth/authorization, typed HttpClient, FluentValidation (or equivalent), in-memory/distributed cache adapters, OpenTelemetry hooks
- 002-blazor-frontend: Added C# on .NET (solution baseline; target .NET 8/9 compatible) + ASP.NET Core Blazor Web App, ASP.NET Core authentication/authorization, typed HttpClient, FluentValidation (or equivalent input validators), OpenTelemetry logging hooks


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
