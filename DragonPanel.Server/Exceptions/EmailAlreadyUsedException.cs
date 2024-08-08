using DragonPanel.Core.Exceptions;

namespace DragonPanel.Server.Exceptions;

public class EmailAlreadyUsedException : HttpException
{
    public EmailAlreadyUsedException(string email) : base(StatusCodes.Status409Conflict,
        $"Email adress {email} is already used by another user.")
    {
    }
}
