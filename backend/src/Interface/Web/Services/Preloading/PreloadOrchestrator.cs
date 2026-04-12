using FairShareApp.Backend.Web.Services.ApiClients;

namespace FairShareApp.Backend.Web.Services.Preloading;

public sealed class PreloadOrchestrator(
    GroupsApiClient groupsApiClient,
    BalancesApiClient balancesApiClient,
    InvitesApiClient invitesApiClient)
{
    public async Task PreloadGroupContextAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        await Task.WhenAll(
            groupsApiClient.GetMembersAsync(groupId, cancellationToken),
            balancesApiClient.GetBalancesAsync(groupId, cancellationToken),
            invitesApiClient.GetInvitesAsync(groupId, cancellationToken));
    }

    public async Task PreloadAfterLoginAsync(CancellationToken cancellationToken = default)
    {
        var groups = await groupsApiClient.GetGroupsAsync(cancellationToken);
        var firstGroup = groups.FirstOrDefault();
        if (firstGroup is null)
        {
            return;
        }

        await PreloadGroupContextAsync(firstGroup.Id, cancellationToken);
    }
}
