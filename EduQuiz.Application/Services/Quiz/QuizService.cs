using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.Answer;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Application.Mappers.Quiz;
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

    public async Task<QuizDto?> GetQuizByIdAsync(Guid id)
    {
        var quiz = await _context.Quizzes
            .Include(x => x.Questions.OrderBy(q => q.Id))
            .ThenInclude(x => x.Answers.OrderBy(a => a.Id))
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(x => x.TrackingId == id);

        return quiz?.ToDto();
    }

    public async Task<int> GetTotalQuestions(Guid id)
    {
        var quiz = await _context.Quizzes.FirstOrDefaultAsync(x => x.TrackingId == id);

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
            .FirstOrDefaultAsync(q => q.TrackingId == quizDto.Id);

        if (oldQuiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }

        oldQuiz.Title = quizDto.Title;
        oldQuiz.Visibility = quizDto.Visibility;

        UpdateQuestions(oldQuiz, quizDto.Questions);

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

    private void UpdateQuestions(QuizDbTable quiz, List<QuestionDto> updatedQuestionsDto)
    {
        var updatedQuestionIds = updatedQuestionsDto.Select(q => q.Id).ToHashSet();

        var questionsToRemove = quiz.Questions.Where(q => !updatedQuestionIds.Contains(q.TrackingId)).ToList();
        _context.Questions.RemoveRange(questionsToRemove);

        var questionsToUpdate = quiz.Questions
            .Where(q => updatedQuestionIds.Contains(q.TrackingId)).ToList();

        foreach (var question in questionsToUpdate)
        {
            var questionToUpdate = question;
            var updatedQuestionDto = updatedQuestionsDto.First(q => q.Id == questionToUpdate.TrackingId);
            questionToUpdate.Text = updatedQuestionDto.Text;
            questionToUpdate.Type = updatedQuestionDto.Type;
            questionToUpdate.Hint = updatedQuestionDto.Hint;

            UpdateAnswers(questionToUpdate, updatedQuestionDto.Answers);
            _context.Questions.Update(questionToUpdate);
        }

        var questionsToAdd = updatedQuestionsDto
            .Where(q => q.Id is null || q.Id == Guid.Empty)
            .Select(q => q.ToEntity())
            .ToList();

        _context.Questions.AddRange(questionsToAdd);

        quiz.Questions.AddRange(questionsToAdd);
    }

    private void UpdateAnswers(QuestionDbTable question, List<AnswerDto> updatedAnswersDto)
    {
        var updatedAnswerIds = updatedAnswersDto.Select(a => a.Id).ToHashSet();

        var answersToRemove = question.Answers.Where(a => !updatedAnswerIds.Contains(a.TrackingId)).ToList();
        _context.Answers.RemoveRange(answersToRemove);

        var answersToUpdate = question.Answers
            .Where(a => updatedAnswerIds.Contains(a.TrackingId)).ToList();

        foreach (var answer in answersToUpdate)
        {
            var answerToUpdate = answer;
            var updatedAnswerDto = updatedAnswersDto.First(a => a.Id == answerToUpdate.TrackingId);
            answerToUpdate.Text = updatedAnswerDto.Text;
            answerToUpdate.IsCorrect = updatedAnswerDto.IsCorrect;

            _context.Answers.Update(answerToUpdate);
        }

        var answersToAdd = updatedAnswersDto
            .Where(a => a.Id is null || a.Id == Guid.Empty)
            .Select(a => a.ToEntity())
            .ToList();

        _context.Answers.AddRange(answersToAdd);

        question.Answers.AddRange(answersToAdd);
    }

    public async Task<IdentityResult> DeleteQuizAsync(Guid id)
    {
        var quiz = await _context.Quizzes.FirstOrDefaultAsync(x => x.TrackingId == id);
        if (quiz is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Quiz Not Found" });
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return IdentityResult.Success;
    }

    public async Task<SubmissionResponse> SubmitQuizAsync(List<AnswerGiven> answers, Guid id, string userId)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Answers)
            .FirstOrDefaultAsync(q => q.TrackingId == id);

        if (quiz is null)
        {
            throw new Exception("Quiz Not Found");
        }

        float totalPoints = 0;
        var totalQuestions = quiz.Questions.Count;

        foreach (var answer in answers)
        {
            var question = quiz.Questions.FirstOrDefault(q => q.TrackingId == answer.QuestionId);
            if (question is null)
            {
                throw new Exception("Question Not Found");
            }

            switch (question.Type)
            {
                case "multiple-choice":
                    var totalCorrectAnswers = question.Answers.Count(a => a.IsCorrect);
                    var correctAnswersSelected =
                        question.Answers.Count(a => a.IsCorrect && answer.UserAnswer == a.TrackingId.ToString());
                    var wrongAnswersSelected =
                        question.Answers.Count(a => !a.IsCorrect && answer.UserAnswer == a.TrackingId.ToString());
                    var points = wrongAnswersSelected == 0
                        ? (float)correctAnswersSelected / totalCorrectAnswers
                        : Math.Max(0,
                            (float)correctAnswersSelected / totalCorrectAnswers -
                            (float)wrongAnswersSelected / totalCorrectAnswers);
                    totalPoints += points;
                    break;

                case "single-choice":
                    totalPoints +=
                        question.Answers.Any(a => a.TrackingId.ToString() == answer.UserAnswer && a.IsCorrect) ? 1 : 0;
                    break;

                case "true/false":
                    bool.TryParse(answer.UserAnswer, out var ans);
                    if (question.Answers[0].IsCorrect == ans)
                        totalPoints += 1;
                    break;

                case "short-answer":
                    if (question.Answers[0].Text.Equals(answer.UserAnswer, StringComparison.CurrentCultureIgnoreCase))
                        totalPoints += 1;
                    break;
            }
        }

        return new SubmissionResponse
        {
            FinalGrade = totalPoints / totalQuestions * 10,
            Questions = quiz.Questions.Select(q => q.ToDto()).ToList()
        };
    }
}
