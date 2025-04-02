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

            return localTime.ToString("HH:mm dd/MM/yyyy");
        }
        catch (TimeZoneNotFoundException)
        {
            return utcDateTime.ToString("HH:mm dd/MM/yyyy");
        }
        catch (InvalidTimeZoneException)
        {
            return utcDateTime.ToString("HH:mm dd/MM/yyyy");
        }
    }
}