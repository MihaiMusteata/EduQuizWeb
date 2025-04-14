using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Question;
using EduQuiz.Domain.Entities.QuizSession;
using EduQuiz.Domain.Entities.User;
using EduQuiz.Domain.ValueObjects;

namespace EduQuiz.Domain.Entities.Quiz;

public class QuizDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Visibility Visibility { get; set; }

    [ForeignKey("User")] public string UserId { get; set; }

    [InverseProperty("Quiz")] public List<QuestionDbTable> Questions { get; set; }

    [InverseProperty("Quizzes")] public UserData User { get; set; }

    [InverseProperty("Quiz")] public List<QuizSessionDbTable> Sessions { get; set; }
}