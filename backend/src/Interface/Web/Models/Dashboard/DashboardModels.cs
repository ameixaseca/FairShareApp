namespace FairShareApp.Backend.Web.Models.Dashboard;

public sealed record BalanceView(Guid UserId, string DisplayName, decimal NetBalance);

public sealed record ObligationView(Guid FromUserId, string FromName, Guid ToUserId, string ToName, decimal Amount);

public sealed record LedgerEntryView(Guid Id, string Description, decimal Amount, DateTimeOffset OccurredAt);

public sealed record DashboardViewModel(
    IReadOnlyList<BalanceView> Balances,
    IReadOnlyList<ObligationView> Obligations,
    IReadOnlyList<LedgerEntryView> RecentHistory,
    DateTimeOffset LastRefreshUtc);
