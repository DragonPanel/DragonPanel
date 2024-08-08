using DragonPanel.Server;
using DragonPanel.Server.Auth;
using DragonPanel.Server.Configuration;
using DragonPanel.Server.Data;
using DragonPanel.Server.Filters;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Serilog;
using SGLibCS.Utils.Environment;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

var builder = WebApplication.CreateBuilder(args);

#region Logging
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

builder.Services.AddSerilog((services, lc) => lc            
    .ReadFrom.Configuration(builder.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
);
#endregion

#region Configuration
EnviromentVariablesMapper.MapVariables(AppSettings.EnvMappings);
builder.Configuration.AddEnvironmentVariables(AppSettings.EnvPrefix);

builder.Services.AddOptions<DatabaseOptions>()
    .Bind(builder.Configuration.GetSection(DatabaseOptions.Key))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<AppInfoOptions>()
    .Bind(builder.Configuration.GetSection(AppInfoOptions.Key))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.Configure<PasswordHasherOptions>(opts =>
{
    // Latest PBKDF2 Iteration Count recommended by OWASP.
    opts.IterationCount = 210_000;
});
#endregion

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddProblemDetails(opts =>
{
    opts.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Type = $"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/{context.ProblemDetails.Status}";
    };
});
builder.Services.AddDragonPanelAuthentication();
builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build());

builder.Services.AddControllers(options =>
{
    options.Filters.Add<HttpExceptionsFilter>();
});

ValidatorOptions.Global.LanguageManager.Enabled = false;
builder.Services.AddValidatorsFromAssemblyContaining<IDragonPanelServerMarker>();
builder.Services.AddFluentValidationAutoValidation();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(opts =>
    {
        opts.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
        {
            var paths = new OpenApiPaths();
            foreach (var path in swaggerDoc.Paths)
            {
                paths.Add($"/api{path.Key}", path.Value);
            }

            swaggerDoc.Paths = paths;
        });
    });
    
    app.UseSwaggerUI();
}

// TODO: Add frontend serving here uwu

app.UseSerilogRequestLogging();

app.UsePathBase("/api");
app.Use((ctx, next) =>
{
    if (ctx.Request.PathBase == string.Empty)
    {
        ctx.Response.StatusCode = 404;
        return Task.CompletedTask;
    }

    return next(ctx);
});


app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try
{ 
    app.Run();
}
catch (Exception ex)
{
    if (ex is OptionsValidationException optionsValidationException)
    {
        Console.WriteLine("@@@@@@@@@@ CONFIGURATION ERROR @@@@@@@@@@");
        Console.WriteLine(optionsValidationException.Message);
    }
    else
    {
        throw;
    }
}
