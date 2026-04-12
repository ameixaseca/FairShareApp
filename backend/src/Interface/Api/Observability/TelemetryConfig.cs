using Microsoft.Extensions.DependencyInjection;

namespace FairShareApp.Backend.Interface.Api.Observability;

public static class TelemetryConfig
{
    public static IServiceCollection AddTelemetry(this IServiceCollection services)
    {
        // Placeholder for OpenTelemetry wiring during next implementation batch.
        return services;
    }
}
