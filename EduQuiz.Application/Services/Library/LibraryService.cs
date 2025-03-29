using EduQuiz.Application.DTOs.Library;
using EduQuiz.Application.Extensions;
using EduQuiz.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EduQuiz.Application.Services.Library;

public class LibraryService : ILibraryService
{
    private readonly EduQuizDbContext _context;

    public LibraryService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<List<LibraryItemDto>> GetLibraryByUserIdAsync(string userId)
    {
        var libraryItems = new List<LibraryItemDto>();

        libraryItems.AddRange(await _context.Quizzes
            .Where(x => x.UserId == userId)
            .Select(x => new LibraryItemDto
            {
                Id = x.Id,
                Activity = "Quizzes",
                Title = x.Title,
                CreatedAt = x.CreatedAt.ToUserTimeZone(),
                Visibility = x.Visibility.Value,
                TotalItems = x.Questions.Count
            })
            .ToListAsync());

        libraryItems.AddRange(await _context.FlashcardDecks
            .Where(x => x.UserId == userId)
            .Select(x => new LibraryItemDto
            {
                Id = x.Id,
                Activity = "Flashcards",
                Title = x.Title,
                CreatedAt = x.CreatedAt.ToUserTimeZone(),
                Visibility = x.Visibility.Value,
                TotalItems = x.Flashcards.Count
            })
            .ToListAsync());

        return libraryItems.OrderBy(x => x.CreatedAt).ToList();
    }
}