namespace EduQuiz.Application.Utilities;

public static class TimeZoneContext
{
    private static readonly AsyncLocal<string> _timeZone = new();

    public static string CurrentTimeZone
    {
        get => _timeZone.Value ?? "UTC";
        set => _timeZone.Value = value;
    }
}