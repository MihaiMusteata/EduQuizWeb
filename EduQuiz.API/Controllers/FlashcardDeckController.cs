using EduQuiz.Application.DTOs.FlashcardDeck;
using EduQuiz.Application.Services.FlashcardDeckService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/flashcard-deck")]
[ApiController]
[Authorize]
public class FlashcardDeckController : BaseController
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
        if (result is not null)
        {
            return Ok(result);
        }

        return BadRequest($"Failed to create Flashcard Deck");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFlashcardDeckByIdAsync(Guid id)
    {
        var flashcardDeck = await _flashcardDeckService.GetFlashcardDeckByIdAsync(id);
        if (flashcardDeck == null)
        {
            return NotFound("Flashcard Deck not found");
        }

        return Ok(flashcardDeck);
    }

    [HttpPatch("update")]
    public async Task<IActionResult> UpdateFlashcardDeckAsync([FromBody] FlashcardDeckDto flashcardDeckDto)
    {
        var result = await _flashcardDeckService.UpdateFlashcardDeckAsync(flashcardDeckDto);
        if (result.Succeeded)
        {
            return Ok("Flashcard Deck updated successfully");
        }

        return BadRequest($"Failed to update Flashcard Deck: {result.Errors}");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFlashcardDeckAsync(Guid id)
    {
        var result = await _flashcardDeckService.DeleteFlashcardDeckAsync(id);
        if (result.Succeeded)
        {
            return Ok("Flashcard Deck deleted successfully");
        }

        return BadRequest($"Failed to delete Flashcard Deck: {result.Errors}");
    }
}