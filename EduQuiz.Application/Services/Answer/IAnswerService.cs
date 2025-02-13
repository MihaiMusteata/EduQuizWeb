using EduQuiz.Application.DTOs.Answer;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Answer;

public interface IAnswerService
{
    Task<IdentityResult> UpdateAnswerAsync(AnswerDto answerDto);
    Task<IdentityResult> DeleteAnswerAsync(int id);
}