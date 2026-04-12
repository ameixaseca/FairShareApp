using FairShareApp.Backend.Application.Ports;
using FairShareApp.Backend.Domain.Ledger;

namespace FairShareApp.Backend.Application.Services;

public sealed class LedgerQueryService
{
    private readonly IBalanceProjectionReader _balanceProjectionReader;
    private readonly ILedgerEntryReader _ledgerEntryReader;

    public LedgerQueryService(IBalanceProjectionReader balanceProjectionReader, ILedgerEntryReader ledgerEntryReader)
    {
        _balanceProjectionReader = balanceProjectionReader;
        _ledgerEntryReader = ledgerEntryReader;
    }

    public async Task<IReadOnlyList<UserBalanceProjection>> GetBalancesAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        var result = await _balanceProjectionReader.GetByGroupAsync(groupId, cancellationToken);
        return result.OrderBy(x => x.UserId).ToArray();
    }

    public async Task<IReadOnlyList<LedgerEntry>> GetLedgerAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        var result = await _ledgerEntryReader.GetByGroupAsync(groupId, cancellationToken);
        return result
            .OrderByDescending(x => x.OccurredAt)
            .ThenBy(x => x.Id)
            .ToArray();
    }
}
