using System.ComponentModel.DataAnnotations;

namespace DragonPanel.Server.Auth.Model;

public class User
{
    public Guid Id { get; set; }

    /// <summary>
    /// Username is always in lowercase.
    /// </summary>
    [Required]
    public required string Username { get; set; }

    /// <summary>
    /// DisplayName is not lowercased username.
    /// </summary>
    [Required]
    public required string DisplayName { get; set; }

    [Required]
    public required string HashedPassword { get; set; }

    public bool Disabled { get; set; } = true;

    public string? Email { get; set; }

    public bool IsAdmin { get; set; } = false;
}