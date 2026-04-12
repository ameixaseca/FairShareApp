namespace FairShareApp.Backend.Web.Services.Validation;

public sealed class SettlementValidators
{
    public ValidationResult Validate(decimal amount, decimal maxAllowed)
    {
        var errors = new List<string>();
        if (amount <= 0)
        {
            errors.Add("Settlement amount must be greater than zero.");
        }

        if (amount > maxAllowed)
        {
            errors.Add("Settlement amount cannot exceed pending obligation.");
        }

        return new ValidationResult(errors);
    }
}
