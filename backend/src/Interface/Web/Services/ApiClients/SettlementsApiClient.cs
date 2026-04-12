using FairShareApp.Backend.Web.Models.Settlements;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class SettlementsApiClient(FairShareApiClient api)
{
    public Task<SettlementView?> CreateSettlementAsync(CreateSettlementRequest request, CancellationToken cancellationToken = default)
    {
        return api.PostAsync<CreateSettlementRequest, SettlementView>("api/settlements", request, cancellationToken);
    }

    public async Task<IReadOnlyList<SettlementView>> GetSettlementsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<SettlementView>>($"api/settlements?groupId={groupId}", cancellationToken) ?? [];
    }

    public Task<NotificationPreferenceView?> GetPreferencesAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return api.GetAsync<NotificationPreferenceView>($"api/notification-preferences/{groupId}", cancellationToken);
    }

    public Task UpdatePreferencesAsync(Guid groupId, UpdateNotificationPreferenceRequest request, CancellationToken cancellationToken = default)
    {
        return api.PutAsync($"api/notification-preferences/{groupId}", request, cancellationToken);
    }
}
