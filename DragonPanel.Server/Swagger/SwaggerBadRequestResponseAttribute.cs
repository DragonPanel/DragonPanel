using Swashbuckle.AspNetCore.Annotations;

namespace DragonPanel.Server.Swagger;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class SwaggerBadRequestResponseAttribute : SwaggerResponseAttribute
{
    public SwaggerBadRequestResponseAttribute() : base(400, "Bad Request, possibly due to validation error.") {}
}