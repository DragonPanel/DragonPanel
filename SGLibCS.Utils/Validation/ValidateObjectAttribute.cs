using System.ComponentModel.DataAnnotations;

namespace SGLibCS.Utils.Validation;

// TODO: Can enhace it to display better error messages

public class ValidateObjectAttribute: ValidationAttribute {
   protected override ValidationResult? IsValid(object? value, ValidationContext validationContext) {
      if (value is null)
      {
         // if null then skip
         return ValidationResult.Success;
      }

      var results = new List<ValidationResult>();
      var context = new ValidationContext(value, null, null);

      Validator.TryValidateObject(value, context, results, true);

      if (results.Count != 0) {
         var errorDetails = String.Join("\n", results);
         var compositeResults = new CompositeValidationResult(
            String.Format(
               "Validation for {0} failed! Details:\n{1}",
               validationContext.DisplayName,
               errorDetails
            ),
            results.Aggregate(new List<string>(), (acc, v) => {
               acc.AddRange(v.MemberNames.Select(n => $"{validationContext.DisplayName}.{n}"));
               return acc;
            })
         );
         results.ForEach(compositeResults.AddResult);

         return compositeResults;
      }

      return ValidationResult.Success;
   }
}

public class CompositeValidationResult: ValidationResult {
   private readonly List<ValidationResult> _results = new List<ValidationResult>();

   public IEnumerable<ValidationResult> Results {
      get {
         return _results;
      }
   }

   public CompositeValidationResult(string errorMessage) : base(errorMessage) {}
   public CompositeValidationResult(string errorMessage, IEnumerable<string> memberNames) : base(errorMessage, memberNames) {}
   protected CompositeValidationResult(ValidationResult validationResult) : base(validationResult) {}

   public void AddResult(ValidationResult validationResult) {
      _results.Add(validationResult);
   }
}
