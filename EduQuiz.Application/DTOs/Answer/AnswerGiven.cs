namespace EduQuiz.Application.DTOs.Answer;

public class AnswerGiven
{
    public int QuestionId { get; set; }
    public List<int>? SelectedIds { get; set; }
    public string? UserAnswer { get; set; }
}