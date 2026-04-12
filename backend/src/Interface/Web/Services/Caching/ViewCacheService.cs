namespace FairShareApp.Backend.Web.Services.Caching;

public sealed class ViewCacheService
{
    private readonly Dictionary<string, CacheEntry> _cache = new();

    public bool TryGet<T>(string key, out T? value)
    {
        if (_cache.TryGetValue(key, out var entry) && entry.ExpiresAt > DateTimeOffset.UtcNow)
        {
            value = (T?)entry.Value;
            return true;
        }

        value = default;
        return false;
    }

    public void Set<T>(string key, T value, TimeSpan ttl)
    {
        _cache[key] = new CacheEntry(value, DateTimeOffset.UtcNow.Add(ttl));
    }

    public void Invalidate(string keyPrefix)
    {
        var keys = _cache.Keys.Where(static k => k.Length > 0).ToArray();
        foreach (var key in keys)
        {
            if (key.StartsWith(keyPrefix, StringComparison.OrdinalIgnoreCase))
            {
                _cache.Remove(key);
            }
        }
    }

    private sealed record CacheEntry(object? Value, DateTimeOffset ExpiresAt);
}
