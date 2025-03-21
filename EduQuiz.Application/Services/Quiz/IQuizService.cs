using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.DTOs.Quiz;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Quiz;

public interface IQuizService
{
    Task<IdentityResult> CreateQuizAsync(QuizDto quizDto, string userId);
    Task<QuizDto?> GetQuizByIdAsync(Guid id);
    Task<int> GetTotalQuestions(Guid id);
    Task<IdentityResult> UpdateQuizAsync(QuizDto quizDto);
    Task<IdentityResult> DeleteQuizAsync(Guid id);
    Task<SubmissionResponse> SubmitQuizAsync(List<AnswerGiven> answers, Guid id, string userId);
}