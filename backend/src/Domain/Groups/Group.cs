namespace FairShareApp.Backend.Domain.Groups;

public sealed class Group
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; private set; }
    public string Currency { get; private set; }
    public Guid OwnerId { get; private set; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;

    public Group(string name, string currency, Guid ownerId)
    {
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Group name is required.", nameof(name)) : name.Trim();
        Currency = string.IsNullOrWhiteSpace(currency) ? throw new ArgumentException("Currency is required.", nameof(currency)) : currency.Trim().ToUpperInvariant();
        OwnerId = ownerId;
    }
}
