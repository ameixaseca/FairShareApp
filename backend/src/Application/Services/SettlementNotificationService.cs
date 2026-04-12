using FairShareApp.Backend.Application.Ports;

namespace FairShareApp.Backend.Application.Services;

public sealed class SettlementNotificationService
{
    private readonly INotificationEventBus _eventBus;

    public SettlementNotificationService(INotificationEventBus eventBus)
    {
        _eventBus = eventBus;
    }

    public Task PublishSettlementChangedAsync(Guid groupId, Guid settlementId, string reason, CancellationToken cancellationToken = default)
    {
        return _eventBus.PublishAsync(new SettlementChangedEvent(groupId, settlementId, reason), cancellationToken);
    }

    public sealed record SettlementChangedEvent(Guid GroupId, Guid SettlementId, string Reason);
}
