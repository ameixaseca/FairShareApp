using FairShareApp.Backend.Domain.Ledger;

namespace FairShareApp.Backend.Application.Ports;

public interface ILedgerEntryReader
{
    Task<IReadOnlyList<LedgerEntry>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default);
}
