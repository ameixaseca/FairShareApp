using FairShareApp.Backend.Web.Components;
using FairShareApp.Backend.Web.Services.ApiClients;
using FairShareApp.Backend.Web.Services.Auth;
using FairShareApp.Backend.Web.Services.Caching;
using FairShareApp.Backend.Web.Services.Preloading;
using FairShareApp.Backend.Web.Services.Telemetry;
using FairShareApp.Backend.Web.Services.Validation;
using Microsoft.AspNetCore.Components.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddAuthorizationCore();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ApiErrorHandler>();
builder.Services.AddHttpClient<FairShareApiClient>(client =>
{
    var baseUrl = builder.Configuration["Api:BaseUrl"] ?? "https://localhost:5001/";
    client.BaseAddress = new Uri(baseUrl);
});
builder.Services.AddScoped<GroupsApiClient>();
builder.Services.AddScoped<InvitesApiClient>();
builder.Services.AddScoped<ExpensesApiClient>();
builder.Services.AddScoped<BalancesApiClient>();
builder.Services.AddScoped<SettlementsApiClient>();
builder.Services.AddScoped<FairShareAuthenticationStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(sp => sp.GetRequiredService<FairShareAuthenticationStateProvider>());
builder.Services.AddScoped<AuthorizationViewPolicyService>();
builder.Services.AddScoped<PreloadOrchestrator>();
builder.Services.AddScoped<ExpensePreloadService>();
builder.Services.AddScoped<ViewCacheService>();
builder.Services.AddScoped<CacheInvalidationService>();
builder.Services.AddScoped<ExpenseMutationCacheHandler>();
builder.Services.AddScoped<ExpenseValidators>();
builder.Services.AddScoped<SettlementValidators>();
builder.Services.AddScoped<WebInteractionTelemetry>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();


app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
