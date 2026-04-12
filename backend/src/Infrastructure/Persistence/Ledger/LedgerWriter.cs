using FairShareApp.Backend.Domain.Ledger;
using FairShareApp.Backend.Application.Ports;
using FairShareApp.Backend.Infrastructure.Persistence;

namespace FairShareApp.Backend.Infrastructure.Persistence.Ledger;

public sealed class LedgerWriter : ILedgerWriter
{
    private readonly FairShareDbContext _dbContext;

    public LedgerWriter(FairShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task WriteEntriesAsync(IEnumerable<LedgerEntry> entries, CancellationToken cancellationToken = default)
    {
        var normalized = entries.ToArray();
        foreach (var entry in normalized)
        {
            entry.Validate();
        }

        await _dbContext.LedgerEntries.AddRangeAsync(normalized, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
