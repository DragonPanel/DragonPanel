using System.ComponentModel.DataAnnotations;
using SGLibCS.Utils.Validation;

namespace DragonPanel.Server;

public class AppSettings
{
    public static string EnvPrefix { get; } = "DP_";
    
    public static Dictionary<string, string> EnvMappings { get; } = new () {
        { "DB_HOST", $"{EnvPrefix}DATABASE__HOST" },
        { "DB_PORT", $"{EnvPrefix}DATABASE__PORT" },
        { "DB_USERNAME", $"{EnvPrefix}DATABASE__USERNAME" },
        { "DB_PASSWORD", $"{EnvPrefix}DATABASE__PASSWORD" },
        { "DB_DATABASE", $"{EnvPrefix}DATABASE__DATABASE" }
    };

    public AppInfoSettings? AppInfo { get; set; }
    
    [Required, ValidateObject]
    public required DatabaseSettings Database { get; set; }
    
    public class DatabaseSettings
    {
        [Required(ErrorMessage =
            "Database.Host is required. Set it in appsettings.json or as DB_HOST environment variable")]
        public string Host { get; set; } = null!;
        public string? Port { get; set; }

        [Required(ErrorMessage =
            "Database.Username is required. Set it in appsettings.json or as DB_USERNAME environment variable")]
        public string Username { get; set; } = null!;
        public string? Password { get; set; }
        public string? Database { get; set; }
    }

    public class AppInfoSettings
    {
        public string? Version { get; set; }
        public string? Name { get; set; }
        public string? Author { get; set; }
        public string? AuthorUrl { get; set; }
    }
}
