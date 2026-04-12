using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Interface.Api.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("groups/{groupId:guid}/ledger")]
public sealed class LedgerController : ControllerBase
{
    private readonly LedgerQueryService _ledgerQueryService;

    public LedgerController(LedgerQueryService ledgerQueryService)
    {
        _ledgerQueryService = ledgerQueryService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(Guid groupId, CancellationToken cancellationToken)
    {
        var entries = await _ledgerQueryService.GetLedgerAsync(groupId, cancellationToken);
        var response = entries.Select(LedgerHistoryResponse.FromDomain).ToArray();
        return Ok(response);
    }
}
