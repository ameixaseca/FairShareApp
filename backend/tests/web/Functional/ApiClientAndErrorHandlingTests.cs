using System.Net;
using System.Net.Http.Json;
using FairShareApp.Backend.Web.Services.ApiClients;

namespace FairShareApp.Backend.Tests.Web.Functional;

public sealed class ApiClientAndErrorHandlingTests
{
    [Fact]
    public async Task ApiErrorHandler_ShouldThrowFairShareApiException_OnFailureStatus()
    {
        var handler = new ApiErrorHandler();
        var response = new HttpResponseMessage(HttpStatusCode.BadRequest)
        {
            Content = new StringContent("validation failed")
        };

        var ex = await Assert.ThrowsAsync<FairShareApiException>(() => handler.EnsureSuccessOrThrowAsync(response));

        Assert.Equal(HttpStatusCode.BadRequest, ex.StatusCode);
        Assert.Contains("validation failed", ex.ResponseBody, StringComparison.Ordinal);
    }

    [Fact]
    public async Task FairShareApiClient_GetAsync_ShouldDeserializePayload()
    {
        var fake = new FakeHttpMessageHandler(_ =>
            new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(new SampleResponse("ok"))
            });

        var http = new HttpClient(fake)
        {
            BaseAddress = new Uri("https://localhost")
        };

        var client = new FairShareApiClient(http, new ApiErrorHandler());

        var payload = await client.GetAsync<SampleResponse>("api/health");

        Assert.NotNull(payload);
        Assert.Equal("ok", payload!.Status);
    }

    private sealed record SampleResponse(string Status);

    private sealed class FakeHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responseFactory) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return Task.FromResult(responseFactory(request));
        }
    }
}
