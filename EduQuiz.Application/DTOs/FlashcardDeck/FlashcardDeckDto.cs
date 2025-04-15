using Newtonsoft.Json;
using System.Xml.Serialization;
using EduQuiz.Application.DTOs.ExportableDto;
using EduQuiz.Application.DTOs.Flashcard;

namespace EduQuiz.Application.DTOs.FlashcardDeck;

public class FlashcardDeckDto : IExportableDto
{
    [XmlIgnore]
    [JsonIgnore]
    public Guid? Id { get; set; }
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Visibility { get; set; }
    public List<FlashcardDto> Flashcards { get; set; }
}