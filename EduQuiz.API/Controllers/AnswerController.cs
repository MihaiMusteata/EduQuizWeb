using EduQuiz.Application.DTOs.Answer;
using EduQuiz.Application.Services.Answer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/answer")]
[ApiController]
[Authorize]
public class AnswerController : ControllerBase
{
    private readonly IAnswerService _answerService;

    public AnswerController(IAnswerService answerService)
    {
        _answerService = answerService;
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateAnswer(AnswerDto answerDto)
    {
        var result = await _answerService.UpdateAnswerAsync(answerDto);
        if (result.Succeeded)
        {
            return Ok("Answer Updated Successfully");
        }

        return BadRequest($"Answer Update Failed: {result.Errors}");
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteAnswer(int id)
    {
        var result = await _answerService.DeleteAnswerAsync(id);
        if (result.Succeeded)
        {
            return Ok("Answer Deleted Successfully");
        }

        return BadRequest($"Answer Deletion Failed: {result.Errors}");
    }
}