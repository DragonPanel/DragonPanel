using DragonPanel.Server.Auth.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace DragonPanel.Server.Auth;

public static class AuthenticationExtensions
{
    public static void AddDragonPanelAuthentication(this IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services, nameof(services));

        services.AddScoped<SessionService>();
        
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, o =>
            {
                o.Cookie.HttpOnly = true;

                o.Events.OnRedirectToLogin = ctx =>
                {
                    ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };

                o.Events.OnValidatePrincipal = async ctx =>
                {
                    if (ctx.Principal is null)
                    {
                        ctx.RejectPrincipal();
                        return;
                    }

                    var httpCtx = ctx.HttpContext;
                    var sessionService = httpCtx.RequestServices.GetRequiredService<SessionService>();
                    
                    var sessionId = ctx.Principal.Claims
                        .FirstOrDefault(c => c.Type == AppConstants.SessionClaimType)?.Value;

                    if (sessionId is null)
                    {
                        ctx.RejectPrincipal();
                        await ctx.HttpContext.SignOutAsync();
                        return;
                    }

                    var session = await sessionService.AccessSessionAsync(sessionId);
                    if (!await sessionService.IsSessionValidAsync(session))
                    {
                        ctx.RejectPrincipal();
                        await ctx.HttpContext.SignOutAsync();
                        return;
                    }

                    // Okey, I load session to httpCtx here because I want to make only 1 call to database in request
                    // And I can't use loading session middleware before UseAuthentication, because session depends on prinpical, so... yeah
                    httpCtx.Items[AppConstants.SessionItemKey] = session;

                };
            });
    }
}