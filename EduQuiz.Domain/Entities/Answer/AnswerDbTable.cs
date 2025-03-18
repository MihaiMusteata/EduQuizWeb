using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Question;

namespace EduQuiz.Domain.Entities.Answer;

public class AnswerDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid TrackingId { get; set; } = Guid.NewGuid();

    public string Text { get; set; }
    public bool IsCorrect { get; set; }

    [ForeignKey("Question")] public int QuestionId { get; set; }

    [InverseProperty("Answers")] public QuestionDbTable Question { get; set; }
}