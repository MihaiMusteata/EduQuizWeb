using EduQuiz.API.Requests;
using EduQuiz.Application.DTOs.Flashcard;
using EduQuiz.Application.DTOs.FlashcardDeck;
using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Services.ExportImport;
using EduQuiz.Application.Services.FlashcardDeckService;
using EduQuiz.Application.Services.FlashcardService;
using EduQuiz.Application.Services.Quiz;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduQuiz.API.Controllers;

[Route("api/export-import")]
[Authorize]
[ApiController]
public class ExportImportController : BaseController
{
    private readonly IExportImportService _exportImportService;
    private readonly IQuizService _quizService;
    private readonly IFlashcardDeckService _flashcardDeckService;

    public ExportImportController(IExportImportService exportImportService, IQuizService quizService,
        IFlashcardDeckService flashcardDeckService)
    {
        _exportImportService = exportImportService;
        _quizService = quizService;
        _flashcardDeckService = flashcardDeckService;
    }

    [HttpPost("export")]
    public async Task<IActionResult> Export([FromBody] ExportRequest request)
    {
        if (string.IsNullOrEmpty(request.Format) ||
            !new[] { "JSON", "XML" }.Contains(request.Format, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("Invalid format. Use 'JSON' or 'XML'.");
        }

        string content;
        string fileName;
        string contentType;

        try
        {
            if (request.EntityType.Equals("Quiz", StringComparison.OrdinalIgnoreCase))
            {
                if (request.Format.Equals("JSON", StringComparison.OrdinalIgnoreCase))
                {
                    content = await _exportImportService.ExportToJson<QuizDto>(request.Id);
                    fileName = $"quiz_{request.Title}.json";
                    contentType = "application/json";
                }
                else
                {
                    content = await _exportImportService.ExportToXml<QuizDto>(request.Id);
                    fileName = $"quiz_{request.Title}.xml";
                    contentType = "application/xml";
                }
            }
            else if (request.EntityType.Equals("Flashcard", StringComparison.OrdinalIgnoreCase))
            {
                if (request.Format.Equals("JSON", StringComparison.OrdinalIgnoreCase))
                {
                    content = await _exportImportService.ExportToJson<FlashcardDeckDto>(request.Id);
                    fileName = $"flashcard_{request.Title}.json";
                    contentType = "application/json";
                }
                else
                {
                    content = await _exportImportService.ExportToXml<FlashcardDeckDto>(request.Id);
                    fileName = $"flashcard_{request.Title}.xml";
                    contentType = "application/xml";
                }
            }
            else
            {
                return BadRequest("Invalid entity type. Use 'Quiz' or 'Flashcard'.");
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(content);
            return File(bytes, contentType, fileName);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import([FromForm] ImportRequest request)
    {
        var userId = GetUserIdFromJwt();
        if (string.IsNullOrEmpty(request.Format) ||
            !new[] { "JSON", "XML" }.Contains(request.Format, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("Invalid format. Use 'JSON' or 'XML'.");
        }

        if (request.File.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            if (request.EntityType.Equals("Quiz", StringComparison.OrdinalIgnoreCase))
            {
                QuizDto quizDto;
                if (request.Format.Equals("JSON", StringComparison.OrdinalIgnoreCase))
                {
                    quizDto = await _exportImportService.ImportFromJson<QuizDto>(request.File);
                }
                else
                {
                    quizDto = await _exportImportService.ImportFromXml<QuizDto>(request.File);
                }

                var result = await _quizService.CreateQuizAsync(quizDto, userId);
                if (result is not null)
                {
                    return Ok(result);
                }

                return BadRequest($"Failed to create Quiz");
            }
            else
            {
                if (request.EntityType.Equals("Flashcard", StringComparison.OrdinalIgnoreCase))
                {
                    FlashcardDeckDto flashcardDto;
                    if (request.Format.Equals("JSON", StringComparison.OrdinalIgnoreCase))
                    {
                        flashcardDto = await _exportImportService.ImportFromJson<FlashcardDeckDto>(request.File);
                    }
                    else
                    {
                        flashcardDto = await _exportImportService.ImportFromXml<FlashcardDeckDto>(request.File);
                    }

                    var result = await _flashcardDeckService.CreateFlashcardDeckAsync(flashcardDto, userId);
                    if (result is not null)
                    {
                        return Ok("result");
                    }

                    return BadRequest($"Failed to create Flashcard Deck");
                }

                return BadRequest("Invalid entity type. Use 'Quiz' or 'Flashcard'.");
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}