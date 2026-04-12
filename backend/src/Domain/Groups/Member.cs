namespace FairShareApp.Backend.Domain.Groups;

public enum GroupRole
{
    Owner,
    Admin,
    Member
}

public enum MemberStatus
{
    Pending,
    Active,
    Inactive,
    Removed
}

public sealed class Member
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid GroupId { get; init; }
    public Guid UserId { get; init; }
    public GroupRole Role { get; private set; }
    public MemberStatus Status { get; private set; }

    public Member(Guid groupId, Guid userId, GroupRole role)
    {
        GroupId = groupId;
        UserId = userId;
        Role = role;
        Status = MemberStatus.Pending;
    }

    public void Activate() => Status = MemberStatus.Active;
}
