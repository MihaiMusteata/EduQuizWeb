using EduQuiz.Application.DTOs.Flashcard;
using EduQuiz.Domain.Entities.Flashcard;

namespace EduQuiz.Application.Mappers.Flashcard;

public static class FlashcardMapper
{
    public static FlashcardDto ToDto(this FlashcardDbTable entity)
    {
        return new FlashcardDto
        {
            Id = entity.Id,
            FrontSideText = entity.FrontSideText,
            BackSideText = entity.BackSideText,
            Hint = entity.Hint ?? string.Empty
        };
    }

    public static FlashcardDbTable ToEntity(this FlashcardDto dto)
    {
        return new FlashcardDbTable
        {
            FrontSideText = dto.FrontSideText ?? string.Empty,
            BackSideText = dto.BackSideText ?? string.Empty,
            Hint = dto.Hint
        };
    }
    
}