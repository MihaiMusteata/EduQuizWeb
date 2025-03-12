namespace EduQuiz.Application.DTOs.Library;

public class LibraryItemDto
{
    public int Id { get; set; }
    public string Activity { get; set; }
    public string Title { get; set; }
    public string CreatedAt { get; set; }
    public string Visibility { get; set; }
    public int TotalItems { get; set; }
}