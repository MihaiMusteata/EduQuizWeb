using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Application.Mappers.Quiz;
using EduQuiz.Domain.Entities.Answer;
using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Application.Services.Quiz;

public class QuizService : IQuizService
{
    private readonly EduQuizDbContext _context;

    public QuizService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<IdentityResult> CreateQuizAsync(QuizDto quizDto, string userId)
    {
        var newQuiz = quizDto.ToEntity(userId);
        try
        {
            await _context.Quizzes.AddAsync(newQuiz);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = e.Message });
        }
    }

    public async Task<QuizDto?> GetQuizByIdAsync(string id)
    {
        var quiz = await _context.Quizzes
            .Include(x => x.Questions)
            .ThenInclude(x => x.Answers)
            .FirstOrDefaultAsync(x => x.Id == id);

        return quiz?.ToDto();
    }

    public async Task<IdentityResult> UpdateQuizAsync(QuizDto quizDto)
    {
        var oldQuiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .AsNoTracking()
            .FirstOrDefaultAsync(q => q.Id == quizDto.Id);
    
        if (oldQuiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }
    
        oldQuiz.Title = quizDto.Title;
        oldQuiz.Visibility = quizDto.Visibility;
    
        UpdateQuestions(oldQuiz, quizDto.Questions);
    
        _context.Quizzes.Update(oldQuiz);
        await _context.SaveChangesAsync();
        return IdentityResult.Success;
    }
    
    private void UpdateQuestions(QuizDbTable quiz, List<QuestionDto> updatedQuestionsDto)
    {
        var existingQuestionsDict = quiz.Questions.ToDictionary(q => q.Id);
        var updatedQuestionIds = updatedQuestionsDto.Select(q => q.Id).ToHashSet();
    
        var questionsToRemove = quiz.Questions.Where(q => !updatedQuestionIds.Contains(q.Id)).ToList();
        _context.Questions.RemoveRange(questionsToRemove);
    
        foreach (var updatedQuestionDto in updatedQuestionsDto)
        {
            if (existingQuestionsDict.TryGetValue(updatedQuestionDto.Id, out var existingQuestion))
            {
                existingQuestion.Text = updatedQuestionDto.Text;
                existingQuestion.Type = updatedQuestionDto.Type;
                existingQuestion.Hint = updatedQuestionDto.Hint;
    
                UpdateAnswers(existingQuestion, updatedQuestionDto.Answers);
                _context.Questions.Update(existingQuestion);
            }
            else
            {
                var newQuestion = new QuestionDbTable
                {
                    Text = updatedQuestionDto.Text,
                    Type = updatedQuestionDto.Type,
                    Hint = updatedQuestionDto.Hint,
                    Answers = updatedQuestionDto.Answers.Select(a => new AnswerDbTable
                    {
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                };
                quiz.Questions.Add(newQuestion);
            }
        }
    }
    
    private void UpdateAnswers(QuestionDbTable question, List<AnswerDto> updatedAnswersDto)
    {
        var existingAnswersDict = question.Answers.ToDictionary(a => a.Id);
        var updatedAnswerIds = updatedAnswersDto.Select(a => a.Id).ToHashSet();
    
        var answersToRemove = question.Answers.Where(a => !updatedAnswerIds.Contains(a.Id)).ToList();
        _context.Answers.RemoveRange(answersToRemove);
    
        foreach (var updatedAnswerDto in updatedAnswersDto)
        {
            if (existingAnswersDict.TryGetValue(updatedAnswerDto.Id, out var existingAnswer))
            {
                existingAnswer.Text = updatedAnswerDto.Text;
                existingAnswer.IsCorrect = updatedAnswerDto.IsCorrect;
                _context.Answers.Update(existingAnswer);
            }
            else
            {
                question.Answers.Add(new AnswerDbTable
                {
                    Text = updatedAnswerDto.Text,
                    IsCorrect = updatedAnswerDto.IsCorrect
                });
            }
        }
    }

    public async Task<IdentityResult> DeleteQuizAsync(string id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }
}