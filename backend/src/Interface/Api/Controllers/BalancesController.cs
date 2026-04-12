using FairShareApp.Backend.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("groups/{groupId:guid}/balance")]
public sealed class BalancesController : ControllerBase
{
    private readonly LedgerQueryService _ledgerQueryService;

    public BalancesController(LedgerQueryService ledgerQueryService)
    {
        _ledgerQueryService = ledgerQueryService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(Guid groupId, CancellationToken cancellationToken)
    {
        var balances = await _ledgerQueryService.GetBalancesAsync(groupId, cancellationToken);
        return Ok(new { groupId, balances });
    }
}
