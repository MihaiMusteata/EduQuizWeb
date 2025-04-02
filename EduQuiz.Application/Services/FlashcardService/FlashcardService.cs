using EduQuiz.Application.DTOs.Flashcard;
using EduQuiz.Application.Mappers.Flashcard;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Application.Services.FlashcardService;

public class FlashcardService : IFlashcardService
{
    private readonly EduQuizDbContext _context;

    public FlashcardService(EduQuizDbContext context)
    {
        _context = context;
    }
    
    public async Task<int> CreateFlashcardAsync(Guid flashcardDekId, FlashcardDto flashcardDto)
    {
        var flashcardDeck = await _context.FlashcardDecks.FindAsync(flashcardDekId);
        if (flashcardDeck is null)
        {
            return -1;
        }

        var flashcard = flashcardDto.ToEntity();
        flashcard.FlashcardDeckId = flashcardDekId;

        _context.Flashcards.Add(flashcard);
        await _context.SaveChangesAsync();

        return flashcard.Id;
    }

    public async Task<IdentityResult> UpdateFlashcardAsync(FlashcardDto flashcardDto)
    {
        var oldFlashcard = await _context.Flashcards.FindAsync(flashcardDto.Id);

        if (oldFlashcard is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Flashcard Not Found" });
        }
        
        var isModified = false;
        
        if (!string.IsNullOrEmpty(flashcardDto.FrontSideText))
        {
            oldFlashcard.FrontSideText = flashcardDto.FrontSideText;
            isModified = true;
        }
        
        if (!string.IsNullOrEmpty(flashcardDto.BackSideText))
        {
            oldFlashcard.BackSideText = flashcardDto.BackSideText;
            isModified = true;
        }
        
        if (!string.IsNullOrEmpty(flashcardDto.Hint))
        {
            oldFlashcard.Hint = flashcardDto.Hint;
            isModified = true;
        }
        if (!isModified)
        {
            return IdentityResult.Success;
        }
 
        try
        {
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = "Concurrency error: Flashcard was modified by another user." });
        }
        catch (DbUpdateException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = $"Database error: {ex.InnerException?.Message ?? ex.Message}" });
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"General error: {e.Message}" });
        }
    }

    public async Task<IdentityResult> DeleteFlashcardAsync(int id)
    {
        var flashcard = await _context.Flashcards.FindAsync(id);
        if (flashcard is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Flashcard Not Found" });
        }

        try
        {
            _context.Flashcards.Remove(flashcard);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = "Concurrency error: Flashcard was modified by another user." });
        }
        catch (DbUpdateException ex)
        {
            return IdentityResult.Failed(new IdentityError
                { Description = $"Database error: {ex.InnerException?.Message ?? ex.Message}" });
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"General error: {e.Message}" });
        }
    }
}