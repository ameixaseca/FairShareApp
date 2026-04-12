using FairShareApp.Backend.Web.Models.Dashboard;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class BalancesApiClient(FairShareApiClient api)
{
    public async Task<IReadOnlyList<BalanceView>> GetBalancesAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<BalanceView>>($"api/balances/{groupId}", cancellationToken) ?? [];
    }

    public async Task<IReadOnlyList<ObligationView>> GetObligationsAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<ObligationView>>($"api/balances/{groupId}/obligations", cancellationToken) ?? [];
    }

    public async Task<IReadOnlyList<LedgerEntryView>> GetHistoryAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<LedgerEntryView>>($"api/ledger/{groupId}", cancellationToken) ?? [];
    }
}
