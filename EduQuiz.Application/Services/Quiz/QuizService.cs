using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.Quiz;
using EduQuiz.Domain.ValueObjects.Visibility;
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

    public async Task<QuizDto?> GetQuizByIdAsync(Guid id)
    {
        var quiz = await _context.Quizzes
            .Include(x => x.Questions.OrderBy(q => q.Id))
            .ThenInclude(x => x.Answers.OrderBy(a => a.Id))
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(x => x.Id == id);

        return quiz?.ToDto();
    }

    public async Task<int> GetTotalQuestions(Guid id)
    {
        var quiz = await _context.Quizzes.FirstOrDefaultAsync(x => x.Id == id);

        if (quiz is null)
            return -1;

        var total = await _context.Questions
            .Where(q => q.QuizId == quiz.Id)
            .CountAsync();

        return total;
    }

    public async Task<IdentityResult> UpdateQuizAsync(QuizDto quizDto)
    {
        var oldQuiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == quizDto.Id);

        if (oldQuiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }

        oldQuiz.Title = quizDto.Title;
        oldQuiz.Visibility = Visibility.FromString(quizDto.Visibility);

        _context.Quizzes.Update(oldQuiz);

        try
        {
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"Exception: {e.Message}" });
        }
    }
    
    public async Task<IdentityResult> DeleteQuizAsync(Guid id)
    {
        var quiz = await _context.Quizzes.FirstOrDefaultAsync(x => x.Id == id);
        if (quiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }

    public async Task<SubmissionResponse> SubmitQuizAsync(List<AnswerGiven> answers, int id, string userId)
    {
        // var quiz = await _context.Quizzes
        //     .Include(q => q.Questions)
        //     .ThenInclude(q => q.Answers)
        //     .FirstOrDefaultAsync(q => q.Id == id);
        //
        // if (quiz is null)
        // {
        //     throw new Exception("Quiz Not Found");
        // }
        //
        // float totalPoints = 0;
        // var totalQuestions = quiz.Questions.Count;
        //
        // foreach (var answer in answers)
        // {
        //     var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
        //     if (question is null)
        //     {
        //         throw new Exception("Question Not Found");
        //     }
        //
        //     switch (question.Type)
        //     {
        //         case "multiple-choice":
        //             var totalCorrectAnswers = question.Answers.Count(a => a.IsCorrect);
        //             var correctAnswersSelected =
        //                 question.Answers.Count(a => a.IsCorrect && answer.UserAnswer == a.Id.ToString());
        //             var wrongAnswersSelected =
        //                 question.Answers.Count(a => !a.IsCorrect && answer.UserAnswer == a.Id.ToString());
        //             var points = wrongAnswersSelected == 0
        //                 ? (float)correctAnswersSelected / totalCorrectAnswers
        //                 : Math.Max(0,
        //                     (float)correctAnswersSelected / totalCorrectAnswers -
        //                     (float)wrongAnswersSelected / totalCorrectAnswers);
        //             totalPoints += points;
        //             break;
        //
        //         case "single-choice":
        //             totalPoints +=
        //                 question.Answers.Any(a => a.Id.ToString() == answer.UserAnswer && a.IsCorrect) ? 1 : 0;
        //             break;
        //
        //         case "true/false":
        //             bool.TryParse(answer.UserAnswer, out var ans);
        //             if (question.Answers[0].IsCorrect == ans)
        //                 totalPoints += 1;
        //             break;
        //
        //         case "short-answer":
        //             if (question.Answers[0].Text.Equals(answer.UserAnswer, StringComparison.CurrentCultureIgnoreCase))
        //                 totalPoints += 1;
        //             break;
        //     }
        // }
        //
        // return new SubmissionResponse
        // {
        //     FinalGrade = totalPoints / totalQuestions * 10,
        //     Questions = quiz.Questions.Select(q => q.ToDto()).ToList()
        // };

        return new SubmissionResponse();
    }
}
