using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Domain.Entities.SessionParticipant;
using EduQuiz.Domain.Entities.User;
using EduQuiz.Domain.ValueObjects;

namespace EduQuiz.Domain.Entities.QuizSession;

public class QuizSessionDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [ForeignKey("Quiz")] public Guid QuizId { get; set; }

    public string? AccessPin { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public bool ShuffleQuestions { get; set; }
    public bool ShuffleAnswers { get; set; }
    public QuizSessionStatus Status { get; set; }

    [ForeignKey("HostUser")] public string HostUserId { get; set; }

    [InverseProperty("SessionsHosted")] public UserData HostUser { get; set; }

    [InverseProperty("Sessions")] public QuizDbTable Quiz { get; set; }

    [InverseProperty("Session")] public List<SessionParticipantDbTable> Participants { get; set; }

}