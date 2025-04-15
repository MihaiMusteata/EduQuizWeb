using System.Xml.Serialization;
using EduQuiz.Application.DTOs.ExportableDto;
using EduQuiz.Application.DTOs.Flashcard;
using EduQuiz.Application.DTOs.Quiz;
using EduQuiz.Application.Mappers.FlashcardDeck;
using EduQuiz.Application.Mappers.Quiz;
using EduQuiz.Domain.Entities.FlashcardDeck;
using EduQuiz.Domain.Entities.Quiz;
using EduQuiz.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace EduQuiz.Application.Services.ExportImport;

public class ExportImportService : IExportImportService
{
    private readonly EduQuizDbContext _context;

    public ExportImportService(EduQuizDbContext context)
    {
        _context = context;
    }

    public async Task<string> ExportToJson<T>(Guid id) where T : class, IExportableDto
    {
        object entity = typeof(T) switch
        {
            Type t when t == typeof(QuizDto) => await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id),
            Type t when t == typeof(FlashcardDto) => await _context.FlashcardDecks
                .Include(f => f.Flashcards)
                .FirstOrDefaultAsync(f => f.Id == id),
            _ => throw new ArgumentException("Unsupported entity type.")
        };

        if (entity == null)
        {
            throw new Exception($"{typeof(T).Name} not found.");
        }
        
        var dto = entity switch
        {
            QuizDbTable quiz => quiz.ToDto() as T,
            FlashcardDeckDbTable flashcard => flashcard.ToDto() as T,
            _ => throw new ArgumentException("Invalid entity type.")
        };

        return JsonConvert.SerializeObject(dto, new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            StringEscapeHandling = StringEscapeHandling.Default
        });
    }

    public async Task<string> ExportToXml<T>(Guid id) where T : class, IExportableDto
    {
        object entity = typeof(T) switch
        {
            Type t when t == typeof(QuizDto) => await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id),
            Type t when t == typeof(FlashcardDto) => await _context.FlashcardDecks
                .Include(f => f.Flashcards)
                .FirstOrDefaultAsync(f => f.Id == id),
            _ => throw new ArgumentException("Unsupported entity type.")
        };


        if (entity == null)
        {
            throw new Exception($"{typeof(T).Name} not found.");
        }

        var dto = entity switch
        {
            QuizDbTable quiz => quiz.ToDto() as T,
            FlashcardDeckDbTable flashcard => flashcard.ToDto() as T,
            _ => throw new ArgumentException("Invalid entity type.")
        };

        var serializer = new XmlSerializer(typeof(T));
        await using var stringWriter = new StringWriter();
        serializer.Serialize(stringWriter, dto);
        return stringWriter.ToString();
    }

    public async Task<T> ImportFromJson<T>(IFormFile file) where T : class, IExportableDto
    {
        if (file == null || file.Length == 0)
        {
            throw new Exception("Invalid file.");
        }

        await using var stream = file.OpenReadStream();
        var dto = await JsonSerializer.DeserializeAsync<T>(stream);

        if (dto == null)
        {
            throw new Exception("Failed to deserialize JSON file.");
        }

        return dto;
    }

    public async Task<T> ImportFromXml<T>(IFormFile file) where T : class, IExportableDto
    {
        if (file == null || file.Length == 0)
        {
            throw new Exception("Invalid file.");
        }

        await using var stream = file.OpenReadStream();
        var serializer = new XmlSerializer(typeof(T));
        var dto = serializer.Deserialize(stream) as T;

        if (dto == null)
        {
            throw new Exception("Failed to deserialize XML file.");
        }

        return dto;
    }
}