using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Flashcard;
using EduQuiz.Domain.Entities.User;

namespace EduQuiz.Domain.Entities.FlashcardDeck;

public class FlashcardDeckDbTable
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Visibility { get; set; }

    [ForeignKey("User")] public string UserId { get; set; }

    [InverseProperty("FlashcardDeck")] public ICollection<FlashcardDbTable> Flashcards { get; set; }

    public UserData User { get; set; }
}