namespace FairShareApp.Backend.Infrastructure.Persistence.Projections;

public sealed class BalanceProjectionRepository
{
    public Task<IReadOnlyList<UserBalanceProjection>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        IReadOnlyList<UserBalanceProjection> result = new List<UserBalanceProjection>();
        return Task.FromResult(result);
    }

    public sealed record UserBalanceProjection(Guid UserId, decimal Balance, DateTimeOffset LastEventAt);
}
