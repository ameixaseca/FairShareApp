using FairShareApp.Backend.Domain.Groups;

namespace FairShareApp.Backend.Application.UseCases.Invites;

public sealed class AcceptInviteUseCase
{
    public Member Execute(Invite invite, Guid userId)
    {
        if (invite.Status != InviteStatus.Pending)
        {
            throw new InvalidOperationException("Only pending invites can be accepted.");
        }

        if (invite.ExpiresAt <= DateTimeOffset.UtcNow)
        {
            throw new InvalidOperationException("Invite has expired.");
        }

        invite.Accept();

        var member = new Member(invite.GroupId, userId, GroupRole.Member);
        member.Activate();
        return member;
    }
}
