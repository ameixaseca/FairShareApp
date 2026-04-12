using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Application.UseCases.Groups;
using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("groups")]
public sealed class GroupsController : ControllerBase
{
    private readonly CreateGroupUseCase _createGroupUseCase;
    private readonly GroupAuditService _groupAuditService;

    public GroupsController(CreateGroupUseCase createGroupUseCase, GroupAuditService groupAuditService)
    {
        _createGroupUseCase = createGroupUseCase;
        _groupAuditService = groupAuditService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGroupRequest request, CancellationToken cancellationToken)
    {
        var group = _createGroupUseCase.Execute(request.Name, request.Currency, request.OwnerId);
        await _groupAuditService.LogGroupCreatedAsync(request.OwnerId, group.Id, group.Name, cancellationToken);

        return Created($"/groups/{group.Id}", new
        {
            group.Id,
            group.Name,
            group.Currency,
            group.OwnerId
        });
    }

    public sealed class CreateGroupRequest
    {
        public string Name { get; init; } = string.Empty;
        public string Currency { get; init; } = string.Empty;
        public Guid OwnerId { get; init; }
    }
}
