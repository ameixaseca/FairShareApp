using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Application.UseCases.Groups;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("groups")]
public sealed class GroupsController : ControllerBase
{
    private static readonly ConcurrentDictionary<Guid, GroupView> Groups = new();

    private readonly CreateGroupUseCase _createGroupUseCase;
    private readonly GroupAuditService _groupAuditService;

    public GroupsController(CreateGroupUseCase createGroupUseCase, GroupAuditService groupAuditService)
    {
        _createGroupUseCase = createGroupUseCase;
        _groupAuditService = groupAuditService;
    }

    [HttpGet]
    public IActionResult List()
    {
        return Ok(Groups.Values.OrderBy(group => group.Name));
    }

    [HttpGet("{groupId:guid}")]
    public IActionResult GetById(Guid groupId)
    {
        if (!Groups.TryGetValue(groupId, out var group))
        {
            return NotFound();
        }

        return Ok(group);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGroupRequest request, CancellationToken cancellationToken)
    {
        var group = _createGroupUseCase.Execute(request.Name, request.Currency, request.OwnerId);
        await _groupAuditService.LogGroupCreatedAsync(request.OwnerId, group.Id, group.Name, cancellationToken);

        var groupView = new GroupView
        {
            Id = group.Id,
            Name = group.Name,
            Currency = group.Currency,
            OwnerId = group.OwnerId,
            Members =
            [
                new GroupMemberView
                {
                    UserId = group.OwnerId,
                    Name = "Owner",
                    Role = "Owner",
                    Status = "Active"
                }
            ]
        };

        Groups[group.Id] = groupView;

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

    public sealed class GroupView
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string Currency { get; init; } = string.Empty;
        public Guid OwnerId { get; init; }
        public IReadOnlyList<GroupMemberView> Members { get; init; } = [];
    }

    public sealed class GroupMemberView
    {
        public Guid UserId { get; init; }
        public string Name { get; init; } = string.Empty;
        public string Role { get; init; } = string.Empty;
        public string Status { get; init; } = string.Empty;
    }
}
