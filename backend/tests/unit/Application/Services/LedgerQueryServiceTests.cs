using FairShareApp.Backend.Application.Ports;
using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Domain.Ledger;

namespace FairShareApp.Backend.Tests.Unit.Application.Services;

public sealed class LedgerQueryServiceTests
{
    [Fact]
    public async Task GetLedgerAsync_ShouldReturnReverseChronologicalEntries()
    {
        var groupId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var reader = new StubLedgerEntryReader(new[]
        {
            new LedgerEntry { Id = Guid.NewGuid(), GroupId = groupId, FromUserId = Guid.NewGuid(), ToUserId = Guid.NewGuid(), Amount = 10m, EntryType = LedgerEntryType.ExpenseShare, OccurredAt = now.AddMinutes(-5) },
            new LedgerEntry { Id = Guid.NewGuid(), GroupId = groupId, FromUserId = Guid.NewGuid(), ToUserId = Guid.NewGuid(), Amount = 20m, EntryType = LedgerEntryType.Settlement, OccurredAt = now },
            new LedgerEntry { Id = Guid.NewGuid(), GroupId = groupId, FromUserId = Guid.NewGuid(), ToUserId = Guid.NewGuid(), Amount = 15m, EntryType = LedgerEntryType.ExpenseCorrection, OccurredAt = now.AddMinutes(-1) }
        });

        var service = new LedgerQueryService(new StubBalanceProjectionReader(Array.Empty<UserBalanceProjection>()), reader);

        var result = await service.GetLedgerAsync(groupId);

        Assert.Equal(3, result.Count);
        Assert.True(result[0].OccurredAt >= result[1].OccurredAt);
        Assert.True(result[1].OccurredAt >= result[2].OccurredAt);
    }

    [Fact]
    public async Task GetBalancesAsync_ShouldReturnReaderResultsOrderedByUserId()
    {
        var groupId = Guid.NewGuid();
        var userA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var userB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
        var now = DateTimeOffset.UtcNow;

        var service = new LedgerQueryService(
            new StubBalanceProjectionReader(new[]
            {
                new UserBalanceProjection(userB, 12m, now),
                new UserBalanceProjection(userA, -12m, now)
            }),
            new StubLedgerEntryReader(Array.Empty<LedgerEntry>()));

        var result = await service.GetBalancesAsync(groupId);

        Assert.Equal(2, result.Count);
        Assert.Equal(userA, result[0].UserId);
        Assert.Equal(userB, result[1].UserId);
    }

    private sealed class StubBalanceProjectionReader : IBalanceProjectionReader
    {
        private readonly IReadOnlyList<UserBalanceProjection> _rows;

        public StubBalanceProjectionReader(IReadOnlyList<UserBalanceProjection> rows)
        {
            _rows = rows;
        }

        public Task<IReadOnlyList<UserBalanceProjection>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_rows);
        }
    }

    private sealed class StubLedgerEntryReader : ILedgerEntryReader
    {
        private readonly IReadOnlyList<LedgerEntry> _rows;

        public StubLedgerEntryReader(IReadOnlyList<LedgerEntry> rows)
        {
            _rows = rows;
        }

        public Task<IReadOnlyList<LedgerEntry>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_rows);
        }
    }
}