using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Answer;
using EduQuiz.Domain.Entities.Quiz;

namespace EduQuiz.Domain.Entities.Question;

public class QuestionDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid TrackingId { get; set; } = Guid.NewGuid();

    public string Text { get; set; }
    public string Type { get; set; }
    public string? Hint { get; set; }

    [ForeignKey("Quiz")] public int QuizId { get; set; }

    [InverseProperty("Questions")] public QuizDbTable Quiz { get; set; }

    [InverseProperty("Question")] public List<AnswerDbTable> Answers { get; set; }
}