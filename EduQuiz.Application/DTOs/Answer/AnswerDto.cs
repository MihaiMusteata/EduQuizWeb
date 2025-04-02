namespace EduQuiz.Application.DTOs.Answer;

public class AnswerDto: AnswerSummaryDto
{
    public bool? IsCorrect { get; set; }
}