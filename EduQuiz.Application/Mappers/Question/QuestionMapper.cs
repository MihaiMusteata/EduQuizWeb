using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.Mappers.Answer;
using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.ValueObjects.QuestionType;

namespace EduQuiz.Application.Mappers.Question;

public static class QuestionMapper
{
    public static QuestionDto ToDto (this QuestionDbTable entity)
    {
        return new QuestionDto
        {
            Id = entity.Id,
            Text = entity.Text,
            Type = entity.Type.Value,
            Hint = entity.Hint ?? string.Empty,
            Answers = entity.Answers.Select(x => x.ToDto()).ToList()
        };
    }
    
    public static QuestionDbTable ToEntity (this QuestionDto dto)
    {
        return new QuestionDbTable
        {
            Text = dto.Text,
            Type = QuestionType.FromString(dto.Type),
            Hint = dto.Hint,
            Answers = dto.Answers.Select(x => x.ToEntity()).ToList()
        };
    }
    public static QuestionSummaryDto ToSummaryDto (this QuestionDbTable entity)
    {
        return new QuestionSummaryDto
        {
            Id = entity.Id,
            Text = entity.Text,
            Type = entity.Type.Value,
            Hint = entity.Hint ?? string.Empty,
            Answers = entity.Answers.Select(x => x.ToSummaryDto()).ToList()
        };
    }
    
}