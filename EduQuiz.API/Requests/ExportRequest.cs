namespace EduQuiz.API.Requests;

public class ExportRequest
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Format { get; set; }
    public string EntityType { get; set; }
}