using System.Net;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class ApiErrorHandler
{
    public async Task EnsureSuccessOrThrowAsync(HttpResponseMessage response, CancellationToken cancellationToken = default)
    {
        if (response.IsSuccessStatusCode)
        {
            return;
        }

        var body = response.Content is null
            ? string.Empty
            : await response.Content.ReadAsStringAsync(cancellationToken);

        throw new FairShareApiException(response.StatusCode, body);
    }
}

public sealed class FairShareApiException(HttpStatusCode statusCode, string responseBody)
    : Exception($"API request failed with status {(int)statusCode} ({statusCode}).")
{
    public HttpStatusCode StatusCode { get; } = statusCode;

    public string ResponseBody { get; } = responseBody;
}
