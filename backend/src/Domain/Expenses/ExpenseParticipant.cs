namespace FairShareApp.Backend.Domain.Expenses;

public sealed class ExpenseParticipant
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid ExpenseId { get; init; }
    public Guid UserId { get; init; }
    public bool Included { get; init; }
    public decimal SplitAmount { get; init; }

    public void Validate()
    {
        if (SplitAmount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(SplitAmount), "Split amount cannot be negative.");
        }
    }
}
