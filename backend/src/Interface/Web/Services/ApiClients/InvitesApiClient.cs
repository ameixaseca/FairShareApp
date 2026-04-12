using FairShareApp.Backend.Web.Models.Groups;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class InvitesApiClient(FairShareApiClient api)
{
    public async Task<IReadOnlyList<InviteView>> GetInvitesAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<InviteView>>($"api/groups/{groupId}/invites", cancellationToken) ?? [];
    }

    public Task<InviteView?> CreateInviteAsync(Guid groupId, CreateInviteRequest request, CancellationToken cancellationToken = default)
    {
        return api.PostAsync<CreateInviteRequest, InviteView>($"api/groups/{groupId}/invites", request, cancellationToken);
    }

    public Task RevokeInviteAsync(Guid groupId, Guid inviteId, CancellationToken cancellationToken = default)
    {
        return api.DeleteAsync($"api/groups/{groupId}/invites/{inviteId}", cancellationToken);
    }
}
