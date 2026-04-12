namespace FairShareApp.Backend.Web.Models.Groups;

public sealed record InviteView(Guid Id, string Channel, string Recipient, DateTimeOffset ExpiresAt, string Status);

public sealed record CreateInviteRequest(string Channel, string Recipient, DateTimeOffset ExpiresAt);
