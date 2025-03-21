using EduQuiz.Application.DTOs.Question;

namespace EduQuiz.Application.Services.Question;

public interface IQuestionService
{
    Task<QuestionSummaryDto?> GetQuestionByIndexAsync(Guid quizId, int index);
    Task<List<QuestionSummaryDto>?> GetQuestionsAsync(Guid quizId);
}