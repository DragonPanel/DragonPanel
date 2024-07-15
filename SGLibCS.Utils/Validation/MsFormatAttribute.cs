namespace SGLibCS.Utils.Validation;

using System.ComponentModel.DataAnnotations;
using SGLibCS.Ms;

public class MsFormatAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        // Required attribute controls if object should not be null, we don't care
        if (value is null)
        {
            return ValidationResult.Success;
        }

        var name = validationContext.DisplayName;

        if (value is not string)
        {
            return new ValidationResult($"{name} is invalid SGLibCS.Ms duration format. It has to be a string. Use for example: '1h', '2 hours', '3 years'");
        }

        bool valid = MsConverter.TryParse((string)value, out _);

        if (!valid)
        {
            return new ValidationResult($"{name} - {(string)value} is invalid SGLibCS.Ms duration format. Use for example: '1h', '2 hours', '3 years'.");
        }
        return ValidationResult.Success;
    }
}
