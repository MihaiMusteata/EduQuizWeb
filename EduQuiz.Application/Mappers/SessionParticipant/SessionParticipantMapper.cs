using EduQuiz.Application.DTOs.SessionParticipant;
using EduQuiz.Domain.Entities.SessionParticipant;

namespace EduQuiz.Application.Mappers.SessionParticipant;

public static class SessionParticipantMapper
{
    public static SessionParticipantDto ToDto(this SessionParticipantDbTable entity)
    {
        return new SessionParticipantDto
        {
            Id = entity.Id,
            SessionId = entity.SessionId,
            Nickname = entity.Nickname,
            UserId = entity.UserId,
            JoinedAt = entity.JoinedAt,
        };
    }

    public static SessionParticipantDbTable ToEntity(this SessionParticipantDto dto)
    {
        return new SessionParticipantDbTable
        {
            Id = dto.Id,
            SessionId = dto.SessionId,
            Nickname = dto.Nickname,
            UserId = dto.UserId,
        };
    }
}