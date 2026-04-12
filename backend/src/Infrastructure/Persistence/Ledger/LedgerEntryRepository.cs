using FairShareApp.Backend.Application.Ports;
using FairShareApp.Backend.Domain.Ledger;
using Microsoft.EntityFrameworkCore;

namespace FairShareApp.Backend.Infrastructure.Persistence.Ledger;

public sealed class LedgerEntryRepository : ILedgerEntryReader
{
    private readonly FairShareDbContext _dbContext;

    public LedgerEntryRepository(FairShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<LedgerEntry>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.LedgerEntries
            .Where(x => x.GroupId == groupId)
            .OrderByDescending(x => x.OccurredAt)
            .ThenBy(x => x.Id)
            .ToListAsync(cancellationToken);
    }
}