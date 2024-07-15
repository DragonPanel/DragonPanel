using System.ComponentModel.DataAnnotations;

namespace SGLibCS.Utils.Validation;

[AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = true)]
public sealed class IsNotOneOfAttributeAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null)
        {
            return ValidationResult.Success;
        }

        var name = validationContext.DisplayName;
        var contains = ValueList.Contains(value);

        if (contains)
        {
            return new ValidationResult($"{name} has forbidden value: {value}.");
        }
        return ValidationResult.Success;
    }

    public IsNotOneOfAttributeAttribute(params object[] objects)
    {
        ValueList = objects;
    }
    
    public IEnumerable<object> ValueList { get; init; }
}
