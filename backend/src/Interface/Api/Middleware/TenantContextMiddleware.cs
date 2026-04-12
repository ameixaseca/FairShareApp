using Microsoft.AspNetCore.Http;

namespace FairShareApp.Backend.Interface.Api.Middleware;

public sealed class TenantContextMiddleware
{
    private readonly RequestDelegate _next;

    public TenantContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.RouteValues.TryGetValue("groupId", out var groupId))
        {
            context.Items["tenant.groupId"] = groupId?.ToString();
        }

        await _next(context);
    }
}
