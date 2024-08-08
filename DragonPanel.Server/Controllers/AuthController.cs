using DragonPanel.Server.Auth.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DragonPanel.Server.Controllers;

[ApiController]
[Route("auth")]
[Authorize]
public class AuthController : ControllerBase
{
    [HttpPost("initial-user")]
    [AllowAnonymous]
    public IResult CreateInitialUser([FromBody] CreateInitialUserRequest request)
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    [HttpGet("session")]
    public IResult GetSession()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    [HttpPost("login")]
    public IResult Login()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }

    [HttpDelete("logout")]
    public IResult Logout()
    {
        return Results.StatusCode(StatusCodes.Status501NotImplemented);
    }
}