using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.QuizSession;
using EduQuiz.Domain.Entities.User;
using EduQuiz.Domain.Entities.UserAnswer;

namespace EduQuiz.Domain.Entities.SessionParticipant;

public class SessionParticipantDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [ForeignKey("Session")] public Guid SessionId { get; set; }

    [ForeignKey("User")] public string? UserId { get; set; }

    public string? Nickname { get; set; }

    public List<int>? OrderedQuestionIds { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [InverseProperty("Participants")] public QuizSessionDbTable Session { get; set; }

    [InverseProperty("SessionsParticipated")] public UserData? User { get; set; }
    [InverseProperty("Participant")] public List<UserAnswerDbTable> UserAnswers { get; set; }
}