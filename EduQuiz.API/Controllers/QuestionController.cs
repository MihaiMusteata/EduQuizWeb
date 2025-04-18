using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.Services.Question;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/question")]
[ApiController]
[Authorize]
public class QuestionController : BaseController
{
    private readonly IQuestionService _questionService;

    public QuestionController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet("by-index")]
    public async Task<IActionResult> GetQuestionByIndex([FromQuery] Guid quizId, [FromQuery] int index)
    {
        var question = await _questionService.GetQuestionByIndexAsync(quizId, index);
        if (question == null)
        {
            return NotFound();
        }

        return Ok(question);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetQuestions([FromQuery] Guid quizId)
    {
        var questions = await _questionService.GetQuestionsAsync(quizId);
        if (questions == null)
        {
            return NotFound();
        }

        return Ok(questions);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateQuestion([FromBody] QuestionDto questionDto, [FromQuery] Guid quizId)
    {
        var questionId = await _questionService.CreateQuestionAsync(quizId, questionDto);
        if (questionId == -1)
        {
            return BadRequest("Quiz Not Found");
        }

        return Ok(questionId);
    }

    [HttpPatch("update")]
    public async Task<IActionResult> UpdateQuestion([FromBody] QuestionDto questionDto)
    {
        var result = await _questionService.UpdateQuestionAsync(questionDto);
        if (result.Succeeded)
        {
            return Ok("Question Updated Successfully");
        }

        return BadRequest($"Question Update Failed: {result.Errors}");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion([FromRoute] int id)
    {
        var result = await _questionService.DeleteQuestionAsync(id);
        if (result.Succeeded)
        {
            return Ok("Question Deleted Successfully");
        }

        return BadRequest($"Question Deletion Failed: {result.Errors}");
    }
}