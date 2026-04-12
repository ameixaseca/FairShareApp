using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace FairShareApp.Backend.Web.Services.ApiClients;

public sealed class FairShareApiClient(HttpClient httpClient, ApiErrorHandler apiErrorHandler)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<T?> GetAsync<T>(string path, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.GetAsync(path, cancellationToken);
        await apiErrorHandler.EnsureSuccessOrThrowAsync(response, cancellationToken);
        return await response.Content.ReadFromJsonAsync<T>(JsonOptions, cancellationToken);
    }

    public async Task<TResponse?> PostAsync<TRequest, TResponse>(string path, TRequest request, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.PostAsJsonAsync(path, request, JsonOptions, cancellationToken);
        await apiErrorHandler.EnsureSuccessOrThrowAsync(response, cancellationToken);
        return await response.Content.ReadFromJsonAsync<TResponse>(JsonOptions, cancellationToken);
    }

    public async Task PutAsync<TRequest>(string path, TRequest request, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.PutAsJsonAsync(path, request, JsonOptions, cancellationToken);
        await apiErrorHandler.EnsureSuccessOrThrowAsync(response, cancellationToken);
    }

    public async Task DeleteAsync(string path, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.DeleteAsync(path, cancellationToken);
        await apiErrorHandler.EnsureSuccessOrThrowAsync(response, cancellationToken);
    }

    public async Task<TResponse?> SendAsync<TResponse>(HttpRequestMessage request, CancellationToken cancellationToken = default)
    {
        var response = await httpClient.SendAsync(request, cancellationToken);
        await apiErrorHandler.EnsureSuccessOrThrowAsync(response, cancellationToken);
        return await response.Content.ReadFromJsonAsync<TResponse>(JsonOptions, cancellationToken);
    }

    public static HttpRequestMessage CreateJsonRequest<T>(HttpMethod method, string path, T payload)
    {
        var json = JsonSerializer.Serialize(payload, JsonOptions);
        return new HttpRequestMessage(method, path)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
    }
}
