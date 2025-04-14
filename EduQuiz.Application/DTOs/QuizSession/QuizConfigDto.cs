namespace EduQuiz.Application.DTOs.QuizSession;

public class QuizConfigDto
{
    public int? NumberOfMinutes { get; set; }
    public bool? WithTimer { get; set; }
    public bool? ShuffleQuestions { get; set; }
    public bool? ShuffleAnswers { get; set; }
}