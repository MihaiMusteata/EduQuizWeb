using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.Flashcard;
using EduQuiz.Domain.Entities.User;
using EduQuiz.Domain.ValueObjects.Visibility;

namespace EduQuiz.Domain.Entities.FlashcardDeck;

public class FlashcardDeckDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Visibility Visibility { get; set; }

    [ForeignKey("User")] public string UserId { get; set; }

    [InverseProperty("FlashcardDeck")] public List<FlashcardDbTable> Flashcards { get; set; }

    public UserData User { get; set; }
}