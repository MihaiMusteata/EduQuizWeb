using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Question;

namespace EduQuiz.Domain.Entities.Answer;

public class AnswerDbTable
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
    
    [ForeignKey("Question")]
    public string QuestionId { get; set; }
    
    [InverseProperty("Answers")]
    public QuestionDbTable Question { get; set; }
}