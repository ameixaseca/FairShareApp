namespace FairShareApp.Backend.Application.Ports;

public interface INotificationEventBus
{
    Task PublishAsync<TEvent>(TEvent notificationEvent, CancellationToken cancellationToken = default)
        where TEvent : class;
}
