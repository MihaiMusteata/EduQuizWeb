using Newtonsoft.Json;
using System.Xml.Serialization;
using EduQuiz.Application.DTOs.ExportableDto;
using EduQuiz.Application.DTOs.Question;

namespace EduQuiz.Application.DTOs.Quiz;

public class QuizDto : IExportableDto
{
    [XmlIgnore]
    [JsonIgnore]
    public Guid? Id { get; set; }
    public string? Title { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? Visibility { get; set; }
    public List<QuestionDto>? Questions { get; set; }
}