using Swashbuckle.AspNetCore.Annotations;

namespace DragonPanel.Server.Swagger;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class SwaggerUnauthorizedResponseAttribute : SwaggerResponseAttribute
{
    public SwaggerUnauthorizedResponseAttribute() : base(401, "User is not authenticated.") {}
}