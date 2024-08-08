using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DragonPanel.Core.Exceptions;

public class NotFoundException : HttpException
{
    public NotFoundException(string message) : base(StatusCodes.Status404NotFound, message) {}
    
    public NotFoundException(string message, string instance) : base(StatusCodes.Status404NotFound, message)
    {
        Instance = instance;
    }
    
    public string? Instance { get; set; }

    public override ProblemDetails ToProblemDetails()
    {
        var pd = base.ToProblemDetails();
        pd.Instance = Instance;
        return pd;
    }
}