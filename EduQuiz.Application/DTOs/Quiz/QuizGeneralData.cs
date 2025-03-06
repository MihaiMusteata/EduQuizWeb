namespace EduQuiz.Application.DTOs.Quiz;

public class QuizGeneralData
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string CreatedAt { get; set; }
    public string Visibility { get; set; }
    public int TotalQuestions { get; set; }
}