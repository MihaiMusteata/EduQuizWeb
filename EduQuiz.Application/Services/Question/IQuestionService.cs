using EduQuiz.Application.DTOs.Question;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Question;

public interface IQuestionService
{
    Task<QuestionSummaryDto?> GetQuestionByIndexAsync(Guid quizId, int index);
    Task<List<QuestionSummaryDto>?> GetQuestionsAsync(Guid quizId);
    Task<int> CreateQuestionAsync(Guid quizId, QuestionDto questionDto);
    Task<IdentityResult> UpdateQuestionAsync(QuestionDto questionDto);
    Task<IdentityResult> DeleteQuestionAsync(int questionId);
}