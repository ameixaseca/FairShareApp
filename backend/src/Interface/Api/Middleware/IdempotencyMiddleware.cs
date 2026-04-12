using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace FairShareApp.Backend.Interface.Api.Middleware;

public sealed class IdempotencyMiddleware
{
    private readonly RequestDelegate _next;

    public IdempotencyMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Request-Id", out StringValues requestId))
        {
            context.Items["idempotency.key"] = requestId.ToString();
        }

        await _next(context);
    }
}
