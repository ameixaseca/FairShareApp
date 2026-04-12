namespace FairShareApp.Backend.Domain.Expenses;

public enum ExpenseStatus
{
    Posted,
    Corrected,
    Cancelled
}

public sealed class Expense
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid GroupId { get; init; }
    public Guid PaidByUserId { get; init; }
    public decimal Amount { get; private set; }
    public string Description { get; private set; }
    public string RequestId { get; init; }
    public ExpenseStatus Status { get; private set; } = ExpenseStatus.Posted;

    public Expense(Guid groupId, Guid paidByUserId, decimal amount, string description, string requestId)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Amount must be positive.");
        }

        GroupId = groupId;
        PaidByUserId = paidByUserId;
        Amount = amount;
        Description = string.IsNullOrWhiteSpace(description) ? throw new ArgumentException("Description is required.", nameof(description)) : description.Trim();
        RequestId = string.IsNullOrWhiteSpace(requestId) ? throw new ArgumentException("RequestId is required.", nameof(requestId)) : requestId.Trim();
    }
}
