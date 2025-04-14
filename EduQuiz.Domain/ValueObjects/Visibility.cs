namespace EduQuiz.Domain.ValueObjects;

public class Visibility : ValueObject
{
    public string Value { get; }
    public static Visibility Public => new Visibility("public");
    public static Visibility Private => new Visibility("private");

    private Visibility(string value)
    {
        Value = value;
    }

    public static Visibility FromString(string? value)
    {
        return value switch
        {
            "public" => Public,
            "private" => Private,
            _ => throw new ArgumentException($"Invalid visibility type: {value}")
        };
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}