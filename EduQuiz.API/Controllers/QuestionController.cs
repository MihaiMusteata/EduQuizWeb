using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.Services.Question;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class QuestionController : BaseController
{
    private readonly IQuestionService _questionService;

    public QuestionController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuestion(QuestionDto questionDto)
    {
        var result = await _questionService.UpdateQuestionAsync(questionDto);
        if (result.Succeeded)
        {
            return Ok("Question Updated Successfully");
        }

        return BadRequest($"Question Update Failed: {result.Errors}");
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        var result = await _questionService.DeleteQuestionAsync(id);
        if (result.Succeeded)
        {
            return Ok("Question Deleted Successfully");
        }

        return BadRequest($"Question Deletion Failed: {result.Errors}");
    }
}