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
}