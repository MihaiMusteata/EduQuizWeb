using EduQuiz.Application.DTOs.Flashcard;
using EduQuiz.Application.Services.FlashcardService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/flashcard")]
[ApiController]
[Authorize]
public class FlashcardController : BaseController
{
    private readonly IFlashcardService _flashcardService;

    public FlashcardController(IFlashcardService flashcardService)
    {
        _flashcardService = flashcardService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateFlashcardAsync([FromBody] FlashcardDto flashcardDto, [FromQuery] Guid flashcardDeckId)
    {
        var flashcardId = await _flashcardService.CreateFlashcardAsync(flashcardDeckId, flashcardDto);
        if (flashcardId == -1)
        {
            return BadRequest("Flashcard Deck Not Found");
        }

        return Ok(flashcardId);
    }

    [HttpPatch("update")]
    public async Task<IActionResult> UpdateFlashcardAsync([FromBody] FlashcardDto flashcardDto)
    {
        var result = await _flashcardService.UpdateFlashcardAsync(flashcardDto);
        if (result.Succeeded)
        {
            return Ok("Flashcard  updated successfully");
        }

        return BadRequest($"Failed to update Flashcard : {result.Errors}");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFlashcardAsync([FromRoute] int id)
    {
        var result = await _flashcardService.DeleteFlashcardAsync(id);
        if (result.Succeeded)
        {
            return Ok("Flashcard  deleted successfully");
        }

        return BadRequest($"Failed to delete Flashcard : {result.Errors}");
    }
}