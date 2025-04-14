using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Domain.ValueObjects;

namespace EduQuiz.Application.Mappers.Quiz;

public static class QuizMapper
{
    public static QuizDto ToDto(this QuizDbTable entity)
    {
        return new QuizDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Visibility = entity.Visibility.Value,
            CreatedAt = entity.CreatedAt,
            Questions = entity.Questions.Select(x => x.ToDto()).ToList()
        };
    }

    public static QuizDbTable ToEntity(this QuizDto dto, string userId)
    {
        return new QuizDbTable
        {
            Title = dto.Title ?? string.Empty,
            Visibility = Visibility.FromString(dto.Visibility),
            UserId = userId,
            Questions = dto.Questions?.Select(x => x.ToEntity()).ToList() ?? []
        };
    }
}