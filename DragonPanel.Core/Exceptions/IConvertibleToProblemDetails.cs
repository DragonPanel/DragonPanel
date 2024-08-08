using Microsoft.AspNetCore.Mvc;

namespace DragonPanel.Core.Exceptions;

public interface IConvertibleToProblemDetails
{
    ProblemDetails ToProblemDetails();
}