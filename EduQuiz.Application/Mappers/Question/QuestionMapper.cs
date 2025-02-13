using EduQuiz.Application.DTOs.Question;
using EduQuiz.Application.Mappers.Answer;
using EduQuiz.Domain.Entities.Question;

namespace EduQuiz.Application.Mappers.Question;

public static class QuestionMapper
{
    public static QuestionDto ToDto (this QuestionDbTable entity)
    {
        return new QuestionDto
        {
            Id = entity.Id,
            Text = entity.Text,
            Type = entity.Type,
            Hint = entity.Hint,
            Answers = entity.Answers.Select(x => x.ToDto()).ToList()
        };
    }
    
    public static QuestionDbTable ToEntity (this QuestionDto dto)
    {
        return new QuestionDbTable
        {
            Text = dto.Text,
            Type = dto.Type,
            Hint = dto.Hint,
            Answers = dto.Answers.Select(x => x.ToEntity()).ToList()
        };
    }
    
}