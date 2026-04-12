namespace FairShareApp.Backend.Web.Services.Auth;

public sealed class AuthorizationViewPolicyService
{
    public bool CanManageMembers(string role) => role is "Owner" or "Admin";

    public bool CanRevokeInvites(string role) => role is "Owner" or "Admin";

    public bool CanEditExpense(string role, bool hasSettlement) => !hasSettlement && role is "Owner" or "Admin";

    public bool CanDeleteExpense(string role, bool hasSettlement) => !hasSettlement && role == "Owner";
}
