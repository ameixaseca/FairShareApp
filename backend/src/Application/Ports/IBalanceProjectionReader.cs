namespace FairShareApp.Backend.Application.Ports;

public interface IBalanceProjectionReader
{
    Task<IReadOnlyList<UserBalanceProjection>> GetByGroupAsync(Guid groupId, CancellationToken cancellationToken = default);
}

public sealed record UserBalanceProjection(Guid UserId, decimal Balance, DateTimeOffset LastEventAt);
