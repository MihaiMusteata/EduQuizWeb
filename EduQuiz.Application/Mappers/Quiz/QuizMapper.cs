using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.Question;
using EduQuiz.Domain.Entities.Quiz;

namespace EduQuiz.Application.Mappers.Quiz;

public static class QuizMapper
{
    public static QuizDto ToDto(this QuizDbTable entity)
    {
        return new QuizDto
        {
            Id = entity.TrackingId,
            Title = entity.Title,
            Visibility = entity.Visibility,
            CreatedAt = entity.CreatedAt,
            Questions = entity.Questions.Select(x => x.ToDto()).ToList()
        };
    }

    public static QuizDbTable ToEntity(this QuizDto dto, string userId)
    {
        return new QuizDbTable
        {
            Title = dto.Title,
            Visibility = dto.Visibility,
            UserId = userId,
            Questions = dto.Questions.Select(x => x.ToEntity()).ToList()
        };
    }
    
}