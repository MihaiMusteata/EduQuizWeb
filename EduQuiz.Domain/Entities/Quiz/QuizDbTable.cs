using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.Entities.User;

namespace EduQuiz.Domain.Entities.Quiz;

public class QuizDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid TrackingId { get; set; } = Guid.NewGuid();

    public string Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Visibility { get; set; }

    [ForeignKey("User")] public string UserId { get; set; }

    [InverseProperty("Quiz")] public List<QuestionDbTable> Questions { get; set; }

    [InverseProperty("Quizzes")] public UserData User { get; set; }
}