namespace FairShareApp.Backend.Web.Services.Caching;

public sealed class CacheInvalidationService(ViewCacheService cache)
{
    public void InvalidateGroupScope(Guid groupId)
    {
        cache.Invalidate($"group:{groupId}:");
    }

    public void InvalidateDashboard(Guid groupId)
    {
        cache.Invalidate($"group:{groupId}:dashboard");
    }
}
