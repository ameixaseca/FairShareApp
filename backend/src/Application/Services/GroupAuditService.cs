namespace FairShareApp.Backend.Application.Services;

public sealed class GroupAuditService
{
    public Task LogGroupCreatedAsync(Guid actorUserId, Guid groupId, string groupName, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    public Task LogInviteEventAsync(Guid actorUserId, Guid groupId, Guid inviteId, string action, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
