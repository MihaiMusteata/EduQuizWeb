using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.DTOs.QuizSession;
using EduQuiz.Application.DTOs.SessionParticipant;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.QuizSession;

public interface IQuizSessionService
{
    Task<QuizSessionDto> CreateNewSession(Guid quizId, bool shuffleQuestions, bool shuffleAnswers, string hostUserId);
    Task<QuizSessionDto> StartSession(Guid sessionId, string hostUserId, int? numberOfMinutes);
    Task<QuizSessionDto> EndSession(Guid sessionId, string hostUserId);
    Task<QuizSessionDto> EndSessionById(Guid sessionId);
    Task<QuizSessionDto?> GetSessionByPin(string pin);
    Task<QuizSessionDto?> GetSessionById(Guid sessionId);
    Task<IdentityResult> AddParticipant(SessionParticipantDto participant);
    Task<QuestionSummaryDto> GetQuestion(string nickname, int index, Guid sessionId);
    Task<IdentityResult> SubmitAnswer(string nickname, AnswerGiven answerGiven, Guid sessionId);
    Task<QuizResultDto> GetResult(string nickname, Guid sessionId);
    Task<List<QuizSessionDto>> GetAllOpenSessions();
}