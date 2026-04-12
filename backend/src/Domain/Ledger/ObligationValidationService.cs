namespace FairShareApp.Backend.Domain.Ledger;

public sealed class ObligationValidationService
{
    public void EnsureWithinOutstanding(decimal settlementAmount, decimal outstandingAmount)
    {
        if (settlementAmount > outstandingAmount)
        {
            throw new InvalidOperationException("Settlement amount exceeds outstanding obligation.");
        }
    }
}
