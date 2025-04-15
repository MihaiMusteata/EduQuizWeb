using EduQuiz.Application.DTOs.ExportableDto;
using Microsoft.AspNetCore.Http;

namespace EduQuiz.Application.Services.ExportImport;

public interface IExportImportService
{
    Task<string> ExportToJson<T>(Guid id) where T : class, IExportableDto;
    Task<string> ExportToXml<T>(Guid id) where T : class, IExportableDto;
    Task<T> ImportFromJson<T>(IFormFile file) where T : class, IExportableDto;
    Task<T> ImportFromXml<T>(IFormFile file) where T : class, IExportableDto;
}