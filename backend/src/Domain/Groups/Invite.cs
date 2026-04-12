namespace FairShareApp.Backend.Domain.Groups;

public enum InviteStatus
{
    Pending,
    Accepted,
    Revoked,
    Expired
}

public sealed class Invite
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid GroupId { get; init; }
    public Guid IssuedByUserId { get; init; }
    public string Recipient { get; init; }
    public DateTimeOffset ExpiresAt { get; init; }
    public InviteStatus Status { get; private set; } = InviteStatus.Pending;

    public Invite(Guid groupId, Guid issuedByUserId, string recipient, DateTimeOffset expiresAt)
    {
        GroupId = groupId;
        IssuedByUserId = issuedByUserId;
        Recipient = string.IsNullOrWhiteSpace(recipient) ? throw new ArgumentException("Recipient is required.", nameof(recipient)) : recipient.Trim();
        ExpiresAt = expiresAt;
    }

    public void Revoke() => Status = InviteStatus.Revoked;
    public void Accept() => Status = InviteStatus.Accepted;
}
