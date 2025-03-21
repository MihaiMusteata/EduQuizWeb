namespace EduQuiz.Application.DTOs.Answer;

public class AnswerGiven
{
    public Guid QuestionId { get; set; }
    public string UserAnswer { get; set; }
}