using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Domain.Entities.Answer;

namespace EduQuiz.Application.Mappers.Answer;

public static class AnswerMapper
{
    public static AnswerDto ToDto(this AnswerDbTable entity)
    {
        return new AnswerDto
        {
            Id = entity.Id,
            Text = entity.Text,
            IsCorrect = entity.IsCorrect
        };
    }

    public static AnswerDbTable ToEntity(this AnswerDto dto)
    {
        return new AnswerDbTable
        {
            Text = dto.Text ?? string.Empty,
            IsCorrect = dto.IsCorrect ?? false
        };
    }

    public static AnswerSummaryDto ToSummaryDto(this AnswerDbTable entity)
    {
        return new AnswerSummaryDto
        {
            Id = entity.Id,
            Text = entity.Text
        };
    }
}