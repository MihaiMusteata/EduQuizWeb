namespace EduQuiz.Application.DTOs.QuizSession;

public class QuizSessionDto
{ 
    public Guid Id { get; set; }
    public string? AccessPin { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Status { get; set; }
    public int TotalQuestions { get; set; }
}