using FairShareApp.Backend.Domain.Ledger;

namespace FairShareApp.Backend.Application.Ports;

public interface ILedgerWriter
{
    Task WriteEntriesAsync(IEnumerable<LedgerEntry> entries, CancellationToken cancellationToken = default);
}
