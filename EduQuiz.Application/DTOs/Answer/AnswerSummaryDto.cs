using Newtonsoft.Json;
using System.Xml.Serialization;

namespace EduQuiz.Application.DTOs.Answer;

public class AnswerSummaryDto
{
    [XmlIgnore]
    [JsonIgnore]
    public int? Id { get; set; }
    public string? Text { get; set; }
}