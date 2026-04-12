namespace FairShareApp.Backend.Application.UseCases.Expenses;

public sealed class UpdateExpenseUseCase
{
    public Task ValidateCanUpdateAsync(Guid expenseId, bool hasLinkedSettlement, CancellationToken cancellationToken = default)
    {
        if (hasLinkedSettlement)
        {
            throw new InvalidOperationException("Expense cannot be updated after linked settlements exist.");
        }

        return Task.CompletedTask;
    }
}
