using EduQuiz.Application.DTOs.Answer;
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
        if (result is not null)
        {
            return Ok(result);
        }

        return BadRequest($"Failed to create Quiz");
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> SubmitQuiz([FromBody] List<AnswerGiven> answers, Guid id)
    {
        var userId = GetUserIdFromJwt();
        // var result = await _quizService.SubmitQuizAsync(answers, id, userId);

        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuizById(Guid id)
    {
        var quiz = await _quizService.GetQuizByIdAsync(id);
        if (quiz == null)
        {
            return NotFound("Quiz Not Found");
        }

        return Ok(quiz);
    }

    [HttpGet("{id}/total-questions")]
    public async Task<IActionResult> GetTotalQuestions(Guid id)
    {
        var total = await _quizService.GetTotalQuestions(id);
        if (total == -1)
        {
            return NotFound("Quiz Not Found");
        }

        return Ok(total);
    }

    [HttpPatch("update")]
    public async Task<IActionResult> UpdateQuiz(QuizDto quizDto)
    {
        var result = await _quizService.UpdateQuizAsync(quizDto);
        if (result.Succeeded)
        {
            return Ok("Quiz Updated Successfully");
        }

        return BadRequest($"Quiz Update Failed: {result.Errors}");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(Guid id)
    {
        var result = await _quizService.DeleteQuizAsync(id);
        if (result.Succeeded)
        {
            return Ok("Quiz Deleted Successfully");
        }

        return BadRequest($"Quiz Deletion Failed: {result.Errors}");
    }
}