namespace FairShareApp.Backend.Web.Services.Caching;

public sealed class ExpenseMutationCacheHandler(CacheInvalidationService invalidationService)
{
    public void HandleMutation(Guid groupId)
    {
        invalidationService.InvalidateGroupScope(groupId);
        invalidationService.InvalidateDashboard(groupId);
    }
}
