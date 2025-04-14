using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Answer;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Domain.Entities.UserAnswer;
using EduQuiz.Domain.ValueObjects;

namespace EduQuiz.Domain.Entities.Question;

public class QuestionDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Text { get; set; }
    public QuestionType Type { get; set; }
    public string? Hint { get; set; }

    [ForeignKey("Quiz")] public Guid QuizId { get; set; }

    [InverseProperty("Questions")] public QuizDbTable Quiz { get; set; }

    [InverseProperty("Question")] public List<AnswerDbTable> Answers { get; set; }

    [InverseProperty("Question")] public List<UserAnswerDbTable> AnswersGiven { get; set; }
}