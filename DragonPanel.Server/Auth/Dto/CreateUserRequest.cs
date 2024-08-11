using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace DragonPanel.Server.Auth.Dto;

public class CreateUserRequest
{
    [Required]
    public required string Username { get; set; }
    public string? Email { get; set; }
    
    [Required]
    public required string Password { get; set; }
    
    [DefaultValue(false)]
    public bool IsAdmin { get; set; } = false;

    public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
    {
        public CreateUserRequestValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .Length(3, 16)
                .Matches("^[a-zA-Z0-9]+[a-zA-Z0-9_]*[a-zA-Z0-9]$")
                .WithMessage(
                    "Username can consist only of letters, numbers and underscores. Username cannot start or end with underscore.");
            
            RuleFor(x => x.Password)
                .NotEmpty()
                .Length(8, 72); // I think 72 is sane password length limit.

            RuleFor(x => x.Email)
                .EmailAddress()
                .When(x => !string.IsNullOrEmpty(x.Email));
        }
    }
}