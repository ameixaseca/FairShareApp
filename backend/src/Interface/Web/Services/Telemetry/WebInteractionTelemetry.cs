using Microsoft.Extensions.Logging;

namespace FairShareApp.Backend.Web.Services.Telemetry;

public sealed class WebInteractionTelemetry(ILogger<WebInteractionTelemetry> logger)
{
    public void Track(string actionName, Guid? groupId = null)
    {
        logger.LogInformation("Web interaction {ActionName} for Group {GroupId}", actionName, groupId);
    }
}
