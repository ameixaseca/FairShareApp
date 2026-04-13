using Microsoft.AspNetCore.Mvc;

namespace FairShareApp.Backend.Interface.Api.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private static readonly Dictionary<string, UserRecord> UsersByEmail = new(StringComparer.OrdinalIgnoreCase);

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Invalid registration payload." });
        }

        if (UsersByEmail.ContainsKey(request.Email))
        {
            return Conflict(new { message = "Invalid credentials or account state." });
        }

        var user = new UserRecord(Guid.NewGuid(), request.Name.Trim(), request.Email.Trim());
        UsersByEmail[user.Email] = user;

        return Ok(new { id = user.Id, name = user.Name, email = user.Email });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (!UsersByEmail.TryGetValue(request.Email, out var user))
        {
            return Unauthorized(new { message = "Invalid credentials or account state." });
        }

        Response.Cookies.Append("token", user.Id.ToString(), new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddHours(12)
        });

        return Ok(new { id = user.Id, name = user.Name, email = user.Email });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return Ok();
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        if (!Request.Cookies.TryGetValue("token", out var token) || !Guid.TryParse(token, out var userId))
        {
            return Unauthorized();
        }

        var user = UsersByEmail.Values.FirstOrDefault(candidate => candidate.Id == userId);
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(new { id = user.Id, name = user.Name, email = user.Email });
    }

    public sealed class RegisterRequest
    {
        public string Name { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
    }

    public sealed class LoginRequest
    {
        public string Email { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
    }

    private sealed record UserRecord(Guid Id, string Name, string Email);
}
