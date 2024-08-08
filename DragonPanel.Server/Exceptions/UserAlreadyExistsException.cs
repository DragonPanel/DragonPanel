using DragonPanel.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace DragonPanel.Server.Exceptions;

public class UserAlreadyExistsException : HttpException
{
    public UserAlreadyExistsException(string username) : base(StatusCodes.Status409Conflict,
        $"User ${username} already exists.") {}


    public string Username { get; set; }
    
    public override ProblemDetails ToProblemDetails()
    {
        var pd = base.ToProblemDetails();
        pd.Type = $"/errors/core/{GetType().Name}";
        pd.Instance = $"/users/by-name/{Username}";

        return pd;
    }
}