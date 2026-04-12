using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Application.UseCases.Settlements;
using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("settlements")]
public sealed class SettlementsController : ControllerBase
{
    private readonly CreateSettlementUseCase _createSettlementUseCase;
    private readonly SettlementNotificationService _notificationService;

    public SettlementsController(CreateSettlementUseCase createSettlementUseCase, SettlementNotificationService notificationService)
    {
        _createSettlementUseCase = createSettlementUseCase;
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSettlementRequest request, CancellationToken cancellationToken)
    {
        var settlement = await _createSettlementUseCase.ExecuteAsync(
            request.GroupId,
            request.FromUserId,
            request.ToUserId,
            request.Amount,
            request.RequestId,
            request.OutstandingAmount,
            cancellationToken);

        await _notificationService.PublishSettlementChangedAsync(request.GroupId, settlement.Id, "SettlementCreated", cancellationToken);

        return Created($"/settlements/{settlement.Id}", new
        {
            settlement.Id,
            settlement.GroupId,
            settlement.Amount,
            settlement.Status
        });
    }

    public sealed class CreateSettlementRequest
    {
        public Guid GroupId { get; init; }
        public Guid FromUserId { get; init; }
        public Guid ToUserId { get; init; }
        public decimal Amount { get; init; }
        public string RequestId { get; init; } = string.Empty;
        public decimal OutstandingAmount { get; init; }
    }
}
