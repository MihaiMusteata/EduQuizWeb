namespace EduQuiz.API.Requests;

public class ImportRequest
{
    public string Format { get; set; }
    public string EntityType { get; set; }
    public IFormFile File { get; set; }
}