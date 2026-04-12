using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Application.UseCases.Expenses;
using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("expenses")]
public sealed class ExpensesController : ControllerBase
{
    private readonly CreateExpenseUseCase _createExpenseUseCase;
    private readonly ExpenseNotificationService _notificationService;
    private readonly BalanceProjectionUpdater _balanceProjectionUpdater;
    private readonly UpdateExpenseUseCase _updateExpenseUseCase;
    private readonly DeleteExpenseUseCase _deleteExpenseUseCase;
    private readonly SettlementNotificationService _settlementNotificationService;

    public ExpensesController(
        CreateExpenseUseCase createExpenseUseCase,
        ExpenseNotificationService notificationService,
        BalanceProjectionUpdater balanceProjectionUpdater,
        UpdateExpenseUseCase updateExpenseUseCase,
        DeleteExpenseUseCase deleteExpenseUseCase,
        SettlementNotificationService settlementNotificationService)
    {
        _createExpenseUseCase = createExpenseUseCase;
        _notificationService = notificationService;
        _balanceProjectionUpdater = balanceProjectionUpdater;
        _updateExpenseUseCase = updateExpenseUseCase;
        _deleteExpenseUseCase = deleteExpenseUseCase;
        _settlementNotificationService = settlementNotificationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExpenseRequest request, CancellationToken cancellationToken)
    {
        var included = request.IncludedUserIds?.Distinct().ToArray() ?? Array.Empty<Guid>();
        var expense = await _createExpenseUseCase.ExecuteAsync(
            request.GroupId,
            request.PaidByUserId,
            request.Amount,
            request.Description,
            request.RequestId,
            included,
            cancellationToken);

        await _notificationService.PublishExpenseCreatedAsync(request.GroupId, expense.Id, cancellationToken);
        await _balanceProjectionUpdater.UpdateFromExpenseAsync(request.GroupId, expense.Id, cancellationToken);

        return Created($"/expenses/{expense.Id}", new
        {
            expense.Id,
            expense.GroupId,
            expense.Amount,
            expense.Status
        });
    }

    [HttpPatch("{expenseId:guid}")]
    public async Task<IActionResult> Update(Guid expenseId, [FromBody] UpdateExpenseRequest request, CancellationToken cancellationToken)
    {
        await _updateExpenseUseCase.ValidateCanUpdateAsync(expenseId, request.HasLinkedSettlement, cancellationToken);
        await _settlementNotificationService.PublishSettlementChangedAsync(request.GroupId, expenseId, "ExpenseUpdated", cancellationToken);

        return Ok(new
        {
            expenseId,
            request.Amount,
            request.Description,
            Status = "Corrected"
        });
    }

    [HttpDelete("{expenseId:guid}")]
    public async Task<IActionResult> Delete(Guid expenseId, [FromBody] DeleteExpenseRequest request, CancellationToken cancellationToken)
    {
        await _deleteExpenseUseCase.ValidateCanDeleteAsync(expenseId, request.HasLinkedSettlement, cancellationToken);
        await _settlementNotificationService.PublishSettlementChangedAsync(request.GroupId, expenseId, "ExpenseCancelled", cancellationToken);
        return NoContent();
    }

    public sealed class CreateExpenseRequest
    {
        public Guid GroupId { get; init; }
        public Guid PaidByUserId { get; init; }
        public decimal Amount { get; init; }
        public string Description { get; init; } = string.Empty;
        public string RequestId { get; init; } = string.Empty;
        public Guid[]? IncludedUserIds { get; init; }
    }

    public sealed class UpdateExpenseRequest
    {
        public Guid GroupId { get; init; }
        public decimal Amount { get; init; }
        public string Description { get; init; } = string.Empty;
        public bool HasLinkedSettlement { get; init; }
    }

    public sealed class DeleteExpenseRequest
    {
        public Guid GroupId { get; init; }
        public bool HasLinkedSettlement { get; init; }
    }
}
