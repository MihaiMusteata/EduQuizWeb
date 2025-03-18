using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EduQuiz.Domain.Entities.FlashcardDeck;

namespace EduQuiz.Domain.Entities.Flashcard;

public class FlashcardDbTable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid TrackingId { get; set; } = Guid.NewGuid();

    public string FrontSideText { get; set; }
    public string BackSideText { get; set; }
    public string? Hint { get; set; }

    [ForeignKey(("FlashcardDeck"))] public int FlashcardDeckId { get; set; }

    public FlashcardDeckDbTable FlashcardDeck { get; set; }
}