using Microsoft.Extensions.Logging;

namespace FairShareApp.Backend.Infrastructure.Persistence.Audit;

public sealed class AuditLogWriter
{
    private readonly ILogger<AuditLogWriter> _logger;

    public AuditLogWriter(ILogger<AuditLogWriter> logger)
    {
        _logger = logger;
    }

    public Task WriteAsync(string actionType, Guid actorUserId, Guid groupId, object payload, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Audit event {ActionType} by {ActorUserId} in group {GroupId}: {@Payload}",
            actionType,
            actorUserId,
            groupId,
            payload);

        return Task.CompletedTask;
    }
}
