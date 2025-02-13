using EduQuiz.Application.DTOs.Question;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Question;

public interface IQuestionService
{
    Task<IdentityResult> UpdateQuestionAsync(QuestionDto questionDto);
    Task<IdentityResult> DeleteQuestionAsync(int id);
}