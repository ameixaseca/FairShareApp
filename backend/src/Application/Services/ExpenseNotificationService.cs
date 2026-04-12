using FairShareApp.Backend.Application.Ports;

namespace FairShareApp.Backend.Application.Services;

public sealed class ExpenseNotificationService
{
    private readonly INotificationEventBus _eventBus;

    public ExpenseNotificationService(INotificationEventBus eventBus)
    {
        _eventBus = eventBus;
    }

    public Task PublishExpenseCreatedAsync(Guid groupId, Guid expenseId, CancellationToken cancellationToken = default)
    {
        return _eventBus.PublishAsync(new ExpenseCreatedEvent(groupId, expenseId), cancellationToken);
    }

    public sealed record ExpenseCreatedEvent(Guid GroupId, Guid ExpenseId);
}
