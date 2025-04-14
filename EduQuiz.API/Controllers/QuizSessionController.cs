using EduQuiz.API.Hubs;
using EduQuiz.API.Requests;
using EduQuiz.Application.Services.QuizSession;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace EduQuiz.API.Controllers;

[Route("api/quiz-session")]
[ApiController]
public class QuizSessionController : BaseController
{
    private readonly IQuizSessionService _quizSessionService;
    private readonly IHubContext<QuizSessionHub> _hubContext;

    public QuizSessionController(IQuizSessionService quizSessionService, IHubContext<QuizSessionHub> hubContext)
    {
        _quizSessionService = quizSessionService;
        _hubContext = hubContext;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateSession([FromBody] CreateSessionRequest request)
    {
        var hostUserId = GetUserIdFromJwt();
        var newSession = await _quizSessionService.CreateNewSession(
            request.QuizId,
            request.ShuffleQuestions,
            request.ShuffleAnswers,
            hostUserId
        );

        return Ok(newSession.Id);
    }

    [Authorize]
    [HttpPost("{id}/start")]
    public async Task<IActionResult> StartSession([FromRoute] Guid id, [FromBody] StartSessionRequest request)
    {
        var hostUserId = GetUserIdFromJwt();
        var session = await _quizSessionService.StartSession(id, hostUserId, request.NumberOfMinutes);

        await _hubContext.Clients.Group(id.ToString()).SendAsync("SessionStarted", session);

        return Ok(session);
    }

    [HttpPost("{id}/end")]
    public async Task<IActionResult> EndSession([FromRoute] Guid id)
    {
        var hostUserId = GetUserIdFromJwt();
        var session = await _quizSessionService.EndSession(id, hostUserId);
        
        
        await _hubContext.Clients.Group(id.ToString()).SendAsync("SessionEnded", session);
        return Ok(session);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSession([FromRoute] Guid id)
    {
        var session = await _quizSessionService.GetSessionById(id);
        return Ok(session);
    }


    [HttpGet("{id}/question")]
    public async Task<IActionResult> NextQuestion([FromRoute] Guid id, [FromQuery] QuestionRequest request)
    {
        var nextQuestion = await _quizSessionService.GetQuestion(request.Nickname, request.Index, id);
        return Ok(nextQuestion);
    }

    [HttpPost("{id}/submit-answer")]
    public async Task<IActionResult> SubmitAnswer([FromRoute] Guid id, [FromBody] SubmitAnswerRequest request)
    {
        var result = await _quizSessionService.SubmitAnswer(request.Nickname, request.AnswerGiven, id);
        return Ok(result);
    }
    
    [HttpGet("{id}/result")]
    public async Task<IActionResult> GetResult([FromRoute] Guid id, [FromQuery] string nickname)
    {
        var result = await _quizSessionService.GetResult(nickname, id);
        return Ok(result);
    }
    
}