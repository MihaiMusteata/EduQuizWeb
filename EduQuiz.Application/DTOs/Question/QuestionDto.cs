using EduQuiz.Application.DTOs.Answer;

namespace EduQuiz.Application.DTOs.Question;

public class QuestionDto
{
    public string? Id { get; set; }
    public string Text { get; set; }
    public string Type { get; set; }
    public string? Hint { get; set; }
    public List<AnswerDto> Answers { get; set; }
}