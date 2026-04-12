using FairShareApp.Backend.Domain.Groups;

namespace FairShareApp.Backend.Application.UseCases.Invites;

public sealed class CreateInviteUseCase
{
    public Invite Execute(Guid groupId, Guid issuedByUserId, string recipient, DateTimeOffset expiresAt)
    {
        if (expiresAt <= DateTimeOffset.UtcNow)
        {
            throw new ArgumentException("Invite expiration must be in the future.", nameof(expiresAt));
        }

        return new Invite(groupId, issuedByUserId, recipient, expiresAt);
    }
}
