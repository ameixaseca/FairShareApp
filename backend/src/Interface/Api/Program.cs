using FairShareApp.Backend.Interface.Api.DependencyInjection;
using FairShareApp.Backend.Interface.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Database=fairshareapp;Username=postgres;Password=postgres";

builder.Services.AddFairShareServices(connectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseStaticFiles();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<JwtAuthMiddleware>();
app.UseMiddleware<TenantContextMiddleware>();
app.UseMiddleware<IdempotencyMiddleware>();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
