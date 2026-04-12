using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace FairShareApp.Backend.Interface.Api.Middleware;

public sealed class JwtAuthMiddleware
{
    private readonly RequestDelegate _next;

    public JwtAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("Authorization", out StringValues authHeader) &&
            authHeader.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            context.Items["auth.valid"] = true;
        }

        await _next(context);
    }
}
