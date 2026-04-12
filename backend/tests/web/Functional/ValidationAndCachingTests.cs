using FairShareApp.Backend.Web.Services.Caching;
using FairShareApp.Backend.Web.Services.Validation;

namespace FairShareApp.Backend.Tests.Web.Functional;

public sealed class ValidationAndCachingTests
{
    [Fact]
    public void ExpenseValidator_ShouldRejectInvalidAmountAndDescription()
    {
        var validator = new ExpenseValidators();

        var result = validator.Validate(0m, string.Empty);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.Contains("greater than zero", StringComparison.OrdinalIgnoreCase));
        Assert.Contains(result.Errors, e => e.Contains("Description", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public void SettlementValidator_ShouldRejectAmountAboveLimit()
    {
        var validator = new SettlementValidators();

        var result = validator.Validate(amount: 150m, maxAllowed: 100m);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.Contains("cannot exceed", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public void ViewCache_ShouldStoreAndRetrieveWithinTtl()
    {
        var cache = new ViewCacheService();

        cache.Set("group:1:dashboard", 42, TimeSpan.FromMinutes(1));

        var found = cache.TryGet<int>("group:1:dashboard", out var value);

        Assert.True(found);
        Assert.Equal(42, value);
    }

    [Fact]
    public void ViewCache_ShouldExpireImmediatelyWithNegativeTtl()
    {
        var cache = new ViewCacheService();

        cache.Set("group:1:dashboard", "old", TimeSpan.FromSeconds(-1));

        var found = cache.TryGet<string>("group:1:dashboard", out _);

        Assert.False(found);
    }

    [Fact]
    public void ViewCache_InvalidationByPrefix_ShouldRemoveGroupScopedEntries()
    {
        var cache = new ViewCacheService();

        cache.Set("group:1:dashboard:balances", 10, TimeSpan.FromMinutes(1));
        cache.Set("group:1:dashboard:obligations", 20, TimeSpan.FromMinutes(1));
        cache.Set("group:2:dashboard:balances", 99, TimeSpan.FromMinutes(1));

        cache.Invalidate("group:1:");

        Assert.False(cache.TryGet<int>("group:1:dashboard:balances", out _));
        Assert.False(cache.TryGet<int>("group:1:dashboard:obligations", out _));
        Assert.True(cache.TryGet<int>("group:2:dashboard:balances", out var remaining));
        Assert.Equal(99, remaining);
    }
}
