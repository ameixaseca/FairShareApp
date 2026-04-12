using FairShareApp.Backend.Domain.Expenses;
using FairShareApp.Backend.Domain.Ledger;
using FairShareApp.Backend.Application.Ports;

namespace FairShareApp.Backend.Application.UseCases.Expenses;

public sealed class CreateExpenseUseCase
{
    private readonly ExpenseSplitCalculator _splitCalculator;
    private readonly ILedgerWriter _ledgerWriter;

    public CreateExpenseUseCase(ExpenseSplitCalculator splitCalculator, ILedgerWriter ledgerWriter)
    {
        _splitCalculator = splitCalculator;
        _ledgerWriter = ledgerWriter;
    }

    public async Task<Expense> ExecuteAsync(Guid groupId, Guid paidByUserId, decimal amount, string description, string requestId, IReadOnlyCollection<Guid> includedUserIds, CancellationToken cancellationToken = default)
    {
        var expense = new Expense(groupId, paidByUserId, amount, description, requestId);
        var split = _splitCalculator.Calculate(amount, includedUserIds, paidByUserId);

        var ledgerEntries = split.Select(item => new LedgerEntry
        {
            GroupId = groupId,
            FromUserId = item.Key,
            ToUserId = paidByUserId,
            Amount = item.Value,
            EntryType = LedgerEntryType.ExpenseShare,
            OccurredAt = DateTimeOffset.UtcNow
        });

        await _ledgerWriter.WriteEntriesAsync(ledgerEntries, cancellationToken);
        return expense;
    }
}
