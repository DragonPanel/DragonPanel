namespace DragonPanel.Server.Auth.Services;

public class UserInit
{
    public required string Username { get; set; }
    public string? Email { get; set; }
    public required string Password { get; set; }
    public bool IsAdmin { get; set; } = false;
}