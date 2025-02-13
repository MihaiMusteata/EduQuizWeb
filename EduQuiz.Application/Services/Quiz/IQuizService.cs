using EduQuiz.Application.DTOs.Quiz;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Quiz;

public interface IQuizService
{
    Task<IdentityResult> CreateQuizAsync(QuizDto quizDto, string userId);
    Task<QuizDto?> GetQuizByIdAsync(int id);
    Task<IdentityResult> UpdateQuizAsync(QuizDto quizDto);
    Task<IdentityResult> DeleteQuizAsync(int id);
}