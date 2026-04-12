using FairShareApp.Backend.Web.Models.Expenses;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class ExpensesApiClient(FairShareApiClient api)
{
    public async Task<IReadOnlyList<ExpenseView>> GetExpensesAsync(Guid groupId, CancellationToken cancellationToken = default)
    {
        return await api.GetAsync<List<ExpenseView>>($"api/expenses?groupId={groupId}", cancellationToken) ?? [];
    }

    public Task<ExpenseView?> CreateExpenseAsync(CreateExpenseRequest request, CancellationToken cancellationToken = default)
    {
        return api.PostAsync<CreateExpenseRequest, ExpenseView>("api/expenses", request, cancellationToken);
    }

    public Task UpdateExpenseAsync(Guid expenseId, UpdateExpenseRequest request, CancellationToken cancellationToken = default)
    {
        return api.PutAsync($"api/expenses/{expenseId}", request, cancellationToken);
    }

    public Task DeleteExpenseAsync(Guid expenseId, CancellationToken cancellationToken = default)
    {
        return api.DeleteAsync($"api/expenses/{expenseId}", cancellationToken);
    }
}
