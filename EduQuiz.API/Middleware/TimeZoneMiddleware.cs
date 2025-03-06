using EduQuiz.Application.Utilities;

namespace EduQuiz.API.Middleware;

public class TimeZoneMiddleware
{
    private readonly RequestDelegate _next;
    private const string TimeZoneHeader = "X-User-Time-Zone";

    public TimeZoneMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(TimeZoneHeader, out var timeZoneValue))
        {
            TimeZoneContext.CurrentTimeZone = timeZoneValue;
        }

        await _next(context);
    }
}

public static class TimeZoneMiddlewareExtensions
{
    public static IApplicationBuilder UseTimeZoneMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<TimeZoneMiddleware>();
    }
}