using EduQuiz.Application.DTOs.Flashcard;
using EduQuiz.Application.DTOs.FlashcardDeck;
using EduQuiz.Application.Mappers.Flashcard;
using EduQuiz.Application.Mappers.FlashcardDeck;
using EduQuiz.Domain.Entities.FlashcardDeck;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Application.Services.FlashcardDeckService;

public class FlashcardDeckService : IFlashcardDeckService
{
    private readonly EduQuizDbContext _context;

    public FlashcardDeckService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<IdentityResult> CreateFlashcardDeckAsync(FlashcardDeckDto flashcardDeckDto, string userId)
    {
        var newFlashcardDeck = flashcardDeckDto.ToEntity(userId);
        try
        {
            await _context.FlashcardDecks.AddAsync(newFlashcardDeck);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = e.Message });
        }
    }

    public async Task<FlashcardDeckDto?> GetFlashcardDeckByIdAsync(Guid id)
    {
        var flashcardDeck = await _context.FlashcardDecks
            .Include(x => x.Flashcards.OrderBy(f => f.Id))
            .OrderBy(f => f.Id)
            .FirstOrDefaultAsync(x => x.TrackingId == id);

        return flashcardDeck?.ToDto();
    }

    public async Task<IdentityResult> UpdateFlashcardDeckAsync(FlashcardDeckDto flashcardDeckDto)
    {
        var oldFlashcardDeck = await _context.FlashcardDecks
            .Include(x => x.Flashcards)
            .FirstOrDefaultAsync(x => x.TrackingId == flashcardDeckDto.Id);

        if (oldFlashcardDeck is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Flashcard Deck Not Found" });
        }

        oldFlashcardDeck.Title = flashcardDeckDto.Title;
        oldFlashcardDeck.Visibility = flashcardDeckDto.Visibility;

        UpdateFlashcards(oldFlashcardDeck, flashcardDeckDto.Flashcards);

        _context.FlashcardDecks.Update(oldFlashcardDeck);

        try
        {
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = $"Exception: {e.Message}" });
        }
    }

    private void UpdateFlashcards(FlashcardDeckDbTable flashcardDeck, List<FlashcardDto> updatedFlashcardsDto)
    {
        var updatedFlashcardIds = updatedFlashcardsDto.Select(x => x.Id).ToList();

        var flashcardsToRemove =
            flashcardDeck.Flashcards.Where(x => !updatedFlashcardIds.Contains(x.TrackingId)).ToList();
        _context.Flashcards.RemoveRange(flashcardsToRemove);

        var flashcardsToUpdate =
            flashcardDeck.Flashcards.Where(x => updatedFlashcardIds.Contains(x.TrackingId)).ToList();

        foreach (var flashcard in flashcardsToUpdate)
        {
            var updatedFlashcard = updatedFlashcardsDto.First(x => x.Id == flashcard.TrackingId);
            flashcard.FrontSideText = updatedFlashcard.FrontSideText;
            flashcard.BackSideText = updatedFlashcard.BackSideText;
            flashcard.Hint = updatedFlashcard.Hint;

            _context.Flashcards.Update(flashcard);
        }

        var flashcardsToAdd = updatedFlashcardsDto
            .Where(x => x.Id is null || x.Id == Guid.Empty)
            .Select(x => x.ToEntity())
            .ToList();

        flashcardDeck.Flashcards.AddRange(flashcardsToAdd);
    }

    public async Task<IdentityResult> DeleteFlashcardDeckAsync(Guid id)
    {
        var flashcardDeck = await _context.FlashcardDecks.FirstOrDefaultAsync(x => x.TrackingId == id);
        if (flashcardDeck is null)
        {
            return IdentityResult.Failed(new IdentityError { Description = "Flashcard Deck Not Found" });
        }

        try
        {
            _context.FlashcardDecks.Remove(flashcardDeck);
            await _context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return IdentityResult.Failed(new IdentityError { Description = e.Message });
        }

        return IdentityResult.Success;
    }
}