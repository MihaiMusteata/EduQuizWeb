using EduQuiz.Application.DTOs.FlashcardDeck;
using EduQuiz.Application.Mappers.Flashcard;
using EduQuiz.Domain.Entities.FlashcardDeck;
using EduQuiz.Domain.ValueObjects.Visibility;

namespace EduQuiz.Application.Mappers.FlashcardDeck;

public static class FlashcardDeckMapper
{
    public static FlashcardDeckDto ToDto(this FlashcardDeckDbTable entity)
    {
        return new FlashcardDeckDto
        {
            Id = entity.Id,
            Title = entity.Title,
            CreatedAt = entity.CreatedAt,
            Visibility = entity.Visibility.Value,
            Flashcards = entity.Flashcards.Select(x => x.ToDto()).ToList()
        };
    }

    public static FlashcardDeckDbTable ToEntity(this FlashcardDeckDto dto, string userId)
    {
        return new FlashcardDeckDbTable
        {
            Title = dto.Title,
            Visibility = Visibility.FromString(dto.Visibility),
            UserId = userId,
            Flashcards = dto.Flashcards.Select(x => x.ToEntity()).ToList()
        };
    }
    
}