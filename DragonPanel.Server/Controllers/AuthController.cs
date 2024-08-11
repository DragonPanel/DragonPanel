using System.Diagnostics;
using DragonPanel.Server.Auth.Dto;
using DragonPanel.Server.Auth.Model;
using DragonPanel.Server.Auth.Services;
using DragonPanel.Server.Setup.Dto;
using DragonPanel.Server.Swagger;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace DragonPanel.Server.Controllers;

[ApiController]
[Route("auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly SessionService _sessionService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserService userService, SessionService sessionService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _sessionService = sessionService;
        _logger = logger;
    }

    [HttpGet("session")]
    [SwaggerOperation(Summary = "Returns session of currently logged in user")]
    [SwaggerResponse(200, "The User's session", typeof(Session))]
    [SwaggerUnauthorizedResponse]
    public Session GetSession()
    {
        var session = _sessionService.GetCurrentSessionFromHttpContext();

        if (session is null)
        {
            throw new UnreachableException("Session should never be null here :)");
        }

        return session;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [SwaggerOperation(Summary = "Attempts to log in an user")]
    [SwaggerResponse(204, "The user has been logged in and cookie has been set")]
    [SwaggerBadRequestResponse]
    [SwaggerResponse(401, "Invalid credentials")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.AuthenticateUser(request.Username, request.Password);

        if (user is null)
        {
            return Unauthorized();
        }

        var session = await _sessionService.CreateSessionAsync(user);
        var claimsPrincipal = _sessionService.SessionToClaimsPrincipal(session);
        await HttpContext.SignInAsync(claimsPrincipal);

        return NoContent();
    }

    [HttpDelete("logout")]
    [SwaggerOperation(Summary = "Signs out the user, deleting the cookie and invalidating the session")]
    [SwaggerResponse(204, "User has been logged out")]
    [SwaggerUnauthorizedResponse]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync();

        try
        {
            await _sessionService.InvalidateCurrentSessionAsync();
        }
        catch (Exception exception)
        {
            // If we have some exception during invalidating session, log that but don't fail request.
            // Logout request should never fail to the client. Cookie will be deleted, just session won't be invalidated.
            // Which would matter only in case of stolen cookie, rather rare.
            var session = _sessionService.GetCurrentSessionFromHttpContext();
            var sessionId = session?.Id.ToString() ?? "null";
            _logger.LogError(exception, "Session invalidation failed for session: {Id}.", sessionId);
        }

        return NoContent();
    }
}