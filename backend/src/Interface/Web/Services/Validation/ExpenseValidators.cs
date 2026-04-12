namespace FairShareApp.Backend.Web.Services.Validation;

public sealed class ExpenseValidators
{
    public ValidationResult Validate(decimal amount, string description)
    {
        var errors = new List<string>();
        if (amount <= 0)
        {
            errors.Add("Amount must be greater than zero.");
        }

        if (string.IsNullOrWhiteSpace(description) || description.Length > 200)
        {
            errors.Add("Description is required and must be at most 200 characters.");
        }

        return new ValidationResult(errors);
    }
}

public sealed record ValidationResult(IReadOnlyList<string> Errors)
{
    public bool IsValid => Errors.Count == 0;
}
