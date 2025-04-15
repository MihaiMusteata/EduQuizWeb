using Newtonsoft.Json;
using System.Xml.Serialization;

namespace EduQuiz.Application.DTOs.Flashcard;

public class FlashcardDto
{
    [XmlIgnore]
    [JsonIgnore]
    public int? Id { get; set; }
    public string? FrontSideText { get; set; }
    public string? BackSideText { get; set; }
    public string? Hint { get; set; }
}