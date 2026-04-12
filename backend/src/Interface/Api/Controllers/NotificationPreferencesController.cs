using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("users/{userId:guid}/notification-preferences")]
public sealed class NotificationPreferencesController : ControllerBase
{
    [HttpPut]
    public IActionResult Update(Guid userId, [FromBody] UpdateNotificationPreferencesRequest request)
    {
        return Ok(new
        {
            userId,
            request.GroupId,
            request.Channels,
            request.IsEnabled
        });
    }

    public sealed class UpdateNotificationPreferencesRequest
    {
        public Guid GroupId { get; init; }
        public string[] Channels { get; init; } = Array.Empty<string>();
        public bool IsEnabled { get; init; } = true;
    }
}
