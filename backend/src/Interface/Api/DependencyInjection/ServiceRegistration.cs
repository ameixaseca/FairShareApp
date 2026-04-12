using FairShareApp.Backend.Application.Ports;
using FairShareApp.Backend.Infrastructure.Persistence;
using FairShareApp.Backend.Infrastructure.Persistence.Audit;
using FairShareApp.Backend.Infrastructure.Persistence.Ledger;
using FairShareApp.Backend.Interface.Api.Observability;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FairShareApp.Backend.Interface.Api.DependencyInjection;

public static class ServiceRegistration
{
    public static IServiceCollection AddFairShareServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<FairShareDbContext>(options => options.UseNpgsql(connectionString));
        services.AddScoped<AuditLogWriter>();
        services.AddScoped<ILedgerWriter, LedgerWriter>();
        services.AddTelemetry();
        services.AddSingleton<INotificationEventBus, NoOpNotificationEventBus>();
        return services;
    }

    private sealed class NoOpNotificationEventBus : INotificationEventBus
    {
        public Task PublishAsync<TEvent>(TEvent notificationEvent, CancellationToken cancellationToken = default)
            where TEvent : class
        {
            return Task.CompletedTask;
        }
    }
}
