using DragonPanel.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DragonPanel.Server.Filters;

public class HttpExceptionsFilter : IExceptionFilter, IOrderedFilter
{
    // The preceding filter specifies an Order of the maximum integer value minus 10. This Order allows other filters to run at the end of the pipeline.
    public int Order => int.MaxValue - 10;
    
    public void OnException(ExceptionContext ctx)
    {
        if (ctx.Exception is not IConvertibleToProblemDetails exception)
        {
            return;
        }
        
        var pd = exception.ToProblemDetails();
        ctx.Result = new JsonResult(pd)
        {
            StatusCode = pd.Status,
            ContentType = "application/problem+json"
        };
        ctx.ExceptionHandled = true;
    }
}