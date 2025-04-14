using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.DTOs.QuizSession;
using EduQuiz.Application.DTOs.SessionParticipant;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Application.Mappers.QuizSession;
using EduQuiz.Application.Mappers.SessionParticipant;
using EduQuiz.Domain.Entities.QuizSession;
using EduQuiz.Domain.Entities.UserAnswer;
using EduQuiz.Domain.ValueObjects;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Application.Services.QuizSession;

public class QuizSessionService : IQuizSessionService
{
    private readonly EduQuizDbContext _context;

    public QuizSessionService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<QuizSessionDto> CreateNewSession(Guid quizId, bool shuffleQuestions, bool shuffleAnswers,
        string hostUserId)
    {
        string pin;
        do
        {
            pin = GeneratePin();
        } while (_context.QuizSessions.Any(s => s.AccessPin == pin));

        var totalQuestions = await _context.Questions
            .Where(q => q.QuizId == quizId)
            .CountAsync();

        var session = new QuizSessionDbTable
        {
            AccessPin = pin,
            Status = QuizSessionStatus.Waiting,
            QuizId = quizId,
            HostUserId = hostUserId,
            ShuffleQuestions = shuffleQuestions,
            ShuffleAnswers = shuffleAnswers
        };

        try
        {
            await _context.QuizSessions.AddAsync(session);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("Error creating quiz session", ex);
        }

        var result = session.ToDto();
        result.TotalQuestions = totalQuestions;
        return result;
    }

    public async Task<QuizSessionDto> StartSession(Guid sessionId, string hostUserId, int? numberOfMinutes)
    {
        var session = await _context.QuizSessions
            .Include(s => s.Participants)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.HostUserId == hostUserId);

        if (session == null || session.Status != QuizSessionStatus.Waiting)
        {
            throw new Exception("Session not found ");
        }

        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == session.QuizId);

        session.StartTime = DateTime.UtcNow;
        session.Status = QuizSessionStatus.Running;
        session.EndTime = numberOfMinutes.HasValue
            ? DateTime.UtcNow.AddMinutes(numberOfMinutes.Value)
            : null;


        if (session.ShuffleQuestions)
        {
            var random = new Random();
            var allQuestionIds = quiz!.Questions.Select(q => q.Id).ToList();
            foreach (var participant in session.Participants)
            {
                participant.OrderedQuestionIds = allQuestionIds.OrderBy(x => random.Next()).ToList();
            }
        }

        try
        {
            _context.QuizSessions.Update(session);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("Error starting quiz session", ex);
        }

        var result = session.ToDto();
        result.TotalQuestions = quiz!.Questions.Count;
        return result;
    }

    public async Task<QuizSessionDto> EndSession(Guid sessionId, string hostUserId)
    {
        var session = await _context.QuizSessions
            .Include(s => s.Participants)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.HostUserId == hostUserId);

        if (session == null || session.Status == QuizSessionStatus.Finished)
        {
            throw new Exception("Session not found");
        }

        session.AccessPin = null;
        session.EndTime = DateTime.UtcNow;
        session.Status = QuizSessionStatus.Finished;

        try
        {
            _context.QuizSessions.Update(session);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("Error ending quiz session", ex);
        }

        return session.ToDto();
    }
    
    public async Task<QuizSessionDto> EndSessionById(Guid sessionId)
    {
        var session = await _context.QuizSessions.FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null || session.Status == QuizSessionStatus.Finished)
        {
            throw new Exception("Session not found");
        }

        session.AccessPin = null;
        session.EndTime = DateTime.UtcNow;
        session.Status = QuizSessionStatus.Finished;

        try
        {
            _context.QuizSessions.Update(session);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("Error ending quiz session", ex);
        }

        return session.ToDto();
    }

    public async Task<QuizSessionDto?> GetSessionByPin(string pin)
    {
        var session = await _context.QuizSessions
            .FirstOrDefaultAsync((s) => s.AccessPin == pin && s.Status != QuizSessionStatus.Finished);

        if (session == null)
        {
            return null;
        }

        var totalQuestions = await _context.Questions
            .Where(q => q.QuizId == session.QuizId)
            .CountAsync();

        var result = session.ToDto();
        result.TotalQuestions = totalQuestions;
        return result;
    }

    public async Task<QuizSessionDto?> GetSessionById(Guid sessionId)
    {
        var session = await _context.QuizSessions.FindAsync(sessionId);

        if (session == null)
        {
            return null;
        }

        var totalQuestions = await _context.Questions
            .Where(q => q.QuizId == session.QuizId)
            .CountAsync();

        var result = session.ToDto();
        result.TotalQuestions = totalQuestions;
        return result;
    }

    public async Task<IdentityResult> AddParticipant(SessionParticipantDto participant)
    {
        var existingParticipant = await _context.SessionParticipants
            .FirstOrDefaultAsync(p => p.Nickname == participant.Nickname && p.SessionId == participant.SessionId);

        if (existingParticipant == null)
        {
            try
            {
                await _context.AddAsync(participant.ToEntity());
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating quiz session", ex);
            }
        }

        return IdentityResult.Success;
    }

    public async Task<QuestionSummaryDto> GetQuestion(string nickname, int index, Guid sessionId)
    {
        var participant = await _context.SessionParticipants
            .Include(p => p.UserAnswers)
            .FirstOrDefaultAsync(p => p.Nickname == nickname && p.SessionId == sessionId);

        if (participant == null)
        {
            throw new Exception("Participant not found");
        }

        var question = await _context.Questions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == participant.OrderedQuestionIds[index]);

        if (question == null)
        {
            throw new Exception("No more questions available");
        }

        return question.ToSummaryDto();
    }

    public async Task<IdentityResult> SubmitAnswer(string nickname, AnswerGiven answerGiven, Guid sessionId)
    {
        var participant = await _context.SessionParticipants.FirstOrDefaultAsync(p =>
            p.SessionId == sessionId && p.Nickname == nickname);

        var question = await _context.Questions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == answerGiven.QuestionId);

        if (participant == null || question == null)
        {
            throw new Exception("Participant or question not found");
        }

        var userAnswer = new UserAnswerDbTable
        {
            SessionId = sessionId,
            QuestionId = answerGiven.QuestionId,
            Nickname = nickname,
            ParticipantId = participant.Id,
        };

        if (answerGiven.SelectedIds != null)
        {
            userAnswer.SelectedAnswerId = answerGiven.SelectedIds;
            var pointsForEachSelection = 1 / question.Answers.Count(a => a.IsCorrect);
            var correctAnswerSelected = answerGiven.SelectedIds
                .Select(id => question.Answers.FirstOrDefault(a => a.Id == id))
                .Count(a => a is { IsCorrect: true });
            var wrongAnswerSelected = answerGiven.SelectedIds
                .Select(id => question.Answers.FirstOrDefault(a => a.Id == id))
                .Count(a => a is { IsCorrect: false });
            userAnswer.Points = Math.Max(0,
                (correctAnswerSelected * pointsForEachSelection) - (wrongAnswerSelected * pointsForEachSelection));
        }

        if (answerGiven.UserAnswer != null)
        {
            userAnswer.AnswerText = answerGiven.UserAnswer;
            userAnswer.Points = question.Answers[0].Text == answerGiven.UserAnswer ? 1 : 0;
        }

        try
        {
            await _context.UserAnswers.AddAsync(userAnswer);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("Error submitting answer", ex);
        }

        return IdentityResult.Success;
    }

    public async Task<QuizResultDto> GetResult(string nickname, Guid sessionId)
    {
        var participant = await _context.SessionParticipants
            .Include(p => p.UserAnswers)
            .FirstOrDefaultAsync(p => p.Nickname == nickname && p.SessionId == sessionId);

        var session = await _context.QuizSessions.FindAsync(sessionId);

        if (participant == null || session == null)
        {
            throw new Exception("Participant or session not found");
        }

        var questions = await _context.Questions
            .Include(q => q.Answers)
            .Where(q => session.QuizId == q.QuizId)
            .Select(q => q.ToDto())
            .ToListAsync();

        var result = new QuizResultDto
        {
            Questions = questions,
            FinalScore = participant.UserAnswers.Sum(ua => ua.Points),
        };

        return result;
    }

    public async Task<List<QuizSessionDto>> GetAllOpenSessions()
    {
        var sessions = await _context.QuizSessions
            .Where(s => s.Status != QuizSessionStatus.Finished)
            .ToListAsync();

        var result = sessions.Select(s => s.ToDto()).ToList();
        return result;
    }


    private string GeneratePin()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }
}