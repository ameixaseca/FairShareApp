using FairShareApp.Backend.Web.Models.Groups;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class GroupsApiClient(FairShareApiClient api)
{
    public async Task<IReadOnlyList<GroupSummary>> GetGroupsAsync(CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<GroupSummary>>("api/groups", cancellationToken) ?? [];
    }

    public Task<GroupSummary?> CreateGroupAsync(CreateGroupRequest request, CancellationToken cancellationToken = default)
    {
        return api.PostAsync<CreateGroupRequest, GroupSummary>("api/groups", request, cancellationToken);
    }

    public async Task<IReadOnlyList<GroupMember>> GetMembersAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<GroupMember>>($"api/groups/{groupId}/members", cancellationToken) ?? [];
    }

    public Task RemoveMemberAsync(Guid groupId, Guid memberId, CancellationToken cancellationToken = default)
    {
        return api.DeleteAsync($"api/groups/{groupId}/members/{memberId}", cancellationToken);
    }
}
