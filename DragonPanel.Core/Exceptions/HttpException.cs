using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace DragonPanel.Core.Exceptions;

/// <summary>
/// Generic HTTP Exception
/// </summary>
public class HttpException : Exception, IConvertibleToProblemDetails
{
    public HttpException(int statusCode, string? message) : base(message)
    {
        StatusCode = statusCode;
    }
    
    public int StatusCode { get; }

    public virtual ProblemDetails ToProblemDetails()
    {
        return new ProblemDetails
        {
            Type = $"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/{StatusCode}",
            Title = ReasonPhrases.GetReasonPhrase(StatusCode),
            Detail = Message,
            Status = StatusCode
        };
    }
}