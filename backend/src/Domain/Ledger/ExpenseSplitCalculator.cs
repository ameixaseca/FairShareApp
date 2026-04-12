namespace FairShareApp.Backend.Domain.Ledger;

public sealed class ExpenseSplitCalculator
{
    public IReadOnlyDictionary<Guid, decimal> Calculate(decimal totalAmount, IReadOnlyCollection<Guid> includedUserIds, Guid payerUserId)
    {
        if (totalAmount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(totalAmount));
        }

        var debtors = includedUserIds.Where(id => id != payerUserId).Distinct().ToArray();
        if (debtors.Length == 0)
        {
            return new Dictionary<Guid, decimal>();
        }

        var perUser = decimal.Round(totalAmount / includedUserIds.Count, 2, MidpointRounding.AwayFromZero);
        return debtors.ToDictionary(id => id, _ => perUser);
    }
}
