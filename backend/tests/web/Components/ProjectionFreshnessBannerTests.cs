using Bunit;
using FairShareApp.Backend.Web.Components.Dashboard;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace FairShareApp.Backend.Tests.Web.Components;

public sealed class ProjectionFreshnessBannerTests : TestContext
{
    [Fact]
    public void Banner_ShouldShowWarningClass_WhenProjectionIsStale()
    {
        var cut = RenderComponent<ProjectionFreshnessBanner>(parameters => parameters
            .Add(p => p.LastProjectionUtc, DateTimeOffset.UtcNow.AddSeconds(-30))
            .Add(p => p.OnRefresh, EventCallback.Factory.Create(this, () => Task.CompletedTask)));

        var wrapper = cut.Find("div.fs-callout");

        Assert.Contains("fs-callout-warning", wrapper.ClassList);
    }

    [Fact]
    public async Task Banner_ShouldInvokeRefreshCallback_WhenUserClicksRefresh()
    {
        var clicked = false;

        var cut = RenderComponent<ProjectionFreshnessBanner>(parameters => parameters
            .Add(p => p.LastProjectionUtc, DateTimeOffset.UtcNow)
            .Add(p => p.OnRefresh, EventCallback.Factory.Create(this, () =>
            {
                clicked = true;
                return Task.CompletedTask;
            })));

        await cut.Find("button").ClickAsync(new MouseEventArgs());

        Assert.True(clicked);
    }
}
