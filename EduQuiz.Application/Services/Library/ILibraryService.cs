using EduQuiz.Application.DTOs.Library;

namespace EduQuiz.Application.Services.Library;

public interface ILibraryService
{
    Task<List<LibraryItemDto>> GetLibraryByUserIdAsync(string userId);
}