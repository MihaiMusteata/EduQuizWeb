namespace EduQuiz.Domain.ValueObjects;

public class QuizSessionStatus : ValueObject
{
    public string Value { get; }
    
    public static QuizSessionStatus Waiting => new QuizSessionStatus("waiting");
    public static QuizSessionStatus Running => new QuizSessionStatus("running");
    public static QuizSessionStatus Finished => new QuizSessionStatus("finished");

    private QuizSessionStatus(string value)
    {
        Value = value;
    }

    public static QuizSessionStatus FromString(string value)
    {
        return value switch
        {
            "waiting" => Waiting,
            "running" => Running,
            "finished" => Finished,
            _ => throw new ArgumentException($"Invalid session status: {value}")
        };
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}