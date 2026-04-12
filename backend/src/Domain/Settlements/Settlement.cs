namespace FairShareApp.Backend.Domain.Settlements;

public enum SettlementStatus
{
    Posted,
    Reversed
}

public sealed class Settlement
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid GroupId { get; init; }
    public Guid FromUserId { get; init; }
    public Guid ToUserId { get; init; }
    public decimal Amount { get; init; }
    public string RequestId { get; init; }
    public SettlementStatus Status { get; private set; } = SettlementStatus.Posted;

    public Settlement(Guid groupId, Guid fromUserId, Guid toUserId, decimal amount, string requestId)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Settlement amount must be positive.");
        }

        GroupId = groupId;
        FromUserId = fromUserId;
        ToUserId = toUserId;
        Amount = amount;
        RequestId = string.IsNullOrWhiteSpace(requestId) ? throw new ArgumentException("RequestId is required.", nameof(requestId)) : requestId.Trim();
    }
}
