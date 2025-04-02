using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.Mappers.Answer;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Domain.Entities.Answer;
using EduQuiz.Domain.ValueObjects.QuestionType;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;
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
        var quiz = await _context.Quizzes.FirstOrDefaultAsync(x => x.Id == quizId);
        if (quiz is null)
            return null;

        var questions = await _context.Questions
            .Include(q => q.Answers)
            .Where(x => x.QuizId == quiz.Id)
            .Select(x => x.ToSummaryDto())
            .ToListAsync();

        return questions;
    }

    public async Task<int> CreateQuestionAsync(Guid quizId, QuestionDto questionDto)
    {
        var quiz = await _context.Quizzes.FindAsync(quizId);
        if (quiz is null)
        {
            return -1;
        }

        var question = questionDto.ToEntity();
        question.QuizId = quizId;

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return question.Id;
    }

    public async Task<IdentityResult> UpdateQuestionAsync(QuestionDto questionDto)
    {
        var oldQuestion = await _context.Questions
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == questionDto.Id);

        if (oldQuestion is null)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = $"Question with ID {questionDto.Id} not found" });
        }

        var isModified = false;

        if (!string.IsNullOrEmpty(questionDto.Text))
        {
            oldQuestion.Text = questionDto.Text;
            isModified = true;
        }

        if (!string.IsNullOrEmpty(questionDto.Hint))
        {
            oldQuestion.Hint = questionDto.Hint;
            isModified = true;
        }

        if (questionDto.Answers != null)
        {
            var dtoAnswerIds = questionDto.Answers.Where(a => a.Id.HasValue).Select(a => a.Id.Value).ToHashSet();

            var answersToRemove = oldQuestion.Answers.Where(a => !dtoAnswerIds.Contains(a.Id)).ToList();
            if (answersToRemove.Count > 0)
            {
                _context.Answers.RemoveRange(answersToRemove);
                isModified = true;
            }

            var newAnswers = new List<AnswerDbTable>();
            foreach (var answerDto in questionDto.Answers)
            {
                if (answerDto.Id.HasValue)
                {
                    var existingAnswer = oldQuestion.Answers.FirstOrDefault(a => a.Id == answerDto.Id.Value);

                    if (existingAnswer == null) continue;

                    if (!string.IsNullOrEmpty(answerDto.Text))
                    {
                        existingAnswer.Text = answerDto.Text;
                        isModified = true;
                    }

                    if (answerDto.IsCorrect.HasValue)
                    {
                        existingAnswer.IsCorrect = answerDto.IsCorrect.Value;
                        isModified = true;
                    }
                }
                else
                {
                    newAnswers.Add(answerDto.ToEntity());
                    isModified = true;
                }
            }

            if (newAnswers.Count > 0)
            {
                oldQuestion.Answers.AddRange(newAnswers);
            }
        }

        if (!isModified)
        {
            return IdentityResult.Success;
        }

        try
        {
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = "Concurrency error: Question was modified by another user." });
        }
        catch (DbUpdateException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = $"Database error: {ex.InnerException?.Message ?? ex.Message}" });
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"General error: {e.Message}" });
        }
    }

    public async Task<IdentityResult> DeleteQuestionAsync(int questionId)
    {
        var question = await _context.Questions.FindAsync(questionId);

        if (question is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"Question with ID {questionId} not found" });
        }

        try
        {
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = "Concurrency error: Question was modified by another user." });
        }
        catch (DbUpdateException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = $"Database error: {ex.InnerException?.Message ?? ex.Message}" });
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"General error: {e.Message}" });
        }
    }
}