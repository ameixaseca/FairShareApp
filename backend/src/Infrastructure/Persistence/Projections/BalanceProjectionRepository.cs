using FairShareApp.Backend.Application.Ports;
using Microsoft.EntityFrameworkCore;

namespace FairShareApp.Backend.Infrastructure.Persistence.Projections;

public sealed class BalanceProjectionRepository : IBalanceProjectionReader
{
    private readonly FairShareDbContext _dbContext;

    public BalanceProjectionRepository(FairShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<UserBalanceProjection>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        var entries = await _dbContext.LedgerEntries
            .Where(x => x.GroupId == groupId)
            .ToListAsync(cancellationToken);

        var signedByUser = entries
            .SelectMany(entry => new[]
            {
                new { UserId = entry.ToUserId, Delta = entry.Amount, entry.OccurredAt },
                new { UserId = entry.FromUserId, Delta = -entry.Amount, entry.OccurredAt }
            });

        return signedByUser
            .GroupBy(x => x.UserId)
            .Select(group => new UserBalanceProjection(
                group.Key,
                group.Sum(x => x.Delta),
                group.Max(x => x.OccurredAt)))
            .OrderBy(x => x.UserId)
            .ToArray();
    }
}
