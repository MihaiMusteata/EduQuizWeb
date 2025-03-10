using EduQuiz.Application.DTOs.FlashcardDeck;
using EduQuiz.Application.DTOs.Question;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.FlashcardDeckService;

public interface IFlashcardDeckService
{
    Task<IdentityResult> CreateFlashcardDeckAsync(FlashcardDeckDto flashcardDeckDto, string userId);
    Task<IdentityResult> DeleteFlashcardDeckAsync(int id);
    Task<IdentityResult> UpdateFlashcardDeckAsync(FlashcardDeckDto flashcardDeckDto);
}