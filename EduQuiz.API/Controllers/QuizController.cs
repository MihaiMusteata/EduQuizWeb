using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Services.Quiz;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/quiz")]
[ApiController]
[Authorize]
public class QuizController : BaseController
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateQuiz(QuizDto quizDto)
    {
        var userId = GetUserIdFromJwt();

        var result = await _quizService.CreateQuizAsync(quizDto, userId);
        if (result.Succeeded)
        {
            return Ok("Quiz Created Successfully");
        }

        return BadRequest($"Quiz Creation Failed: {result.Errors}");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuizById(int id)
    {
        var quiz = await _quizService.GetQuizByIdAsync(id);
        if (quiz == null)
        {
            return NotFound("Quiz Not Found");
        }

        return Ok(quiz);
    }
    
    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuiz(QuizDto quizDto)
    {
        var result = await _quizService.UpdateQuizAsync(quizDto);
        if (result.Succeeded)
        {
            return Ok("Quiz Updated Successfully");
        }

        return BadRequest($"Quiz Update Failed: {result.Errors}");
    }
    
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var result = await _quizService.DeleteQuizAsync(id);
        if (result.Succeeded)
        {
            return Ok("Quiz Deleted Successfully");
        }

        return BadRequest($"Quiz Deletion Failed: {result.Errors}");
    }
}