using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.Answer;

public class AnswerService : IAnswerService
{
    private readonly EduQuizDbContext _context;

    public AnswerService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<IdentityResult> UpdateAnswerAsync(AnswerDto answerDto)
    {
        var oldAnswer = await _context.Answers.FindAsync(answerDto.Id);
        if (oldAnswer is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Answer Not Found" });
        }

        oldAnswer.Text = answerDto.Text;
        oldAnswer.IsCorrect = answerDto.IsCorrect;

        _context.Answers.Update(oldAnswer);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAnswerAsync(int id)
    {
        var answer = await _context.Answers.FindAsync(id);
        if (answer is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Answer Not Found" });
        }

        _context.Answers.Remove(answer);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }
}