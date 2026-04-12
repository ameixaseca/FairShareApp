using FairShareApp.Backend.Domain.Ledger;

namespace FairShareApp.Backend.Interface.Api.Contracts;

public sealed record LedgerHistoryResponse(
    Guid Id,
    Guid FromUserId,
    Guid ToUserId,
    decimal Amount,
    string EntryType,
    DateTimeOffset OccurredAt)
{
    public static LedgerHistoryResponse FromDomain(LedgerEntry entry)
    {
        return new LedgerHistoryResponse(
            entry.Id,
            entry.FromUserId,
            entry.ToUserId,
            entry.Amount,
            entry.EntryType.ToString(),
            entry.OccurredAt);
    }
}
