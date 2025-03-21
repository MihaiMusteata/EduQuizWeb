using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Application.Services.Question;

public class QuestionService : IQuestionService
{
    private readonly EduQuizDbContext _context;

    public QuestionService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<QuestionSummaryDto?> GetQuestionByIndexAsync(Guid quizId, int index)
    {
        var questions = await GetQuestionsAsync(quizId);

        return questions?[index];
    }

    public async Task<List<QuestionSummaryDto>?> GetQuestionsAsync(Guid quizId)
    {
        var quiz = await _context.Quizzes.FirstOrDefaultAsync(x => x.TrackingId == quizId);
        if (quiz is null)
            return null;

        var questions = await _context.Questions
            .Include(q => q.Answers).OrderBy(x => x.Id)
            .Where(x => x.QuizId == quiz.Id)
            .Select(x => x.ToSummaryDto())
            .ToListAsync();

        return questions;
    }
}