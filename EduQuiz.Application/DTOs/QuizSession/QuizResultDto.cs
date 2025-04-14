using EduQuiz.Application.DTOs.Question;

namespace EduQuiz.Application.DTOs.QuizSession;

public class QuizResultDto
{
    public float FinalScore {get; set;}
    public List<QuestionDto> Questions { get; set; }
}