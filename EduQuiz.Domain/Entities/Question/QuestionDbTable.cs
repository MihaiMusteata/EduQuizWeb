using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Answer;
using EduQuiz.Domain.Entities.Quiz;

namespace EduQuiz.Domain.Entities.Question;

public class QuestionDbTable
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string Text { get; set; }
    public string Type { get; set; }
    public string? Hint { get; set; }

    [ForeignKey("Quiz")]
    public string QuizId { get; set; }

    [InverseProperty("Questions")]
    public QuizDbTable Quiz { get; set; }
    
    [InverseProperty("Question")]
    public ICollection<AnswerDbTable> Answers { get; set; }
}