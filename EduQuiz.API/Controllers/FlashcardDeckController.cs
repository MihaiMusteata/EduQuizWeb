using EduQuiz.Application.DTOs.FlashcardDeck;
using EduQuiz.Application.Services.FlashcardDeckService;
using EduQuiz.Domain.Entities.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/flashcard-deck")]
[ApiController]
[Authorize]
public class FlashcardDeckController: BaseController
{
    private readonly IFlashcardDeckService _flashcardDeckService;

    public FlashcardDeckController(IFlashcardDeckService flashcardDeckService)
    {
        _flashcardDeckService = flashcardDeckService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateFlashcardDeckAsync([FromBody] FlashcardDeckDto flashcardDeckDto)
    {
        var userId = GetUserIdFromJwt();

        var result = await _flashcardDeckService.CreateFlashcardDeckAsync(flashcardDeckDto, userId);
        if (result.Succeeded)
        {
            return Ok("Flashcard Deck created successfully");
        }
        return BadRequest($"Failed to create Flashcard Deck: {result.Errors}");
    }
    
}