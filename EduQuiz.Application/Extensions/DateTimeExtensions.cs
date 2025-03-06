using EduQuiz.Application.Utilities;

namespace EduQuiz.Application.Extensions;

public static class DateTimeExtensions
{
    public static string ToUserTimeZone(this DateTime utcDateTime)
    {
        try
        {
            var timeZoneId = TimeZoneContext.CurrentTimeZone;
            var userTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, userTimeZone);

            return localTime.ToString("dd/MM/yyyy HH:mm");
        }
        catch (TimeZoneNotFoundException)
        {
            return utcDateTime.ToString("dd/MM/yyyy HH:mm");
        }
        catch (InvalidTimeZoneException)
        {
            return utcDateTime.ToString("dd/MM/yyyy HH:mm");
        }
    }
}