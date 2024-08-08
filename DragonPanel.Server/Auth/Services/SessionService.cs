using DragonPanel.Core.Helpers;
using DragonPanel.Server.Auth.Model;
using DragonPanel.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace DragonPanel.Server.Auth.Services;

public class SessionService
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SessionService(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext)
    {
        _httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
    }

    public async Task<Session?> GetSessionAsync(string sessionId)
    {
        if (!Guid.TryParse(sessionId, out var sessionGuid))
        {
            return null;
        }

        return await _dbContext.Sessions
            .Include(s => s.User)
            .Where(s => s.Id == sessionGuid)
            .FirstOrDefaultAsync();
    }
    
    public async Task<Session?> AccessSessionAsync(string sessionId)
    {
        var context = _httpContextAccessor.HttpContext!;
        var session = await GetSessionAsync(sessionId);

        if (session is null)
        {
            return null;
        }

        session.LastAccess = DateTime.UtcNow;
        session.LastIp = HttpHelpers.GetRealRemoteIpAddress(context);
        session.LastUserAgent = context.Request.Headers.UserAgent;

        await _dbContext.SaveChangesAsync();
        return session;
    }

    public async Task<Session> CreateSessionAsync(User user)
    {
        var context = _httpContextAccessor.HttpContext!;
        var ip = HttpHelpers.GetRealRemoteIpAddress(context);

        var session = new Session
        {
            User = user,
            UserAgent = context.Request.Headers.UserAgent,
            LastUserAgent = context.Request.Headers.UserAgent,
            CreatedAt = DateTime.UtcNow,
            LoggedInIpAddress = ip,
            LastIp = ip,
            IsValid = true,
            LastAccess = DateTime.UtcNow
        };

        _dbContext.Add(session);
        await _dbContext.SaveChangesAsync();
        return session;
    }

    public Session? GetCurrentSessionFromHttpContext()
    {
        var context = _httpContextAccessor.HttpContext!;
        var session = (Session?)context.Items[AppConstants.SessionItemKey];
        return session;
    }

    public async Task<Session?> InvalidateCurrentSessionAsync()
    {
        var context = _httpContextAccessor.HttpContext!;
        var sessionId = context.User.Claims
            .FirstOrDefault(c => c.Type == AppConstants.SessionClaimType)?.Value;

        if (sessionId is null)
        {
            return null;
        }

        var session = await GetSessionAsync(sessionId);
        if (session is null)
        {
            return null;
        }
        session.IsValid = false;
        await _dbContext.SaveChangesAsync();
        return session;
    }
    
    public Task<bool> IsSessionValidAsync(Session? session)
    {
        if (session?.User is null)
        {
            return Task.FromResult(false);
        }

        return Task.FromResult(session.IsValid && !session.User.Disabled);
    }
}