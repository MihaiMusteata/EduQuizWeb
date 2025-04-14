using EduQuiz.Application.DTOs.QuizSession;
using EduQuiz.Domain.Entities.QuizSession;
using EduQuiz.Domain.ValueObjects;

namespace EduQuiz.Application.Mappers.QuizSession;

public static class QuizSessionMapper
{
    public static QuizSessionDto ToDto(this QuizSessionDbTable entity)
    {
        return new QuizSessionDto
        {
            Id = entity.Id,
            AccessPin = entity.AccessPin,
            StartTime = entity.StartTime,
            EndTime = entity.EndTime,
            Status = entity.Status.Value,
        };
    }
    
    public static QuizSessionDbTable ToEntity(this QuizSessionDto dto, Guid quizId, string hostUserId)
    {
        return new QuizSessionDbTable
        {
            Id = dto.Id,
            AccessPin = dto.AccessPin,
            Status = QuizSessionStatus.FromString(dto.Status),
            QuizId = quizId,
            HostUserId = hostUserId
        };
    }
}