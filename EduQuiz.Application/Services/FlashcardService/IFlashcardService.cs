using EduQuiz.Application.DTOs.Flashcard;
using Microsoft.AspNetCore.Identity;

namespace EduQuiz.Application.Services.FlashcardService;

public interface IFlashcardService
{
    Task<int> CreateFlashcardAsync(Guid flashcardDekId, FlashcardDto flashcardDto);
    Task<IdentityResult> UpdateFlashcardAsync(FlashcardDto flashcardDto);
    Task<IdentityResult> DeleteFlashcardAsync(int id);
}