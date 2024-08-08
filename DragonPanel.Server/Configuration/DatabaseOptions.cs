using System.ComponentModel.DataAnnotations;

namespace DragonPanel.Server.Configuration;

public class DatabaseOptions
{
    public const string Key = "Database";
    
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