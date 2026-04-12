namespace FairShareApp.Backend.Web.Models.Groups;

public sealed record GroupSummary(Guid Id, string Name, string Currency, string Role);

public sealed record GroupMember(Guid Id, string DisplayName, string Role, string Status);

public sealed record CreateGroupRequest(string Name, string Currency);

public sealed record RemoveMemberRequest(Guid MemberId);
