# FairShareApp.Backend.Tests.Web

This project validates the Blazor Web interface with three complementary test layers:

- Functional tests: validators, cache behavior, API client/error handling.
- Layout tests: responsive CSS breakpoints and semantic style contract checks.
- Integration tests: HTTP host behavior through `WebApplicationFactory<Program>`.

Responsiveness coverage is enforced by asserting:

- Presence of mobile/tablet/desktop media-query breakpoints.
- Usage of responsive layout classes (`fs-grid-2`, `financial-card`) on key pages.
- Sidebar/nav breakpoint behavior contract in `NavMenu.razor.css`.
