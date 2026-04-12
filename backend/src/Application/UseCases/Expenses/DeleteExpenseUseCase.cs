namespace FairShareApp.Backend.Application.UseCases.Expenses;

public sealed class DeleteExpenseUseCase
{
    public Task ValidateCanDeleteAsync(Guid expenseId, bool hasLinkedSettlement, CancellationToken cancellationToken = default)
    {
        if (hasLinkedSettlement)
        {
            throw new InvalidOperationException("Expense cannot be deleted after linked settlements exist.");
        }

        return Task.CompletedTask;
    }
}
