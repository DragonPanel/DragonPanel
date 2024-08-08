namespace DragonPanel.Server.Configuration;

public class AppInfoOptions
{
    public const string Key = "AppInfo";
    
    public string? Version { get; set; }
    public string? Name { get; set; }
    public string? Author { get; set; }
    public string? AuthorUrl { get; set; }
}