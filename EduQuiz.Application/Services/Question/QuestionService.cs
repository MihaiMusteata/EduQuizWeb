using EduQuiz.Application.DTOs.Question;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Question;

public class QuestionService : IQuestionService
{
    private readonly EduQuizDbContext _context;

    public QuestionService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<IdentityResult> UpdateQuestionAsync(QuestionDto questionDto)
    {
        var oldQuestion = await _context.Questions.FindAsync(questionDto.Id);
        if (oldQuestion is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Question Not Found" });
        }

        oldQuestion.Text = questionDto.Text;
        oldQuestion.Hint = questionDto.Hint;
        oldQuestion.Type = questionDto.Type;

        _context.Questions.Update(oldQuestion);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteQuestionAsync(int id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Question Not Found" });
        }

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }
}