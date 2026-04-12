using FairShareApp.Backend.Web.Services.ApiClients;

namespace FairShareApp.Backend.Web.Services.Preloading;

public sealed class ExpensePreloadService(GroupsApiClient groupsApiClient, BalancesApiClient balancesApiClient)
{
    public async Task PreloadExpenseFormAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        await Task.WhenAll(
            groupsApiClient.GetMembersAsync(groupId, cancellationToken),
            balancesApiClient.GetObligationsAsync(groupId, cancellationToken));
    }
}
