using Microsoft.AspNetCore.Mvc.Testing;

namespace FairShareApp.Backend.Tests.Web.Integration;

public sealed class WebAppIntegrationTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task RootRoute_ShouldReturnSuccessfulHtmlResponse()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        Assert.True(response.IsSuccessStatusCode);
        Assert.Contains("text/html", response.Content.Headers.ContentType?.MediaType ?? string.Empty, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("You must sign in to view this route", html, StringComparison.Ordinal);
    }

    [Fact]
    public async Task GroupsRoute_ShouldRenderAuthGuardForAnonymousUser()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/groups");
        var html = await response.Content.ReadAsStringAsync();

        Assert.True(response.IsSuccessStatusCode);
        Assert.Contains("You must sign in to view this route", html, StringComparison.Ordinal);
    }
}
