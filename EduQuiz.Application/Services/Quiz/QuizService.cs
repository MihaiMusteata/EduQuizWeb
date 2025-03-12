using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.Quiz;
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

    public async Task<QuizDto?> GetQuizByIdAsync(int id)
    {
        var quiz = await _context.Quizzes
            .Include(x => x.Questions)
            .ThenInclude(x => x.Answers)
            .FirstOrDefaultAsync(x => x.Id == id);

        return quiz?.ToDto();
    }

    public async Task<IdentityResult> UpdateQuizAsync(QuizDto quizDto)
    {
        var oldQuiz = await _context.Quizzes.FindAsync(quizDto.Id);
        if (oldQuiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }

        oldQuiz.Title = quizDto.Title;
        oldQuiz.Visibility = quizDto.Visibility;

        _context.Quizzes.Update(oldQuiz);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteQuizAsync(int id)
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