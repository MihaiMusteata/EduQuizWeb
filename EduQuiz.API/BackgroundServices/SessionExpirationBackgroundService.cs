using EduQuiz.API.Hubs;
using EduQuiz.Application.Services.QuizSession;
using Microsoft.AspNetCore.SignalR;

namespace EduQuiz.API.BackgroundServices;

public class SessionExpirationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SessionExpirationBackgroundService> _logger;

    public SessionExpirationBackgroundService(IServiceProvider serviceProvider, ILogger<SessionExpirationBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAndCloseExpiredSessions();

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task CheckAndCloseExpiredSessions()
    {
        using var scope = _serviceProvider.CreateScope();
        var sessionService = scope.ServiceProvider.GetRequiredService<IQuizSessionService>();
        var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<QuizSessionHub>>();

        var now = DateTime.UtcNow;

        var sessions = await sessionService.GetAllOpenSessions();

        foreach (var session in sessions.Where(s => s.EndTime.HasValue && s.EndTime.Value <= now))
        {
            var updatedSession = await sessionService.EndSessionById(session.Id);
            await hubContext.Clients.Group(session.Id.ToString()).SendAsync("SessionEnded", updatedSession);
            _logger.LogInformation($"Session {session.Id} has been closed due to expiration.");
        }
    }
}