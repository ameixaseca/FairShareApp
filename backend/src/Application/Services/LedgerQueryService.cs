using FairShareApp.Backend.Domain.Ledger;

namespace FairShareApp.Backend.Application.Services;

public sealed class LedgerQueryService
{
    public Task<IReadOnlyList<UserBalanceProjection>> GetBalancesAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        IReadOnlyList<UserBalanceProjection> result = new List<UserBalanceProjection>();
        return Task.FromResult(result);
    }

    public Task<IReadOnlyList<LedgerEntry>> GetLedgerAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        IReadOnlyList<LedgerEntry> result = new List<LedgerEntry>();
        return Task.FromResult(result);
    }

    public sealed record UserBalanceProjection(Guid UserId, decimal Balance, DateTimeOffset LastEventAt);
}
