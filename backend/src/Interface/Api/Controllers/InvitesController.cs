using FairShareApp.Backend.Application.Services;
using FairShareApp.Backend.Application.UseCases.Invites;
using FairShareApp.Backend.Domain.Groups;
using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("groups/{groupId:guid}/invites")]
public sealed class InvitesController : ControllerBase
{
    private readonly CreateInviteUseCase _createInviteUseCase;
    private readonly GroupAuditService _groupAuditService;

    public InvitesController(CreateInviteUseCase createInviteUseCase, GroupAuditService groupAuditService)
    {
        _createInviteUseCase = createInviteUseCase;
        _groupAuditService = groupAuditService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid groupId, [FromBody] CreateInviteRequest request, CancellationToken cancellationToken)
    {
        var invite = _createInviteUseCase.Execute(groupId, request.IssuedByUserId, request.Recipient, request.ExpiresAt);
        await _groupAuditService.LogInviteEventAsync(request.IssuedByUserId, groupId, invite.Id, "InviteCreated", cancellationToken);

        return Created($"/groups/{groupId}/invites/{invite.Id}", new
        {
            invite.Id,
            Status = invite.Status.ToString(),
            invite.ExpiresAt
        });
    }

    [HttpPost("{inviteId:guid}/revoke")]
    public async Task<IActionResult> Revoke(Guid groupId, Guid inviteId, [FromBody] RevokeInviteRequest request, CancellationToken cancellationToken)
    {
        var invite = new Invite(groupId, request.ActorUserId, request.Recipient, DateTimeOffset.UtcNow.AddHours(1));
        invite.Revoke();

        await _groupAuditService.LogInviteEventAsync(request.ActorUserId, groupId, inviteId, "InviteRevoked", cancellationToken);
        return Ok(new { inviteId, Status = invite.Status.ToString() });
    }

    public sealed class CreateInviteRequest
    {
        public Guid IssuedByUserId { get; init; }
        public string Recipient { get; init; } = string.Empty;
        public DateTimeOffset ExpiresAt { get; init; }
    }

    public sealed class RevokeInviteRequest
    {
        public Guid ActorUserId { get; init; }
        public string Recipient { get; init; } = string.Empty;
    }
}
