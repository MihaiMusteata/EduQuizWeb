using EduQuiz.Application.DTOs.FlashcardDeck;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.FlashcardDeckService;

public interface IFlashcardDeckService
{
    Task<IdentityResult> CreateFlashcardDeckAsync(FlashcardDeckDto flashcardDeckDto, string userId);
    Task<FlashcardDeckDto?> GetFlashcardDeckByIdAsync(Guid id);
    Task<IdentityResult> UpdateFlashcardDeckAsync(FlashcardDeckDto flashcardDeckDto);
    Task<IdentityResult> DeleteFlashcardDeckAsync(Guid id);
}