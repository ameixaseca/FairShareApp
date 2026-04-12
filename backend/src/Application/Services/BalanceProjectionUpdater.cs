namespace FairShareApp.Backend.Application.Services;

public sealed class BalanceProjectionUpdater
{
    public Task UpdateFromExpenseAsync(Guid groupId, Guid expenseId, CancellationToken cancellationToken = default)
    {
        // Placeholder for projection update flow (event-driven or synchronous in MVP).
        return Task.CompletedTask;
    }
}
