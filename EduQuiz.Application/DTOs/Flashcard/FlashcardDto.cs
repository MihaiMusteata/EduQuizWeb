namespace EduQuiz.Application.DTOs.Flashcard;

public class FlashcardDto
{
    public string Id { get; set; }
    public string FrontSideText { get; set; }
    public string BackSideText { get; set; }
    public string? Hint { get; set; }
}