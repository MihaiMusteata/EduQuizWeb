using EduQuiz.Application.Services.Library;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/library")]
[ApiController]
[Authorize]
public class LibraryController: BaseController
{
    private readonly ILibraryService _libraryService;

    public LibraryController(ILibraryService libraryService)
    {
        _libraryService = libraryService;
    }
    
    [HttpGet("my-library")]
    public async Task<IActionResult> GetMyLibrary()
    {
        var userId = GetUserIdFromJwt();
        var library = await _libraryService.GetLibraryByUserIdAsync(userId);
        return Ok(library);
    }
}