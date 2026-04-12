namespace FairShareApp.Backend.Domain.Ledger;

public enum LedgerEntryType
{
    ExpenseShare,
    Settlement,
    ExpenseCorrection,
    ExpenseCancellation
}

public sealed class LedgerEntry
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid GroupId { get; init; }
    public Guid FromUserId { get; init; }
    public Guid ToUserId { get; init; }
    public decimal Amount { get; init; }
    public LedgerEntryType EntryType { get; init; }
    public DateTimeOffset OccurredAt { get; init; } = DateTimeOffset.UtcNow;

    public void Validate()
    {
        if (Amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(Amount), "Ledger amount must be positive.");
        }
    }
}
