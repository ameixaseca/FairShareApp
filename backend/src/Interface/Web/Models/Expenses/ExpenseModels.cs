namespace FairShareApp.Backend.Web.Models.Expenses;

public sealed record ExpenseView(Guid Id, string Description, decimal Amount, string PaidBy, DateTimeOffset OccurredAt, bool HasSettlement);

public sealed record CreateExpenseRequest(Guid GroupId, decimal Amount, string Description, Guid PaidByUserId, IReadOnlyList<Guid> ExcludedUserIds);

public sealed record UpdateExpenseRequest(decimal Amount, string Description, IReadOnlyList<Guid> ExcludedUserIds);
