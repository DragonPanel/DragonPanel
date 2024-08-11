using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DragonPanel.Core.Data;

namespace DragonPanel.Server.Auth.Model;

public class User : BaseEntity
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
    [JsonIgnore]
    public string HashedPassword { get; set; } = null!;

    public bool Disabled { get; set; } = false;

    public string? Email { get; set; }

    public bool IsAdmin { get; set; } = false;

    public bool IsInitial { get; set; } = false;
}