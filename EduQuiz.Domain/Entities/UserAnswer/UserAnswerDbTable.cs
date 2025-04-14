using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.Entities.SessionParticipant;
using EduQuiz.Domain.Entities.User;

namespace EduQuiz.Domain.Entities.UserAnswer;

public class UserAnswerDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [ForeignKey("Session")] public Guid SessionId { get; set; }

    [ForeignKey("Participant")] public int ParticipantId { get; set; }

    public string? Nickname { get; set; }

    [ForeignKey("Question")] public int QuestionId { get; set; }

    public List<int>? SelectedAnswerId { get; set; }

    public string? AnswerText { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public int Points { get; set; }

    [InverseProperty("UserAnswers")] public SessionParticipantDbTable Participant { get; set; }

    [InverseProperty("AnswersGiven")] public UserData? User { get; set; }

    [InverseProperty("AnswersGiven")] public QuestionDbTable Question { get; set; }
}