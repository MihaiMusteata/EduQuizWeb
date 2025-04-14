using EduQuiz.Application.DTOs.QuizSession;
using EduQuiz.Application.DTOs.SessionParticipant;
using EduQuiz.Application.Services.QuizSession;
using EduQuiz.Domain.ValueObjects;
using Microsoft.AspNetCore.SignalR;

namespace EduQuiz.API.Hubs;

public class QuizSessionHub : Hub
{
    private readonly IQuizSessionService _sessionService;

    public QuizSessionHub(IQuizSessionService sessionService)
    {
        _sessionService = sessionService;
    }

    public async Task HostJoin(Guid sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId.ToString());
        await Clients.Group(sessionId.ToString()).SendAsync("HostJoined", "Host user joined");
    }

    public async Task<QuizSessionDto?> JoinSession(string sessionPin, string nickname)
    {
        var session = await _sessionService.GetSessionByPin(sessionPin);
        if (session == null || session.Status == QuizSessionStatus.Finished.Value)
        {
            await Clients.Caller.SendAsync("Error", "Session not found or finished");
            return null;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, session.Id.ToString());

        var participant = new SessionParticipantDto
        {
            SessionId = session.Id,
            Nickname = nickname,
            UserId = null
        };

        var result = await _sessionService.AddParticipant(participant);
        if (result.Succeeded)
        {
            await Clients.Group(session.Id.ToString()).SendAsync("ParticipantJoined", participant.Nickname);
            return session;
        }

        await Clients.Caller.SendAsync("Error", "Something went wrong. Failed to join!");
        return null;
    }
}