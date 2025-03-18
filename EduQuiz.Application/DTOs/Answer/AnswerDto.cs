namespace EduQuiz.Application.DTOs.Answer;

public class AnswerDto
{
    public Guid? Id { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}