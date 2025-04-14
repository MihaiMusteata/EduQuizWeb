namespace EduQuiz.Domain.ValueObjects;

public class QuestionType : ValueObject
{
    public string Value { get; }

    public static QuestionType MultipleChoice => new QuestionType("multiple-choice");
    public static QuestionType SingleChoice => new QuestionType("single-choice");
    public static QuestionType TrueFalse => new QuestionType("true-false");
    public static QuestionType ShortAnswer => new QuestionType("short-answer");
    
    private QuestionType(string value)
    {
        Value = value;
    }
    
    public static QuestionType FromString(string value)
    {
        return value switch
        {
            "multiple-choice" => MultipleChoice,
            "single-choice" => SingleChoice,
            "true-false" => TrueFalse,
            "short-answer" => ShortAnswer,
            _ => throw new ArgumentException($"Invalid question type: {value}")
        };
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}