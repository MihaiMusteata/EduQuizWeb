namespace EduQuiz.Application.DTOs.SessionParticipant;

public class SessionParticipantDto
{
    public int Id { get; set; }
    public Guid SessionId { get; set; }
    public string? UserId { get; set; }
    public string? Nickname { get; set; }
    public DateTime JoinedAt { get; set; }
}